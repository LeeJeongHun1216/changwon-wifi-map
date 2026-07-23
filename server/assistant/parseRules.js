import { extractKeywordFromMessage } from './wifiQuery.js';

const CARRIERS = ['KT', 'SKT', 'SKB', 'LGU+', '복합'];

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

  for (const c of CARRIERS) {
    const pattern =
      c === 'LGU+'
        ? /LGU\+?|엘지|유플러스/i
        : c === '복합'
          ? /복합/
          : new RegExp(`\\b${c}\\b|${c === 'SKB' ? '브로드밴드' : ''}`, 'i');
    if (pattern.test(text) && /만|필터|표시|보여/.test(text)) {
      return { intent: 'filter_carrier', carrier: c };
    }
  }

  if (/^KT$|^SKT$|^SKB$|^LGU\+?$|^복합$/.test(text.trim())) {
    const c = text.trim() === 'LGU' ? 'LGU+' : text.trim();
    if (CARRIERS.includes(c)) {
      return { intent: 'filter_carrier', carrier: c };
    }
  }

  const yearMatch = text.match(/(20\d{2})\s*년/);
  if (yearMatch) {
    return { intent: 'filter_year', year: yearMatch[1] };
  }

  return { intent: 'search', query: extractKeywordFromMessage(text) || text };
}
