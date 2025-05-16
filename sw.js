const CACHE_NAME = 'taco-clicker-v1.4.0';
const urlsToCache = [
    '/taco-clicker/',
    '/taco-clicker/index.html',
    '/taco-clicker/styles.css',
    '/taco-clicker/game.js',
    '/taco-clicker/install.js',
    '/taco-clicker/manifest.json',
    '/taco-clicker/icons/icon-72x72.png',
    '/taco-clicker/icons/icon-96x96.png',
    '/taco-clicker/icons/icon-128x128.png',
    '/taco-clicker/icons/icon-144x144.png',
    '/taco-clicker/icons/icon-152x152.png',
    '/taco-clicker/icons/icon-192x192.png',
    '/taco-clicker/icons/icon-384x384.png',
    '/taco-clicker/icons/icon-512x512.png'
];

// Install service worker and cache all resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Clean up old caches
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

// Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a one-time use stream
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // If fetch fails, return a fallback page if it's a navigation request
                    if (event.request.mode === 'navigate') {
                        return caches.match('/taco-clicker/index.html');
                    }
                });
            })
    );
}); 