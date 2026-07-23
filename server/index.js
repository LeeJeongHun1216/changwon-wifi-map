import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fetchWifiFromOdcloud, getCacheMeta } from './fetchOdcloud.js';
import { normalizeWifiList } from './normalizeWifi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const fallbackDataPath = join(__dirname, '../public/data/wifi.json');

function loadFallbackData() {
  const raw = JSON.parse(readFileSync(fallbackDataPath, 'utf-8'));
  return normalizeWifiList(raw);
}

app.get('/api/wifi', async (_req, res) => {
  try {
    const data = await fetchWifiFromOdcloud();
    res.json({
      source: 'odcloud',
      totalCount: data.length,
      ...getCacheMeta(),
      data,
    });
  } catch (apiError) {
    try {
      const data = loadFallbackData();
      res.json({
        source: 'fallback',
        totalCount: data.length,
        warning: apiError.message,
        data,
      });
    } catch {
      res.status(500).json({ error: 'Wi-Fi 데이터를 불러올 수 없습니다.', detail: apiError.message });
    }
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'changwon-wifi-map-api', cache: getCacheMeta() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
