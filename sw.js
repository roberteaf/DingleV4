self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('/service/')) {
        const targetUrl = decodeURIComponent(url.pathname.split('/service/')[1]);
        
        /* Using a faster 2026 Mirror for Google/Apps */
        const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;

        event.respondWith(
            fetch(proxyUrl)
                .then(res => res.text())
                .then(data => {
                    return new Response(data, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
    }
});
