export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response('No URL provided', { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(decodeURIComponent(target));
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  // Only allow http/https
  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return new Response('Protocol not allowed', { status: 403 });
  }

  try {
    const reqHeaders = new Headers(context.request.headers);
    reqHeaders.delete('host');
    reqHeaders.set('Referer', targetUrl.origin);
    reqHeaders.set('Origin', targetUrl.origin);

    const response = await fetch(targetUrl.toString(), {
      method: context.request.method,
      headers: reqHeaders,
      body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
      redirect: 'follow',
    });

    const resHeaders = new Headers(response.headers);

    // Strip headers that block embedding
    resHeaders.delete('x-frame-options');
    resHeaders.delete('content-security-policy');
    resHeaders.delete('content-security-policy-report-only');
    resHeaders.delete('cross-origin-embedder-policy');
    resHeaders.delete('cross-origin-opener-policy');
    resHeaders.delete('cross-origin-resource-policy');

    // Allow embedding from anywhere
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');

    const contentType = resHeaders.get('content-type') || '';

    // Rewrite HTML to proxy all links/resources
    if (contentType.includes('text/html')) {
      let body = await response.text();
      const base = targetUrl.origin;
      const proxyBase = `${url.origin}/proxy?url=`;

      // Rewrite absolute URLs
      body = body.replace(/(href|src|action)="(https?:\/\/[^"]+)"/gi,
        (m, attr, link) => `${attr}="${proxyBase}${encodeURIComponent(link)}"`);

      // Rewrite root-relative URLs
      body = body.replace(/(href|src|action)="(\/[^"]*?)"/gi,
        (m, attr, path) => `${attr}="${proxyBase}${encodeURIComponent(base + path)}"`);

      // Inject base tag and script to intercept navigation
      const inject = `
        <base href="${targetUrl.toString()}">
        <script>
          // Intercept all link clicks and form submissions to route through proxy
          document.addEventListener('click', function(e) {
            const a = e.target.closest('a');
            if (a && a.href && !a.href.startsWith('javascript') && !a.href.startsWith('#')) {
              e.preventDefault();
              const proxyUrl = '${url.origin}/proxy?url=' + encodeURIComponent(a.href);
              window.location.href = proxyUrl;
            }
          }, true);
        <\/script>
      `;
      body = body.replace('</head>', inject + '</head>');

      resHeaders.set('content-type', 'text/html; charset=utf-8');
      return new Response(body, { status: response.status, headers: resHeaders });
    }

    // For CSS — rewrite url() references
    if (contentType.includes('text/css')) {
      let body = await response.text();
      const proxyBase = `${url.origin}/proxy?url=`;
      body = body.replace(/url\(['"]?(https?:\/\/[^'")]+)['"]?\)/gi,
        (m, link) => `url(${proxyBase}${encodeURIComponent(link)})`);
      return new Response(body, { status: response.status, headers: resHeaders });
    }

    // Everything else — pass through as-is
    return new Response(response.body, { status: response.status, headers: resHeaders });

  } catch (err) {
    return new Response(`Proxy error: ${err.message}`, { status: 500 });
  }
}
