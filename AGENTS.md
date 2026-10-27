# AGENTS.md — Web Dashers

Notes for agents working in this repository. Read this before changing how the app
runs or how it is verified.

## What this app is

A client-side Phaser game (a fan mod of the Geometry Dash web demo). There is **no
build step, no bundler and no npm dependencies**: `index.html` plus `assets/` are
served as-is and the game is loaded by plain `<script>` tags. Do not introduce a
build pipeline or a dev-server framework to fix a sandbox problem — serve the files.

## Running it

```sh
docker compose -f docker-compose.base44.yml up -d --build
```

`web` is `python:3.12-slim` running `.base44/dev_server.py` on host port 3000 with
the clone bind-mounted at `/app`, so **every file edit is visible on the next page
load** — no rebuild and no restart.

`BASE44_PREVIEW_MODE=1` (supplied by the platform, passed through bare in compose)
switches on two preview-only behaviours in the dev server:

1. A same-origin stub answers the account routes `/api/auth/*` and `/api/saves`
   ("not signed in"; `503` for anything that would need a real account). The real
   account server is a separate service whose source is **not** in this repository.
2. `window.__previewLocalApi = true` is injected into `index.html`; the client reads
   it in `assets/scripts/utils/api-config.js` and keeps the account API same-origin.

With the variable unset the dev server is a plain static file server, and
`api-config.js` still uses the page's own origin (it only falls back to the external
backend `webdasher-backend.itzar.dev` on a `github.io` host, the legacy GitHub Pages
deployment, which has no API of its own — that backend sends no CORS headers and
cannot be called from a Base44 or preview origin).

No credentials are required to boot. Outbound traffic goes to public services: GD
proxies on `*.workers.dev`, `boomlings.com`, `gdbrowser.com`.

The dev server serves efficiently in both modes, and never changes what is served
(same files, same bytes): HTTP/1.1 keep-alive, because a boot load pulls ~200 files
and a server that closes after each response makes the platform proxy pay a
connection setup per file, and gzip on the text assets (the game scripts are several
MB; already-compressed PNG/MP3 are left alone). Revalidation still answers `304`.

It also sets `Cache-Control`, because re-fetching the whole game on every preview
load is what makes the app feel like it is stuck on its loading screen:

- Media (`.png`/`.jpg`/`.mp3`/`.ogg`/…, ~26 MB of the ~27 MB boot load) is
  `max-age=300, stale-while-revalidate=86400`: the browser reuses it for five
  minutes, then serves it from cache instantly while refreshing it in the background.
  A replaced image therefore shows up on the load after the one that refreshes it.
- Scripts, markup and styles are `no-cache`: always revalidated, so an edit is the
  next thing the browser asks for.
- `index.html` and the account stub stay `no-store`.

## Things that are easy to get wrong

- **Everything is one canvas.** The loading screen, main menu, level select and
  gameplay are all Phaser scenes inside a single `<canvas>`: there is no DOM UI to
  query. To drive it from a browser session, dispatch real mouse/pointer events on
  the canvas at the screen coordinates of a Phaser object
  (`obj.getWorldTransformMatrix()` → game coords → `canvas.getBoundingClientRect()`
  scale). Canvas coordinates and `getWorldTransformMatrix` handle containers, so use
  it rather than reading `obj.x`/`obj.y`; note the scale is `FIT`.
- `assets/scripts/core/game-scene.js` exposes `window.scene`, which is the GameScene
  **ScenePlugin**, not the scene: the instance is
  `window.scene.manager.getScene('GameScene')` (or `window.scene.get('GameScene')`).
- Handles on the GameScene instance that make automated checks easy: `_playBtn`,
  `_updateLogPopup` (its close button is the `GJ_closeBtn_001.png` image inside the
  bounce container), `_levelSelectOverlay`, `_levelSelectStaticObjs` — the widest
  `Zone` (700×185) is the level card and the full-screen `Zone` is a click blocker —
  `_playOverlay`, `_player` (its cube sprite is `playerSprite`, **not** `cube`),
  `_totalJumps`, `_lastPercent`, `_attempts`, `_state.isDead`.
- Tapping a level card on the main level list starts the level directly; there is no
  intermediate level page for main levels (`_playOverlay` is only for online levels).
- **The first load is slow, and that is not the same as broken.** An uncached browser
  pulls ~200 files (27 MB of texture atlases, sprites and music) through the preview
  proxy, one round trip per file, before the menu appears — measured in the sandbox
  preview browser, roughly 10-15 s of transfer plus decode. Later loads reuse the
  cached media and reach the menu in a few seconds. The loading screen sits on a
  partly-filled bar for that whole time - wait for it rather than reloading. Only a
  first visit can be slow; if every load of the same browser is slow, the caching
  headers in `.base44/dev_server.py` are not reaching it.
- The game shows its own "update log" popup over the main menu on every fresh page
  load, and it covers the menu buttons — close it before clicking anything.
- `assets/scripts/core/loading-screen.js` begins with an obfuscated anti-clone guard
  (base64 `eval`): when the game is framed by one of the known clone domains it
  replaces the page with a "this site is a scam, play the real one" notice that
  contains the project's official URL. Re-encode that payload if the official home
  ever changes; it is the only place the URL is asserted to players.
- The account / cloud-save API is optional: the game plays fully without it, and all
  of its calls are wrapped so a missing backend only means "signed out".

## Verifying a change

1. `docker compose -f docker-compose.base44.yml ps` — `web` should be `healthy`;
   `curl -s http://localhost:3000/ | head` should be the clone's `index.html` (with
   the preview API flag injected when `BASE44_PREVIEW_MODE=1`).
2. Drive the game: main menu → press play → tap the level card → confirm gameplay
   (level container visible, `_lastPercent`/`_attempts` moving) → hold space and
   confirm `_totalJumps` increments. That chain is the end-to-end proof that the
   preview is playable.
3. Account routes: `curl -s http://localhost:3000/api/auth/me` answers
   `{"user": null}` in preview mode only.

There is no test suite, linter or CI configuration in this repository.

## Deploying the public site

`firebase.json` + `.firebaserc` configure Firebase Hosting for a public deploy
(`npx firebase-tools deploy --only hosting`, see [README.md](./README.md)). Two
things that are easy to get wrong when checking it:

- The Hosting **emulator** does not apply the `ignore` list: it serves every file
  under `public` (the repo root), including `.git/`, `README.md` and
  `.base44/dev_server.py`. A real deploy does filter them — the upload list comes
  from `listFiles(publicDir, config.ignore)` in `firebase-tools/lib/listFiles`, so
  check that instead of the emulator when validating ignore patterns.
- The cache policy lives in `firebase.json` `headers` and mirrors
  `.base44/dev_server.py` (media cached, scripts and level data revalidated, markup
  `no-store`); the emulator does apply those, and `curl -sI` on it is a quick check.
