import { getCacheMeta } from '../server/fetchOdcloud.js';

export default function handler(_req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'changwon-wifi-map-api',
    cache: getCacheMeta(),
  });
}
