self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Force the proxy to start working IMMEDIATELY
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    /* Detection for /service/ regardless of the GitHub folder name */
    if (url.pathname.includes('/service/')) {
        const parts = url.pathname.split('/service/');
        const targetUrl = decodeURIComponent(parts[1]);

        /* AllOrigins Engine */
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        event.respondWith(
            fetch(proxyUrl)
                .then(res => res.json())
                .then(data => {
                    return new Response(data.contents, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
                .catch(err => new Response("Proxy Error: " + err, { status: 500 }))
        );
    }
});
