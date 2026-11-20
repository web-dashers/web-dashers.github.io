window._apiBase = (function () {
  // The game is served by the Base44 platform, which answers the account API
  // (/api/auth/*, /api/saves) on the page's own origin. In the Base44 sandbox
  // preview a same-origin development stub answers those routes and sets the flag
  // below (see .base44/dev_server.py); any other Base44 host serves its own /api.
  if (window.__previewLocalApi === true) return '';
  const h = location.hostname;
  // The legacy GitHub Pages deployment has no API of its own, so it keeps the
  // external account backend. That backend sends no CORS headers, so no other
  // host - Base44 included - may call it; everything else uses its own origin.
  if (h !== 'localhost' && h !== '127.0.0.1' && h.endsWith('github.io')) return 'https://webdasher-backend.itzar.dev';
  return '';
}());
