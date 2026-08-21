# 창원 공공 Wi-Fi Map

창원시 공공 Wi-Fi 공공데이터(832개 AP)를 활용한 지도 기반 웹 서비스입니다.  
장소 검색·통신사 필터·AI Assistant까지 한 화면에서 이용할 수 있으며, 모바일·데스크톱 모두 지원합니다.

**배포:** [changwon-wifi-map.vercel.app](https://changwon-wifi-map.vercel.app)  
**저장소:** [github.com/LeeJeongHun1216/changwon-wifi-map](https://github.com/LeeJeongHun1216/changwon-wifi-map)

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Framer Motion, Lucide React |
| Map | Kakao Maps JavaScript API |
| Backend | Node.js, Express (로컬) / Vercel Serverless Functions (배포) |
| Data | 공공데이터포털 오픈 API (경상남도 창원시 공공와이파이) |
| AI | 규칙 기반 intent + OpenAI (선택) |

## 주요 기능

### 지도 (Home)

- 카카오맵 기반 Wi-Fi AP 마커 (통신사별 색상, 복합 통신사 그라데이션)
- 장소명·주소 검색, 통신사·설치년도 필터
- 통신사 ON/OFF 토글, 마커 클러스터
- Wi-Fi 정보 카드 (길찾기, 주소 복사)
- 하단 통계 바 (전체 / KT / SKT / SKB / LGU+ / 복합)

### AI Wi-Fi Assistant

- 자연어 질문 → 검색·필터·지도 연동
- 지원 예시: `"창원역 근처 Wi-Fi"`, `"KT만 보여줘"`, `"가장 가까운 Wi-Fi"`, `"AP 많은 곳"`
- OpenAI API 키가 없어도 규칙 기반으로 동작
- 위치 권한 허용 시 근처 Wi-Fi 추천

### 모바일 UI

- 지도 전체 화면 + 하단 탭바 (지도 / 검색 / AI / 필터)
- 바텀시트로 검색·AI·필터 패널 표시
- `safe-area`, `dvh` 레이아웃 지원

### 기타 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 지도 |
| `/wifi-list` | Wi-Fi 목록 (카드형) |
| `/ai-assistant` | AI Assistant 전용 페이지 |
| `/guide` | 서비스 안내 |

## 시작하기

### 1. 의존성 설치

```bash
npm install
cd server && npm install && cd ..
```

### 2. 환경 변수

**프론트엔드** — 프로젝트 루트 `.env` (`.env.example` 참고):

```env
VITE_KAKAO_MAP_API_KEY=카카오_JavaScript_키
# 로컬 Express 사용 시에만 설정 (Vercel 배포 시 비워둠)
VITE_API_BASE_URL=
```

**백엔드** — `server/.env` (`server/.env.example` 참고):

```env
PORT=3001
ODCLOUD_SERVICE_KEY=공공데이터_인증키
ODCLOUD_API_URL=https://api.odcloud.kr/api/15074279/v1/uddi:a019eab8-7146-4443-9c79-b0c9816e4a77
OPENAI_API_KEY=          # 선택 — AI intent 고도화
OPENAI_MODEL=gpt-4o-mini # 선택
```

> 공공데이터 API 키는 프론트엔드에 노출하지 않습니다. Express / Vercel Serverless에서만 사용합니다.

### 3. 실행

터미널 1 — 백엔드 (공공데이터 832건):

```bash
cd server
npm run dev
```

터미널 2 — 프론트엔드:

```bash
npm run dev
```

브라우저: [http://localhost:5173](http://localhost:5173)

Vite가 `/api` 요청을 `localhost:3001`로 프록시합니다.

### 4. 카카오맵 설정

[Kakao Developers](https://developers.kakao.com) → 앱 생성 → **JavaScript 키** 발급  
**플랫폼 > Web**에 `http://localhost:5173` (로컬) 및 배포 도메인 등록

## API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/wifi` | Wi-Fi 목록 (odcloud 실데이터 → 실패 시 `wifi.json` fallback) |
| GET | `/api/health` | 서버 상태 |
| POST | `/api/assistant/chat` | AI Assistant (`{ message, location? }`) |

**Assistant 응답 예시:**

```json
{
  "reply": "창원역 검색 결과 3개소입니다.",
  "actions": { "searchQuery": "창원역", "carrier": "전체", "resetMap": false },
  "resultCount": 3,
  "needsLocation": false
}
```

## 프로젝트 구조

```
src/
├── components/       # UI (지도, 사이드바, AI Chat, 모바일 시트 등)
├── pages/            # Home, WifiList, AIAssistant, ServiceGuide
├── hooks/            # useWifiData
├── services/         # wifiService, assistantService
└── utils/            # filters, carrierColors, kakaoMap, normalizeWifi

api/                  # Vercel Serverless (wifi, health, assistant/chat)
server/
├── index.js          # Express (로컬 개발)
├── fetchOdcloud.js   # 공공데이터 API 호출
├── getWifiData.js    # 데이터 fetch + fallback 통합
├── normalizeWifi.js  # API 필드 정규화
└── assistant/        # AI intent · 실행 로직

public/data/wifi.json # 오프라인 fallback 샘플 데이터
```

## 통신사 분류

공공데이터 `통신사` 값을 5개 카테고리로 정규화합니다.

| 분류 | 설명 | 마커 색상 |
|------|------|-----------|
| KT | KT(케이티) | Blue |
| SKT | SKT(에스케이텔레콤) | Orange |
| SKB | SKB(에스케이브로드밴드) | Violet |
| LGU+ | LGU+(엘지유플러스) | Pink |
| 복합 | 쉼표(`,`)로 여러 통신사 표기 | Rainbow gradient |

## 데이터 형식

내부 표준 필드 (API 응답 정규화 후):

```json
{
  "AP대수": 3,
  "AP설치장소명": "창원역",
  "경도": "128.681389",
  "위도": "35.228872",
  "설치년월": "2023-12-31",
  "주소": "경상남도 창원시 ...",
  "통신사": "KT",
  "통신사분류": "KT"
}
```

공공데이터 원본 필드명(`경 도`, `위 도`, `주  소` 등)은 서버·클라이언트 `normalizeWifi`에서 자동 변환합니다.

## 스크립트

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # oxlint
```

## 배포 (Vercel)

1. [Vercel Dashboard](https://vercel.com) → **Add New Project** → `changwon-wifi-map` import
2. Framework: **Vite** (Build: `npm run build`, Output: `dist`)
3. **Environment Variables**:

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_KAKAO_MAP_API_KEY` | ✅ | 카카오 JavaScript 키 |
| `ODCLOUD_SERVICE_KEY` | ✅ | 공공데이터 인증키 |
| `OPENAI_API_KEY` | ⬜ | OpenAI 키 (없으면 규칙 기반 AI) |
| `VITE_API_BASE_URL` | ⬜ | **비워두면** 같은 도메인 `/api` 사용 |

4. **Deploy** → 카카오 Developers Web 플랫폼에 배포 URL 등록

배포 확인:

- `https://<프로젝트>.vercel.app/api/health`
- `https://<프로젝트>.vercel.app/api/wifi`

### 로컬 Express vs Vercel

| 환경 | API 제공 |
|------|----------|
| 로컬 | `server/` Express (포트 3001) + Vite proxy |
| Vercel | `api/` Serverless Functions |

Render 등 별도 백엔드 호스팅은 **필수 아님** (`render.yaml`은 참고용).

## 라이선스

2026 창원시 AI·데이터 활용 공모전 출품 프로젝트
