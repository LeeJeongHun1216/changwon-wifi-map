# 창원 공공 Wi-Fi Map

창원시 공공 Wi-Fi 공공데이터를 활용한 지도 기반 웹 서비스입니다.

## 기술 스택

- **Frontend:** React, Vite, TailwindCSS, React Router, Framer Motion, Lucide React
- **Map:** Kakao Maps JavaScript API
- **Backend:** Node.js, Express

## 시작하기

### 1. 의존성 설치

```bash
npm install
cd server && npm install && cd ..
```

### 2. 환경 변수 설정

**프론트엔드** — 프로젝트 루트 `.env`:

```env
VITE_KAKAO_MAP_API_KEY=your_kakao_javascript_key_here
```

**백엔드** — `server/.env`:

```env
ODCLOUD_SERVICE_KEY=your_odcloud_service_key_here
PORT=3001
```

공공데이터 API 키는 프론트엔드에 노출하지 않고 Express 서버에서만 사용합니다.

### 3. 실행

**프론트엔드 (개발 서버)**

```bash
npm run dev
```

**백엔드 (선택)**

```bash
cd server
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 프로젝트 구조

```
src/
├── components/     # UI 컴포넌트
├── pages/          # 페이지
├── hooks/          # 커스텀 훅
├── services/       # API 서비스
└── utils/          # 유틸리티
public/
└── data/
    └── wifi.json   # Wi-Fi 공공데이터
server/
└── index.js        # Express API 서버
```

## 통신사 분류

공공데이터 API의 `통신사` 값을 아래 5개 카테고리로 정규화합니다.

| 분류 | 설명 | 마커 색상 |
|------|------|-----------|
| KT | KT(케이티) | Blue |
| SKT | SKT(에스케이텔레콤) | Orange |
| SKB | SKB(에스케이브로드밴드) | Violet |
| LGU+ | LGU+(엘지유플러스) | Pink |
| 복합 | 쉼표(`,`)로 여러 통신사가 표기된 경우 | Rainbow gradient |

## 주요 기능

- 카카오맵 기반 Wi-Fi AP 마커 표시 (통신사별 색상)
- 장소명/주소 검색, 통신사·설치년도 필터
- Glassmorphism 정보 카드 (길찾기, 주소 복사)
- 통신사 ON/OFF 토글, 클러스터 표시
- AI Wi-Fi Assistant UI (기능 준비 중)
- 반응형 레이아웃

## 데이터 형식

`public/data/wifi.json`:

```json
{
  "AP대수": 3,
  "AP설치장소명": "제광경로당",
  "경도": "128.xxx",
  "위도": "35.xxx",
  "설치년월": "2023-12-31",
  "주소": "경상남도 창원시 ...",
  "통신사": "KT"
}
```

실제 공공데이터로 교체하면 바로 연동됩니다.

## 빌드

```bash
npm run build
npm run preview
```

## 배포 (Vercel 권장 — 카드 불필요)

> **Render Blueprint**는 계정에 **카드 등록**을 요구하는 경우가 많습니다.  
> 이 프로젝트는 **Vercel 하나**로 프론트 + API(`/api/wifi`)까지 배포할 수 있습니다.

### 1. GitHub

저장소: https://github.com/LeeJeongHun1216/changwon-wifi-map

### 2. Vercel 배포

1. [Vercel Dashboard](https://vercel.com) → **Add New Project** → `changwon-wifi-map` import
2. Framework: **Vite** (Build: `npm run build`, Output: `dist`)
3. **Environment Variables** (Production):

| 변수 | 값 |
|------|-----|
| `VITE_KAKAO_MAP_API_KEY` | 카카오 JavaScript 키 |
| `ODCLOUD_SERVICE_KEY` | 공공데이터 인증키 (API용, 서버만 사용) |

4. `VITE_API_BASE_URL`은 **비워 두세요** → 같은 Vercel 도메인의 `/api/wifi` 사용
5. **Deploy**

배포 확인:

- `https://<프로젝트>.vercel.app/api/health`
- `https://<프로젝트>.vercel.app/api/wifi`

### 3. 카카오맵 도메인

Kakao Developers → **Web 플랫폼**에 `https://<프로젝트>.vercel.app` 등록

### (선택) Render / 로컬 Express

로컬 개발 시 `server/` + `npm run dev` (포트 3001). Render는 유료·카드 정책 때문에 **필수 아님**.

| 환경 | API |
|------|-----|
| 로컬 | Vite proxy `/api` → `localhost:3001` |
| Vercel | `/api/wifi` (Serverless Functions) |

