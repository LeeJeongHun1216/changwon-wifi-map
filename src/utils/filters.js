import { getCarrierCategory } from './carrierColors';

export function filterWifiData(data, { query = '', carrier = '전체', year = '전체' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return data.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      item.AP설치장소명.toLowerCase().includes(normalizedQuery) ||
      item.주소.toLowerCase().includes(normalizedQuery);

    const category = getCarrierCategory(item);
    const matchesCarrier = carrier === '전체' || category === carrier;

    const installYear = item.설치년월?.slice(0, 4);
    const matchesYear = year === '전체' || installYear === year;

    return matchesQuery && matchesCarrier && matchesYear;
  });
}

export function filterByVisibleCarriers(data, visibleCarriers) {
  return data.filter((item) => {
    const category = getCarrierCategory(item);
    return visibleCarriers[category] !== false;
  });
}

export function computeStatistics(data) {
  const stats = {
    total: data.length,
    KT: 0,
    SKT: 0,
    SKB: 0,
    'LGU+': 0,
    복합: 0,
    latestInstall: null,
  };

  data.forEach((item) => {
    const category = getCarrierCategory(item);
    if (Object.hasOwn(stats, category) && category !== 'total' && category !== 'latestInstall') {
      stats[category] += 1;
    }

    if (item.설치년월) {
      if (!stats.latestInstall || item.설치년월 > stats.latestInstall) {
        stats.latestInstall = item.설치년월;
      }
    }
  });

  return stats;
}

export function getAvailableYears(data) {
  const years = new Set(
    data
      .map((item) => item.설치년월?.slice(0, 4))
      .filter(Boolean),
  );

  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function parseCoordinate(value) {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
}
