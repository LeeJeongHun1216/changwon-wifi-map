import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fetchWifiFromOdcloud, getCacheMeta } from '../server/fetchOdcloud.js';
import { normalizeWifiList } from '../server/normalizeWifi.js';

function loadFallbackData() {
  const path = join(process.cwd(), 'public/data/wifi.json');
  const raw = JSON.parse(readFileSync(path, 'utf-8'));
  return normalizeWifiList(raw);
}

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
    const data = await fetchWifiFromOdcloud();
    return res.status(200).json({
      source: 'odcloud',
      totalCount: data.length,
      ...getCacheMeta(),
      data,
    });
  } catch (apiError) {
    try {
      const data = loadFallbackData();
      return res.status(200).json({
        source: 'fallback',
        totalCount: data.length,
        warning: apiError.message,
        data,
      });
    } catch {
      return res.status(500).json({
        error: 'Wi-Fi 데이터를 불러올 수 없습니다.',
        detail: apiError.message,
      });
    }
  }
}
