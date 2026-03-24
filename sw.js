self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (url.pathname.includes('/service/')) {
        const target = decodeURIComponent(url.pathname.split('/service/')[1]);
        const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(target);
        e.respondWith(
            fetch(proxyUrl)
                .then(r => r.text())
                .then(html => new Response(html, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }))
                .catch(() => new Response('<h1 style="color:red">Failed to load</h1>', {
                    status: 502,
                    headers: { 'Content-Type': 'text/html' }
                }))
        );
    }
});
