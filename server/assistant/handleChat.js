import { getWifiData } from '../getWifiData.js';
import { resolveIntent } from './parseLlm.js';
import { executeIntent } from './executeIntent.js';

export async function handleAssistantChat({ message, location = null }) {
  const trimmed = String(message || '').trim();
  if (!trimmed) {
    throw new Error('메시지가 비어 있습니다.');
  }

  if (trimmed.length > 500) {
    throw new Error('메시지는 500자 이내로 입력해 주세요.');
  }

  const data = await getWifiData();
  const intent = await resolveIntent(trimmed);
  intent.rawMessage = trimmed;

  const result = executeIntent(intent, data, location);

  return {
    reply: result.reply.replace(/\*\*(.*?)\*\*/g, '$1'),
    replyMarkdown: result.reply,
    actions: result.actions,
    highlights: result.highlights ?? [],
    resultCount: result.resultCount,
    needsLocation: result.needsLocation ?? false,
    intent: intent.intent,
    poweredBy: process.env.OPENAI_API_KEY ? 'openai+rules' : 'rules',
  };
}
