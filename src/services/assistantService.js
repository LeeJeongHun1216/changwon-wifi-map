const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function chatUrl() {
  return API_BASE ? `${API_BASE}/api/assistant/chat` : '/api/assistant/chat';
}

export function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  });
}

/**
 * @param {string} message
 * @param {{ lat: number, lng: number } | null} [location]
 */
export async function sendAssistantMessage(message, location = null) {
  const body = { message };
  if (location) body.location = location;

  const response = await fetch(chatUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'AI Assistant 요청에 실패했습니다.');
  }

  return json;
}

export const SUGGESTED_QUESTIONS = [
  '창원역 근처 Wi-Fi 알려줘',
  'KT만 보여줘',
  '가장 가까운 Wi-Fi 찾아줘',
  'AP가 가장 많은 곳은?',
];

export function messageNeedsLocation(text) {
  return /가장\s*가까운|내\s*주변|현재\s*위치|가까운\s*와이파/i.test(text);
}
