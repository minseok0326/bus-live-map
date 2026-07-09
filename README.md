<div align="center">

# 스마트 버스 알림이

### 버스 길라잡이 — 서울 버스 실시간 위치 + 신호 정보 웹앱

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 개요

서울시 공공 버스 API와 신호 정보 API를 연동하여, 선택한 노선의 **실시간 버스 위치**와 **신호 상태**를 지도 위에 시각화하는 웹 애플리케이션입니다.

공공 API의 CORS 제한을 우회하기 위해 **Express.js 프록시 서버**와 **Vercel Serverless Function**을 함께 제공합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 실시간 버스 위치 | 노선별 버스 GPS 좌표를 주기적으로 갱신하여 지도에 표시 |
| 신호 정보 연동 | 공공데이터포털 신호 API와 연동하여 교차로 신호 상태 표시 |
| 노선 선택 패널 | 좌측 패널에서 버스 노선을 선택하면 지도가 즉시 업데이트 |
| CORS 우회 프록시 | Express.js 서버 및 Vercel Function으로 브라우저 CORS 제한 해결 |
| Vercel 배포 | 별도 서버 없이 Vercel에 바로 배포 가능 |

---

## 아키텍처

```
┌────────────────────────────────────────────────────┐
│                  Browser (Client)                  │
│                                                    │
│  ┌──────────────┐      ┌───────────────────────┐   │
│  │  좌측 패널    │      │    우측 지도 (Map)     │   │
│  │ 노선 선택 버튼│─────▶│ 실시간 버스 마커 표시  │   │
│  └──────────────┘      └───────────────────────┘   │
└───────────────────────┬────────────────────────────┘
                        │ fetch (same-origin)
                        ▼
┌────────────────────────────────────────────────────┐
│           Proxy Layer (CORS 우회)                   │
│                                                    │
│  Local Dev  : server.js (Express.js :3000)         │
│  Production : api/proxy.js (Vercel Serverless)     │
└──────────────┬─────────────────────┬───────────────┘
               │                     │
               ▼                     ▼
┌──────────────────────┐  ┌──────────────────────────┐
│  서울 버스 정보 API   │  │  공공데이터포털 신호 API  │
│  ws.bus.go.kr        │  │  apis.data.go.kr          │
└──────────────────────┘  └──────────────────────────┘
```

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend (Proxy) | Node.js, Express.js |
| Serverless | Vercel Functions (`api/proxy.js`) |
| 배포 | Vercel |
| 외부 API | 서울시 버스정보시스템, 공공데이터포털 |

---

## 파일 구조

```
bus-live-map/
├── index.html            # 메인 UI
├── 버스알림이_데모.html   # 데모용 HTML
├── server.js             # Express 로컬 프록시 서버 (개발용)
├── api/
│   └── proxy.js          # Vercel Serverless 프록시 (프로덕션)
├── package.json
├── vercel.json           # Vercel 라우팅 설정
└── .vercelignore
```

---

## 빠른 시작

```bash
git clone https://github.com/minseok0326/bus-live-map.git
cd bus-live-map
npm install

# 로컬 개발 서버 실행
node server.js
# → http://localhost:3000
```

### Vercel 배포

```bash
npm i -g vercel
vercel
```

---

## 사용 API

| API | 엔드포인트 | 용도 |
|-----|-----------|------|
| 서울 버스 정보 시스템 | `ws.bus.go.kr/api/rest/*` | 노선별 실시간 버스 위치 |
| 공공데이터포털 신호 API | `apis.data.go.kr` | 교차로 신호 정보 |

> **CORS 처리**: 두 API 모두 브라우저 직접 호출 시 CORS 오류가 발생합니다.
> 로컬에서는 `server.js`(Express), 배포 환경에서는 `api/proxy.js`(Vercel Function)가 요청을 중계합니다.

---

## 라이선스

[MIT](LICENSE)
