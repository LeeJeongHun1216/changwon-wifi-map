import { normalizeWifiList } from './normalizeWifi.js';

const DEFAULT_ENDPOINT =
  'https://api.odcloud.kr/api/15074279/v1/uddi:a019eab8-7146-4443-9c79-b0c9816e4a77';

const CACHE_TTL_MS = 60 * 60 * 1000;

let cache = {
  data: null,
  fetchedAt: 0,
};

export async function fetchWifiFromOdcloud() {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const serviceKey = process.env.ODCLOUD_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('ODCLOUD_SERVICE_KEY 환경변수가 설정되지 않았습니다.');
  }

  const endpoint = process.env.ODCLOUD_API_URL || DEFAULT_ENDPOINT;
  const url = new URL(endpoint);
  url.searchParams.set('serviceKey', serviceKey);
  url.searchParams.set('page', '1');
  url.searchParams.set('perPage', '1000');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`공공데이터 API 오류: ${response.status}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.data)) {
    throw new Error('공공데이터 API 응답 형식이 올바르지 않습니다.');
  }

  const normalized = normalizeWifiList(json.data);

  cache = { data: normalized, fetchedAt: now };

  return normalized;
}

export function getCacheMeta() {
  return {
    cached: Boolean(cache.data),
    fetchedAt: cache.fetchedAt ? new Date(cache.fetchedAt).toISOString() : null,
    count: cache.data?.length ?? 0,
  };
}
