// Service Worker for だ〜れだ？パズルラリー
const CACHE_NAME = 'puzzle-rally-v2';

self.addEventListener('install', (event) => {
    // 新しいSWを即座にアクティブにする
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // 古いキャッシュを削除
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // 画像やアセットをキャッシュ
                const url = event.request.url;
                if (networkResponse.ok && (
                    url.includes('/assets/') ||
                    url.includes('/images/') ||
                    url.endsWith('.js') ||
                    url.endsWith('.css') ||
                    url.endsWith('.html') ||
                    url.endsWith('.png') ||
                    url.endsWith('.json')
                )) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // オフライン時: HTMLリクエストにはキャッシュされたindex.htmlを返す
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return new Response('Offline', { status: 503 });
            });
        })
    );
});
