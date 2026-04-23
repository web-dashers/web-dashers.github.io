const CACHE_NAME = 'web-dash-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sw.js',
  '/assets/style.css',
  '/assets/scripts/allObjects.js',
  '/assets/scripts/allLevels.js',
  '/assets/scripts/phaser.min.js',
  '/assets/scripts/pako.min.js',
  '/assets/scripts/index-game.js',
  '/assets/favicon.ico',
  '/assets/logo.png',
  '/assets/settings.png'
  // Game assets will be cached when asked or somthing
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // cache new requests
          if (response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
