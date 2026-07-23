import { extractKeywordFromMessage } from './wifiQuery.js';

const CARRIER_PATTERNS = [
  { carrier: 'LGU+', pattern: /LGU\+?|엘지\s*유플러스|유플러스/i },
  { carrier: 'SKB', pattern: /SKB|에스케이\s*브로드밴드|브로드밴드/i },
  { carrier: 'SKT', pattern: /SKT|에스케이\s*텔레콤|에스케이텔레콤/i },
  { carrier: 'KT', pattern: /(?<![A-Z])KT(?![A-Z])|케이\s*티|케이티/i },
  { carrier: '복합', pattern: /복합/i },
];

const FILTER_HINT = /만|필터|표시|보여/;

/**
 * @returns {{ intent: string, query?: string, carrier?: string, year?: string, statType?: string }}
 */
export function parseIntentRules(message) {
  const text = message.trim();
  const lower = text.toLowerCase();

  if (/초기화|전체\s*보|리셋|처음으로/.test(text)) {
    return { intent: 'reset' };
  }

  if (/서비스|안내|뭐야|무엇|help|도움/.test(lower) && !/와이파이|wifi/.test(lower)) {
    return { intent: 'explain' };
  }

  if (/가장\s*가까운|내\s*주변|현재\s*위치|가까운\s*와이파|가까운\s*wifi/.test(text)) {
    return { intent: 'nearest' };
  }

  if (/AP.*많|많은\s*곳|최다|top/i.test(text)) {
    return { intent: 'stats', statType: 'most_ap' };
  }

  if (/통신사|현황|몇\s*개|개수|통계/.test(text) && !/근처|주변/.test(text)) {
    return { intent: 'stats', statType: 'summary' };
  }

  if (FILTER_HINT.test(text)) {
    for (const { carrier, pattern } of CARRIER_PATTERNS) {
      if (pattern.test(text)) {
        return { intent: 'filter_carrier', carrier };
      }
    }
  }

  const exact = text.replace(/\s+/g, '').toUpperCase();
  const exactMap = { KT: 'KT', SKT: 'SKT', SKB: 'SKB', 'LGU+': 'LGU+', LGU: 'LGU+', 복합: '복합' };
  if (exactMap[exact]) {
    return { intent: 'filter_carrier', carrier: exactMap[exact] };
  }

  const yearMatch = text.match(/(20\d{2})\s*년/);
  if (yearMatch) {
    return { intent: 'filter_year', year: yearMatch[1] };
  }

  return { intent: 'search', query: extractKeywordFromMessage(text) || text };
}
