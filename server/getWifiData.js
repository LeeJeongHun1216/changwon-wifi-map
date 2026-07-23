import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchWifiFromOdcloud } from './fetchOdcloud.js';
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
