import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getCacheMeta } from './fetchOdcloud.js';
import { fetchWifiPayload } from './getWifiData.js';
import { handleAssistantChat } from './assistant/handleChat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/wifi', async (_req, res) => {
  try {
    res.json(await fetchWifiPayload());
  } catch (error) {
    res.status(500).json({
      error: 'Wi-Fi 데이터를 불러올 수 없습니다.',
      detail: error.message,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'changwon-wifi-map-api', cache: getCacheMeta() });
});

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, location } = req.body ?? {};
    const result = await handleAssistantChat({
      message,
      location: location?.lat != null ? location : null,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
