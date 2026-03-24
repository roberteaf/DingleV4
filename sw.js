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
                .then(html => {
                    // inject base tag so relative URLs resolve correctly
                    const base = '<base href="' + target + '">';
                    const fixed = html.replace(/<head>/i, '<head>' + base)
                                      .replace(/^<!DOCTYPE[^>]*>/i, '$&<head>' + base + '</head>') || base + html;
                    return new Response(fixed, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                })
                .catch(() => new Response('<body style="background:#000;color:red;font-family:monospace;padding:20px"><h2>Failed to load</h2><p>Site may have blocked the proxy.</p></body>', {
                    status: 502,
                    headers: { 'Content-Type': 'text/html' }
                }))
        );
    }
});
