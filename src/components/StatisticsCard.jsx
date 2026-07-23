import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { CARRIERS, getCarrierStyle } from '../utils/carrierColors';

export default function StatisticsCard({ stats, referenceDate, disableEnterAnimation = false }) {
  const carriers = CARRIERS.map((key) => ({ key, count: stats[key] ?? 0 }));

  return (
    <motion.div
      initial={disableEnterAnimation ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: disableEnterAnimation ? 0 : 0.45, delay: disableEnterAnimation ? 0 : 0.2 }}
      className="overflow-hidden rounded-2xl shadow-lg shadow-primary/10"
    >
      <div className="relative bg-gradient-to-br from-primary via-primary to-primary-light p-5 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 opacity-90" />
              <span className="text-xs font-medium opacity-90">창원시 공공와이파이 현황</span>
            </div>
            <p className="text-3xl font-bold tracking-tight">
              {stats.total.toLocaleString()}
              <span className="ml-1 text-lg font-semibold opacity-90">개소</span>
            </p>
          </div>
        </div>

        <p className="relative mt-2 text-xs opacity-75">
          {referenceDate ? `${referenceDate} 기준` : '실시간 집계'}
        </p>
      </div>

      <div className="glass-card grid grid-cols-3 gap-y-3 rounded-none border-t-0 px-2 py-4">
        {carriers.map(({ key, count }) => {
          const style = getCarrierStyle(key);
          return (
            <div key={key} className="flex flex-col items-center gap-1 px-1">
              <span className="text-xs font-bold" style={{ color: style.text }}>
                {style.label}
              </span>
              <span className="text-base font-bold text-slate-800">
                {count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
