#!/usr/bin/env python3
"""Base44 sandbox dev server for Web Dashers — setup helper, not part of the app.

Static file server for the repository root (same behaviour as the plain
`python -m http.server` it replaces, threaded, reading files from the bind-mounted
clone per request). Two extras are added, and BOTH are inert unless
BASE44_PREVIEW_MODE is exactly "1":

  1. The app's account routes (/api/auth/*, /api/saves) are answered by a
     same-origin development stub. The real account server is a separate service
     whose source is not in this repository (see AGENTS.md), and the hosted
     backend at https://webdasher-backend.itzar.dev sends no CORS headers for a
     preview origin — the client's automatic session check therefore fails with a
     CORS/network error there. The stub answers "not signed in" ({"user": null}),
     which is the truth in an environment that has no account backend, and never
     authenticates anybody.
  2. `window.__previewLocalApi = true` is injected into index.html so that
     assets/scripts/utils/api-config.js uses that same-origin stub instead of the
     hosted backend, exactly as the app already does on localhost. Nothing else
     is rewritten.

With BASE44_PREVIEW_MODE unset (or any other value) this is a plain, unmodified
static file server and the app keeps talking to the hosted backend.

The server always serves efficiently, in both modes: HTTP/1.1 keep-alive (a boot
load pulls ~200 files, and the platform proxy pays a connection setup per request
when the server closes after every response) and gzip for the uncompressed text
assets (the game scripts alone are several MB). Neither changes what is served —
same files, same bytes.

It also tells browsers how to cache. A boot load is ~27 MB of media across ~170
separate files, and none of it is worth re-fetching on the next preview load, so
media is reusable (`max-age` plus `stale-while-revalidate`, which serves the cached
copy at once and refreshes it in the background after that). Scripts, markup and
styles stay on `no-cache`, so an edit is still what the browser asks for next.
"""

import gzip
import io
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PREVIEW_MODE = os.environ.get("BASE44_PREVIEW_MODE") == "1"
ROOT = os.environ.get("WEB_ROOT") or os.getcwd()
HOST = os.environ.get("WEB_HOST", "0.0.0.0")
PORT = int(os.environ.get("WEB_PORT", "3000"))

API_PREFIX = "/api/"
PREVIEW_FLAG = b'<script>window.__previewLocalApi = true;</script>'


def read_index_html():
    with open(os.path.join(ROOT, "index.html"), "rb") as handle:
        return handle.read()


class DevHandler(SimpleHTTPRequestHandler):
    # HTTP/1.1 keeps the connection open between the ~200 files a boot load pulls.
    # Every response here sets Content-Length, so keep-alive stays in sync.
    protocol_version = "HTTP/1.1"
    # Text assets worth compressing; the PNG/MP3 media is already compressed.
    GZIP_EXTENSIONS = (".html", ".js", ".css", ".json", ".fnt", ".txt", ".svg", ".xml")
    MEDIA_EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".mp3", ".ogg", ".wav", ".m4a")
    # Media is content-stable and makes up nearly the whole boot load, so let the
    # browser keep it and refresh it in the background instead of re-fetching it
    # (at ~90 ms per round through the preview proxy, ~170 files is the slow part).
    MEDIA_CACHE = "public, max-age=300, stale-while-revalidate=86400"
    # Everything a developer edits: always revalidate, so the next load shows it.
    TEXT_CACHE = "no-cache"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)
        self._cache_control = None
        self._cache_sent = False

    def _start_request(self, route):
        """Pick the Cache-Control policy for this request, once per request."""
        self._cache_sent = False
        if route.startswith(API_PREFIX) or route in ("/", "/index.html"):
            # The stub and the page itself set their own Cache-Control.
            self._cache_control = None
        elif route.lower().endswith(self.MEDIA_EXTENSIONS):
            self._cache_control = self.MEDIA_CACHE
        else:
            self._cache_control = self.TEXT_CACHE

    def end_headers(self):
        if self._cache_control and not self._cache_sent:
            self._cache_sent = True
            super().send_header("Cache-Control", self._cache_control)
        super().end_headers()

    def _drain_body(self):
        """Consume the request body so keep-alive does not read it as a new request."""
        if self.headers.get("Transfer-Encoding"):
            self.close_connection = True
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length > 0:
            self.rfile.read(length)

    def send_head(self):
        """Serve compressible text assets gzipped (same bytes, fewer of them).

        Requests carrying If-Modified-Since fall through to the base class so an
        unchanged file still answers 304 and is never re-downloaded.
        """
        path = self.translate_path(self.path)
        if (
            path.lower().endswith(self.GZIP_EXTENSIONS)
            and os.path.isfile(path)
            and "gzip" in self.headers.get("Accept-Encoding", "")
            and not self.headers.get("If-Modified-Since")
        ):
            try:
                with open(path, "rb") as handle:
                    raw = handle.read()
            except OSError:
                return super().send_head()
            body = gzip.compress(raw, 6)
            if len(raw) >= 1024 and len(body) < len(raw):
                self.send_response(200)
                self.send_header("Content-Type", self.guess_type(path))
                self.send_header("Content-Encoding", "gzip")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Last-Modified", self.date_time_string(os.stat(path).st_mtime))
                self.send_header("Vary", "Accept-Encoding")
                self.end_headers()
                return io.BytesIO(body)
        return super().send_head()

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _api_stub(self, route):
        """Development answers for the account API — no accounts live here."""
        self._drain_body()
        if route == "/api/auth/me":
            self._send_json(200, {"user": None})
        elif route == "/api/auth/logout":
            self._send_json(200, {"ok": True})
        else:
            self._send_json(
                503,
                {"error": "The Web Dashers account server is not available in this preview environment."},
            )

    def _send_index(self):
        try:
            body = read_index_html()
        except OSError as exc:
            self.send_error(404, "index.html not readable: %s" % exc)
            return
        if PREVIEW_FLAG not in body:
            if b"<head>" in body:
                body = body.replace(b"<head>", b"<head>\n    " + PREVIEW_FLAG, 1)
            else:
                print(
                    "dev_server: WARNING could not inject the preview API flag into index.html",
                    file=sys.stderr,
                )
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        route = self.path.split("?")[0]
        self._start_request(route)
        if PREVIEW_MODE:
            if route.startswith(API_PREFIX):
                return self._api_stub(route.rstrip("/"))
            if route in ("/", "/index.html"):
                return self._send_index()
        return super().do_GET()

    def do_HEAD(self):
        route = self.path.split("?")[0]
        self._start_request(route)
        if PREVIEW_MODE and route.startswith(API_PREFIX):
            return self._api_stub(route.rstrip("/"))
        return super().do_HEAD()

    def do_POST(self):
        # Requests are answered by the stub or rejected; no Cache-Control either way.
        self._cache_control = None
        self._cache_sent = False
        route = self.path.split("?")[0]
        if PREVIEW_MODE and route.startswith(API_PREFIX):
            return self._api_stub(route.rstrip("/"))
        self._drain_body()
        self.send_error(501, "Unsupported method ('POST')")


if __name__ == "__main__":
    if not os.path.isfile(os.path.join(ROOT, "index.html")):
        sys.exit("dev_server: no index.html found in %s" % ROOT)
    print(
        "dev_server: serving %s on http://%s:%d (BASE44_PREVIEW_MODE=%r)"
        % (ROOT, HOST, PORT, os.environ.get("BASE44_PREVIEW_MODE")),
        flush=True,
    )
    ThreadingHTTPServer((HOST, PORT), DevHandler).serve_forever()
