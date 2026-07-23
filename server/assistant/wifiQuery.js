import { parseCarrierCategory } from '../normalizeWifi.js';

export function getCarrierCategory(wifi) {
  return wifi.통신사분류 ?? parseCarrierCategory(wifi.통신사);
}

export function filterWifiList(data, { query = '', carrier = '전체', year = '전체' } = {}) {
  const q = query.trim().toLowerCase();

  return data.filter((item) => {
    const matchQ =
      !q ||
      item.AP설치장소명.toLowerCase().includes(q) ||
      item.주소.toLowerCase().includes(q);

    const cat = getCarrierCategory(item);
    const matchC = carrier === '전체' || cat === carrier;

    const y = item.설치년월?.slice(0, 4);
    const matchY = year === '전체' || y === year;

    return matchQ && matchC && matchY;
  });
}

export function parseCoord(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearest(data, lat, lng, limit = 5) {
  return data
    .map((item) => {
      const itemLat = parseCoord(item.위도);
      const itemLng = parseCoord(item.경도);
      if (itemLat === null || itemLng === null) return null;
      return {
        item,
        distanceKm: haversineKm(lat, lng, itemLat, itemLng),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function findTopApLocations(data, limit = 5) {
  const sorted = [...data].sort((a, b) => (b.AP대수 ?? 0) - (a.AP대수 ?? 0));
  return sorted.slice(0, limit);
}

export function computeStats(data) {
  const stats = { total: data.length, KT: 0, SKT: 0, SKB: 0, 'LGU+': 0, 복합: 0 };
  data.forEach((item) => {
    const c = getCarrierCategory(item);
    if (Object.hasOwn(stats, c)) stats[c] += 1;
  });
  return stats;
}

export function extractKeywordFromMessage(message) {
  const cleaned = message
    .replace(/와이파이|wifi|wi-fi|공공|무료|알려줘|찾아줘|보여줘|근처|주변|어디|있어|\?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const nearMatch = message.match(
    /(?:근처|주변|인근)\s*([가-힣a-zA-Z0-9]+)|([가-힣a-zA-Z0-9]+)\s*(?:근처|주변|인근)/,
  );
  if (nearMatch) {
    return (nearMatch[1] || nearMatch[2] || '').trim();
  }

  return cleaned.length >= 2 ? cleaned : '';
}
