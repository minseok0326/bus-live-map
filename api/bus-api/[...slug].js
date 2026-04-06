const http = require('http');

module.exports = async function handler(req, res) {
  const slug = req.url.replace(/^\/api\/bus-api\//, '').split('?')[0];
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `http://ws.bus.go.kr/api/${slug}${query}`;

  console.log('[proxy] targetUrl:', targetUrl);

  return new Promise((resolve) => {
    const options = {
      hostname: 'ws.bus.go.kr',
      port: 80,
      path: `/api/${slug}${query}`,
      method: 'GET',
    };

    const proxyReq = http.request(options, (proxyRes) => {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        console.log('[proxy] upstream status:', proxyRes.statusCode);
        console.log('[proxy] upstream body:', text.substring(0, 300));
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.status(200).send(text);
        resolve();
      });
    });

    proxyReq.on('error', (err) => {
      console.error('[proxy] error:', err.message);
      res.status(500).json({ error: err.message, targetUrl });
      resolve();
    });

    proxyReq.end();
  });
};
