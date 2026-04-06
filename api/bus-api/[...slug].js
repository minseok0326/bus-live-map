const http = require('http');

module.exports = (req, res) => {
  const slug = Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug];
  const apiPath = '/api/' + slug.join('/');

  const queryParams = { ...req.query };
  delete queryParams.slug;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullPath = queryString ? `${apiPath}?${queryString}` : apiPath;

  const options = {
    hostname: 'ws.bus.go.kr',
    port: 80,
    path: fullPath,
    method: 'GET',
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const chunks = [];
    proxyRes.on('data', chunk => chunks.push(chunk));
    proxyRes.on('end', () => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      res.status(200).send(Buffer.concat(chunks).toString('utf8'));
    });
  });

  proxyReq.on('error', (err) => {
    res.status(500).send(`Error: ${err.message}`);
  });

  proxyReq.end();
};
