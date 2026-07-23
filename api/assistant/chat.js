import { handleAssistantChat } from '../../server/assistant/handleChat.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, location } = req.body ?? {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const result = await handleAssistantChat({
      message: String(message).trim(),
      location: location?.lat != null && location?.lng != null ? location : null,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Assistant 처리 중 오류가 발생했습니다.',
    });
  }
}
