import { parseIntentRules } from './parseRules.js';

const SYSTEM_PROMPT = `당신은 창원시 공공 Wi-Fi 지도 서비스의 intent 분석기입니다.
사용자 메시지를 분석해 반드시 아래 JSON 형식만 출력하세요.

{
  "intent": "search | filter_carrier | filter_year | nearest | stats | explain | reset",
  "query": "검색 키워드 (장소명·주소, search일 때)",
  "carrier": "전체 | KT | SKT | SKB | LGU+ | 복합 (filter_carrier일 때)",
  "year": "전체 | 2018~2024 등 4자리 (filter_year일 때)",
  "statType": "most_ap | summary (stats일 때)"
}

규칙:
- "창원역 근처" → intent search, query "창원역"
- "KT만" → filter_carrier, carrier KT
- "가장 가까운" → nearest
- "AP 많은 곳" → stats, statType most_ap
- 서비스 설명 요청 → explain
- 전체 보기 → reset`;

export async function parseIntentWithLLM(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) return null;

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!parsed.intent) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function resolveIntent(message) {
  const llm = await parseIntentWithLLM(message);
  if (llm?.intent) return llm;
  return parseIntentRules(message);
}
