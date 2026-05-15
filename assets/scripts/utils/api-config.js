// Central API server URL.
//
// Local dev (localhost) uses relative paths automatically — leave it alone.
// Before deploying the client to GitHub Pages (or anywhere else), replace the
// placeholder below with the URL of your hosted API server.
//
// Example: 'https://api.webdashers.example.com'
//
// Forks that don't control the server will get CORS errors when players try to
// log in. That's intentional — it keeps accounts and player data centralized on
// one authoritative server instead of fragmented across random forks.

window._apiBase = (function () {
  const h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return ''; // same-origin, no prefix needed
  return 'https://YOUR_API_SERVER_HERE'; // ← replace this before deploying
}());
