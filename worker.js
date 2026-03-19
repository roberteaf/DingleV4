export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle proxy requests at /proxy?url=...
    if (url.pathname === '/proxy') {
      const target = url.searchParams.get('url');
      if (!target) return new Response('No URL', { status: 400 });

      let targetUrl;
      try { targetUrl = new URL(decodeURIComponent(target)); }
      catch { return new Response('Invalid URL', { status: 400 }); }

      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        return new Response('Not allowed', { status: 403 });
      }

      try {
        const reqHeaders = new Headers(request.headers);
        reqHeaders.delete('host');
        reqHeaders.set('Referer', targetUrl.origin);
        reqHeaders.set('Origin', targetUrl.origin);

        const response = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: reqHeaders,
          body: ['GET','HEAD'].includes(request.method) ? undefined : request.body,
          redirect: 'follow',
        });

        const resHeaders = new Headers(response.headers);
        resHeaders.delete('x-frame-options');
        resHeaders.delete('content-security-policy');
        resHeaders.delete('content-security-policy-report-only');
        resHeaders.delete('cross-origin-embedder-policy');
        resHeaders.delete('cross-origin-opener-policy');
        resHeaders.delete('cross-origin-resource-policy');
        resHeaders.set('Access-Control-Allow-Origin', '*');

        const contentType = resHeaders.get('content-type') || '';

        if (contentType.includes('text/html')) {
          let body = await response.text();
          const base = targetUrl.origin;
          const proxyBase = `${url.origin}/proxy?url=`;

          body = body.replace(/(href|src|action)="(https?:\/\/[^"]+)"/gi,
            (m, attr, link) => `${attr}="${proxyBase}${encodeURIComponent(link)}"`);
          body = body.replace(/(href|src|action)="(\/[^"]*?)"/gi,
            (m, attr, path) => `${attr}="${proxyBase}${encodeURIComponent(base + path)}"`);

          const inject = `
            <meta charset="utf-8">
            <base href="${targetUrl.toString()}">
            <script>
              document.addEventListener('click', function(e) {
                const a = e.target.closest('a');
                if (a && a.href && !a.href.startsWith('javascript') && !a.href.startsWith('#')) {
                  e.preventDefault();
                  window.location.href = '${url.origin}/proxy?url=' + encodeURIComponent(a.href);
                }
              }, true);
            <\/script>`;
          body = body.replace('<head>', '<head>' + inject);
          resHeaders.set('content-type', 'text/html; charset=utf-8');
          return new Response(body, { status: response.status, headers: resHeaders });
        }

        if (contentType.includes('text/css')) {
          let body = await response.text();
          body = body.replace(/url\(['"]?(https?:\/\/[^'")]+)['"]?\)/gi,
            (m, link) => `url(${url.origin}/proxy?url=${encodeURIComponent(link)})`);
          return new Response(body, { status: response.status, headers: resHeaders });
        }

        return new Response(response.body, { status: response.status, headers: resHeaders });

      } catch (err) {
        return new Response(`Proxy error: ${err.message}`, { status: 500 });
      }
    }

    // Serve static assets (index.html, etc.) for everything else
    return env.ASSETS.fetch(request);
  }
}
