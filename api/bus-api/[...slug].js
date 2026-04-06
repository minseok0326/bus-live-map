export const config = {
  runtime: 'edge',
  regions: ['icn1'],
};

export default async function handler(req) {
  const url = new URL(req.url);
  const slug = url.pathname.replace('/api/bus-api/', '');
  const queryString = url.search;
  const targetUrl = `http://ws.bus.go.kr/api/${slug}${queryString}`;

  const response = await fetch(targetUrl);
  const text = await response.text();

  return new Response(text, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
