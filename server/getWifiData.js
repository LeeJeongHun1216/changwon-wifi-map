import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchWifiFromOdcloud, getCacheMeta } from './fetchOdcloud.js';
import { normalizeWifiList } from './normalizeWifi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadFallbackData() {
  const path = join(__dirname, '../public/data/wifi.json');
  const raw = JSON.parse(readFileSync(path, 'utf-8'));
  return normalizeWifiList(raw);
}

export async function getWifiData() {
  try {
    return await fetchWifiFromOdcloud();
  } catch {
    return loadFallbackData();
  }
}

export async function fetchWifiPayload() {
  try {
    const data = await fetchWifiFromOdcloud();
    return {
      source: 'odcloud',
      totalCount: data.length,
      ...getCacheMeta(),
      data,
    };
  } catch (apiError) {
    try {
      const data = loadFallbackData();
      return {
        source: 'fallback',
        totalCount: data.length,
        warning: apiError.message,
        data,
      };
    } catch {
      throw apiError;
    }
  }
}
