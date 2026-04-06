const express = require('express');
const http    = require('http');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(express.static(__dirname));

// 서울 버스 API 프록시 — 응답 본문을 버퍼로 받아 로그 출력 후 전달
app.get('/bus-api/*', (req, res) => {
  const apiPath     = '/api/' + req.params[0];
  const queryString = new URLSearchParams(req.query).toString();
  const fullPath    = queryString ? `${apiPath}?${queryString}` : apiPath;

  console.log(`\n[요청] http://ws.bus.go.kr${fullPath}`);

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
      const buf  = Buffer.concat(chunks);
      const text = buf.toString('utf8');

      // 터미널에 응답 앞부분 출력 (디버깅용)
      console.log(`[상태코드] ${proxyRes.statusCode}`);
      console.log(`[응답 앞부분]\n${text.substring(0, 600)}\n`);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      res.send(text);
    });
  });

  proxyReq.on('error', (err) => {
    console.error('[프록시 오류]', err.message);
    res.status(500).send(`오류: ${err.message}`);
  });

  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`\n✅ 서버 실행 중!`);
  console.log(`   http://localhost:${PORT}/버스알림이_데모.html\n`);
});
