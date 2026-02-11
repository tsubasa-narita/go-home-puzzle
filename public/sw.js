// Service Worker for だ〜れだ？パズルラリー
const CACHE_NAME = 'puzzle-rally-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                // Cache cached assets (JS, CSS, Images, HTML)
                const url = event.request.url;
                if (fetchResponse.ok && (
                    url.includes('/assets/') ||
                    url.includes('/images/') ||
                    url.endsWith('.js') ||
                    url.endsWith('.css') ||
                    url.endsWith('.html')
                )) {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            });
        })
    );
});
