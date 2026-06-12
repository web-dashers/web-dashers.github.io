const GHPATH = '/zainojdaf/web-dashers.github.io'; 
const CACHE_NAME = 'web-dashers-dynamic-v1';

const INITIAL_CORE = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_CORE);
    })
  );
});

self.addEventListener('fetch', (event) => {
 // (files, audio, scripts)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // if the file is loaded it works offline :)
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Test if the request works (this is important)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // makes a copy of the file (thats how it works offline heh)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback if you are offline and you dont have ANY files loaded
        return caches.match(`${GHPATH}/index.html`);
      });
    })
  );
});
