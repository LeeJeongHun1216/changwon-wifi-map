import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Wifi, MapPin } from 'lucide-react';
import Header from '../components/Header';
import { useWifiData } from '../hooks/useWifiData';
import { filterWifiData } from '../utils/filters';
import { getCarrierCategory, getCarrierStyle } from '../utils/carrierColors';

export default function WifiList() {
  const { data, loading } = useWifiData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => filterWifiData(data, { query }),
    [data, query],
  );

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />

      <div className="mx-auto w-full max-w-5xl flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-800">Wi-Fi 목록</h2>
          <p className="mt-1 text-sm text-slate-500">
            창원시 공공 Wi-Fi {filtered.length}개소
          </p>
        </motion.div>

        <div className="glass-card mb-6 flex gap-2 rounded-2xl p-2">
          <Search className="ml-3 h-5 w-5 self-center text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소명 또는 주소 검색..."
            className="flex-1 bg-transparent py-3 pr-4 text-sm outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-slate-400">불러오는 중...</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((wifi, i) => {
              const category = getCarrierCategory(wifi);
              const style = getCarrierStyle(category);
              return (
                <motion.div
                  key={`${wifi.AP설치장소명}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: style.bg }}
                      >
                        <Wifi className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{wifi.AP설치장소명}</h3>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: style.text }}
                        >
                          {style.label}
                        </span>
                        {wifi.통신사 && category === '복합' && (
                          <p className="text-[10px] text-slate-400">{wifi.통신사}</p>
                        )}
                      </div>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                      AP {wifi.AP대수}대
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {wifi.주소}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">설치: {wifi.설치년월}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
