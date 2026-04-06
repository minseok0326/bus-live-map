export default async function handler(req, res) {
  const slug = req.url.replace(/^\/api\/bus-api\//, '').split('?')[0];
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `http://ws.bus.go.kr/api/${slug}${query}`;

  const upstream = await fetch(targetUrl);
  const text = await upstream.text();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.status(upstream.status).send(text);
}
