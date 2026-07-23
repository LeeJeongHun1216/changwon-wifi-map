import {
  filterWifiList,
  findNearest,
  findTopApLocations,
  computeStats,
  extractKeywordFromMessage,
  parseCoord,
} from './wifiQuery.js';

function formatPlaceList(items, max = 3) {
  return items.slice(0, max).map((w) => `• ${w.AP설치장소명} (${w.통신사분류}, AP ${w.AP대수}대)`);
}

function buildActions(partial) {
  return {
    searchQuery: partial.searchQuery,
    syncQuery: partial.syncQuery,
    carrier: partial.carrier,
    year: partial.year,
    fitMap: partial.fitMap ?? false,
    resetMap: partial.resetMap ?? false,
    clearSearch: partial.clearSearch ?? false,
    focus: partial.focus,
  };
}

/**
 * @param {object} intent
 * @param {Array} allData
 * @param {{ lat: number, lng: number } | null} location
 */
export function executeIntent(intent, allData, location) {
  const type = intent.intent || 'search';

  switch (type) {
    case 'reset': {
      return {
        reply:
          '검색과 필터를 초기화했어요. 창원시 전체 공공 Wi-Fi를 지도에서 다시 볼 수 있습니다.',
        actions: buildActions({ clearSearch: true, resetMap: true, carrier: '전체', year: '전체' }),
        resultCount: allData.length,
      };
    }

    case 'explain': {
      return {
        reply:
          '창원 공공 Wi-Fi Map은 창원시 공공데이터 832개 AP를 지도에서 검색·필터링할 수 있는 서비스입니다. "창원역 근처", "KT만", "가장 가까운 Wi-Fi", "AP 많은 곳"처럼 물어보세요.',
        actions: buildActions({}),
        resultCount: null,
      };
    }

    case 'filter_carrier': {
      const carrier = intent.carrier || 'KT';
      const filtered = filterWifiList(allData, { carrier });
      const lines = formatPlaceList(filtered);
      return {
        reply: `${carrier} 공공 Wi-Fi ${filtered.length}개소를 표시합니다.${lines.length ? `\n${lines.join('\n')}` : ''}${filtered.length > 3 ? `\n… 외 ${filtered.length - 3}곳` : ''}`,
        actions: buildActions({
          carrier,
          searchQuery: '',
          syncQuery: '',
          fitMap: filtered.length > 0 && filtered.length <= 50,
          resetMap: filtered.length > 50,
        }),
        highlights: filtered.slice(0, 5),
        resultCount: filtered.length,
      };
    }

    case 'filter_year': {
      const year = String(intent.year || '전체');
      const filtered = filterWifiList(allData, { year });
      return {
        reply: `${year}년 설치 AP ${filtered.length}개소를 찾았습니다.`,
        actions: buildActions({
          year,
          fitMap: filtered.length > 0 && filtered.length <= 50,
          resetMap: filtered.length > 50,
        }),
        highlights: filtered.slice(0, 5),
        resultCount: filtered.length,
      };
    }

    case 'nearest': {
      if (!location?.lat || !location?.lng) {
        return {
          reply:
            '가장 가까운 Wi-Fi를 찾으려면 브라우저에서 **위치 권한**을 허용해 주세요. 또는 "창원역 근처 Wi-Fi"처럼 장소명으로 검색할 수도 있어요.',
          actions: buildActions({}),
          needsLocation: true,
          resultCount: 0,
        };
      }

      const nearest = findNearest(allData, location.lat, location.lng, 5);
      if (nearest.length === 0) {
        return {
          reply: '주변에서 Wi-Fi AP를 찾지 못했습니다.',
          actions: buildActions({}),
          resultCount: 0,
        };
      }

      const top = nearest[0];
      const lines = nearest.map(
        (n) =>
          `• ${n.item.AP설치장소명} (${n.distanceKm.toFixed(2)}km, ${n.item.통신사분류})`,
      );

      return {
        reply: `현재 위치에서 가장 가까운 곳은 **${top.item.AP설치장소명}** (${top.distanceKm.toFixed(2)}km)입니다.\n${lines.join('\n')}`,
        actions: buildActions({
          searchQuery: top.item.AP설치장소명,
          syncQuery: top.item.AP설치장소명,
          fitMap: true,
          focus: {
            lat: parseCoord(top.item.위도),
            lng: parseCoord(top.item.경도),
            name: top.item.AP설치장소명,
          },
        }),
        highlights: nearest.map((n) => n.item),
        resultCount: nearest.length,
      };
    }

    case 'stats': {
      if (intent.statType === 'most_ap') {
        const top = findTopApLocations(allData, 5);
        const lines = top.map((w) => `• ${w.AP설치장소명} — AP ${w.AP대수}대 (${w.통신사분류})`);
        const best = top[0];
        return {
          reply: `AP 대수가 가장 많은 곳은 **${best?.AP설치장소명}** (${best?.AP대수}대)입니다.\n${lines.join('\n')}`,
          actions: buildActions({
            searchQuery: best?.AP설치장소명 || '',
            syncQuery: best?.AP설치장소명 || '',
            fitMap: true,
          }),
          highlights: top,
          resultCount: top.length,
        };
      }

      const stats = computeStats(allData);
      return {
        reply: `창원시 공공 Wi-Fi 총 ${stats.total}개소입니다.\nKT ${stats.KT} · SKT ${stats.SKT} · SKB ${stats.SKB} · LGU+ ${stats['LGU+']} · 복합 ${stats.복합}`,
        actions: buildActions({ resetMap: true }),
        resultCount: stats.total,
      };
    }

    case 'search':
    default: {
      let query = (intent.query || '').trim();
      if (!query) query = extractKeywordFromMessage(intent.rawMessage || '');
      if (!query) {
        return {
          reply: '검색할 장소명이나 주소를 알려주세요. 예: 창원역, 용지호수공원',
          actions: buildActions({}),
          resultCount: 0,
        };
      }

      const filtered = filterWifiList(allData, { query });
      if (filtered.length === 0) {
        return {
          reply: `"${query}" 검색 결과가 없습니다. 다른 키워드로 시도해 보세요.`,
          actions: buildActions({ searchQuery: query, syncQuery: query, fitMap: false }),
          resultCount: 0,
        };
      }

      const lines = formatPlaceList(filtered);
      return {
        reply: `"${query}" 검색 결과 ${filtered.length}개소입니다.\n${lines.join('\n')}${filtered.length > 3 ? `\n… 외 ${filtered.length - 3}곳` : ''}`,
        actions: buildActions({
          searchQuery: query,
          syncQuery: query,
          fitMap: filtered.length <= 50,
          resetMap: filtered.length > 50,
        }),
        highlights: filtered.slice(0, 5),
        resultCount: filtered.length,
      };
    }
  }
}
