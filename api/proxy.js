const http = require('http');

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.searchParams.get('path') || '';
  url.searchParams.delete('path');
  const query = url.search;

  const targetPath = `/api/rest/${path}${query}`;
  console.log('[proxy] target:', `http://ws.bus.go.kr${targetPath}`);

  return new Promise((resolve) => {
    const proxyReq = http.request(
      { hostname: 'ws.bus.go.kr', port: 80, path: targetPath, method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } },
      (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', c => chunks.push(c));
        proxyRes.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          console.log('[proxy] status:', proxyRes.statusCode, text.slice(0, 200));
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', 'text/xml; charset=utf-8');
          res.status(200).send(text);
          resolve();
        });
      }
    );
    proxyReq.on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
    proxyReq.end();
  });
};
