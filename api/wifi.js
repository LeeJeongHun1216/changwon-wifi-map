import { fetchWifiPayload } from '../server/getWifiData.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json(await fetchWifiPayload());
  } catch (error) {
    return res.status(500).json({
      error: 'Wi-Fi 데이터를 불러올 수 없습니다.',
      detail: error.message,
    });
  }
}
