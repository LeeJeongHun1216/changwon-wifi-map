/**
 * 공공데이터 API 응답 → 앱 내부 표준 형식으로 변환
 * API 필드명: 경 도, 위 도, 주  소 (공백 포함)
 */

export function parseCarrierCategory(raw) {
  if (!raw || typeof raw !== 'string') return '기타';

  const trimmed = raw.trim();

  if (trimmed.includes(',')) {
    return '복합';
  }

  const upper = trimmed.toUpperCase();

  if (/SKB|브로드밴드/.test(trimmed)) return 'SKB';
  if (/SKT|에스케이텔레콤/.test(trimmed)) return 'SKT';
  if (/KT|케이티/.test(upper) || /케이티/.test(trimmed)) return 'KT';
  if (/LGU|엘지유플러스/.test(upper) || /엘지유플러스/.test(trimmed)) return 'LGU+';

  return '기타';
}

function normalizeWifiRecord(raw) {
  return {
    AP대수: raw.AP대수 ?? 0,
    AP설치장소명: raw.AP설치장소명 ?? '',
    경도: String(raw['경 도'] ?? raw.경도 ?? '').trim(),
    위도: String(raw['위 도'] ?? raw.위도 ?? '').trim(),
    주소: (raw['주  소'] ?? raw['주 소'] ?? raw.주소 ?? '').trim(),
    설치년월: raw.설치년월 ?? '',
    통신사: raw.통신사 ?? '',
    통신사분류: raw.통신사분류 ?? parseCarrierCategory(raw.통신사),
  };
}

export function normalizeWifiList(rawList) {
  return rawList.map(normalizeWifiRecord);
}
