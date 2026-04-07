const express = require('express');
const http    = require('http');
const https   = require('https');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(express.static(__dirname));

// 서울 버스 API 프록시
app.get('/bus-api/*', (req, res) => {
  const apiPath     = '/api/rest/' + req.params[0];
  const queryString = new URLSearchParams(req.query).toString();
  const fullPath    = queryString ? `${apiPath}?${queryString}` : apiPath;

  console.log(`\n[버스요청] http://ws.bus.go.kr${fullPath}`);

  const proxyReq = http.request(
    { hostname: 'ws.bus.go.kr', port: 80, path: fullPath, method: 'GET' },
    (proxyRes) => {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        console.log(`[버스응답] ${proxyRes.statusCode} ${text.substring(0, 200)}`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.send(text);
      });
    }
  );
  proxyReq.on('error', err => res.status(500).send(`오류: ${err.message}`));
  proxyReq.end();
});

// 신호 API 프록시 (apis.data.go.kr HTTPS)
app.get('/signal-api/*', (req, res) => {
  const apiPath     = '/' + req.params[0];
  const queryString = new URLSearchParams(req.query).toString();
  const fullPath    = queryString ? `${apiPath}?${queryString}` : apiPath;

  console.log(`\n[신호요청] https://apis.data.go.kr${fullPath}`);

  const proxyReq = https.request(
    { hostname: 'apis.data.go.kr', port: 443, path: fullPath, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' } },
    (proxyRes) => {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        console.log(`[신호응답] ${proxyRes.statusCode} ${text.substring(0, 200)}`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(text);
      });
    }
  );
  proxyReq.on('error', err => res.status(500).send(`오류: ${err.message}`));
  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`\n✅ 서버 실행 중!`);
  console.log(`   http://localhost:${PORT}/버스알림이_데모.html\n`);
});
