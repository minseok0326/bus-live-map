const http  = require('http');
const https = require('https');

const ALLOWED_HOSTS = {
  'ws.bus.go.kr':     { proto: 'http',  port: 80  },
  'apis.data.go.kr':  { proto: 'https', port: 443 },
};

module.exports = async function handler(req, res) {
  const url  = new URL(req.url, 'http://localhost');
  const host = url.searchParams.get('host') || 'ws.bus.go.kr';
  const path = url.searchParams.get('path') || '';
  url.searchParams.delete('host');
  url.searchParams.delete('path');
  const query = url.search;

  const target = ALLOWED_HOSTS[host];
  if (!target) {
    res.status(400).json({ error: 'disallowed host' });
    return;
  }

  const targetPath = host === 'ws.bus.go.kr'
    ? `/api/rest/${path}${query}`
    : `/${path}${query}`;

  const transport = target.proto === 'https' ? https : http;
  console.log('[proxy]', target.proto + '://' + host + targetPath);

  return new Promise((resolve) => {
    const proxyReq = transport.request(
      { hostname: host, port: target.port, path: targetPath, method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' } },
      (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', c => chunks.push(c));
        proxyRes.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          console.log('[proxy] status:', proxyRes.statusCode, text.slice(0, 200));
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
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
