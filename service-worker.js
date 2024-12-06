const CACHE_NAME = 'v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/icon_192.png',
    '/icon_512.jpg',
    '/manifest.json',
    '/messMenu.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/service-worker.js',
          '/messMenu.json',  // Cache the menu file
          '/styles.css',
          '/script.js',
          '/icon_192.png',
          '/icon_512.jpg',
        ]);
      })
    );
  });
  

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('messMenu.json')) {
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            // Update the cache with the latest menu
            caches.open('v1').then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(() => {
            // Fallback to the cached menu if network is unavailable
            return caches.match(event.request);
          })
      );
    } else {
      // Handle other requests as normal (with caching)
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request);
        })
      );
    }
  });

  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
  
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);  // Delete old caches
            }
          })
        );
      })
    );
  });

  // Check for updated content
navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.updateAvailable) {
      alert('New menu is available! Please refresh the app.');
    }
  });
  
