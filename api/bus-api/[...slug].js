export default async function handler(req, res) {
  const slug = req.url.replace(/^\/api\/bus-api\//, '').split('?')[0];
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `http://ws.bus.go.kr/api/${slug}${query}`;

  console.log('[proxy] targetUrl:', targetUrl);

  try {
    const upstream = await fetch(targetUrl);
    const text = await upstream.text();

    console.log('[proxy] status:', upstream.status, 'body:', text.substring(0, 200));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    console.error('[proxy] error:', err.message);
    res.status(500).send(`proxy error: ${err.message}`);
  }
}
