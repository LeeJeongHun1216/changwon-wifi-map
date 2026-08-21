import { normalizeWifiList } from '../utils/normalizeWifi';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function fetchWifiData() {
  const response = await fetch('/data/wifi.json');

  if (!response.ok) {
    throw new Error('Wi-Fi 데이터를 불러오지 못했습니다.');
  }

  const raw = await response.json();
  return normalizeWifiList(raw);
}

export async function fetchWifiFromApi() {
  const url = API_BASE ? `${API_BASE}/api/wifi` : '/api/wifi';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return fetchWifiData();
    }

    const json = await response.json();
    return json.data ?? json;
  } catch {
    return fetchWifiData();
  }
}
