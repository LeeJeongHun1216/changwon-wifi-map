import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { CARRIERS, getCarrierStyle } from '../utils/carrierColors';

export default function StatisticsCard({
  stats,
  referenceDate,
  compact = false,
  disableEnterAnimation = false,
}) {
  const carriers = CARRIERS.map((key) => ({ key, count: stats[key] ?? 0 }));

  const cardClass = 'w-full max-w-full overflow-hidden rounded-2xl shadow-lg shadow-primary/10';

  const content = (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light p-4 text-white md:p-5">
        <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 md:-right-6 md:-top-6 md:h-24 md:w-24" />
        <div className="pointer-events-none absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-white/10 md:-bottom-4 md:-left-4 md:h-16 md:w-16" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 opacity-90" />
            <span className="text-xs font-medium opacity-90">창원시 공공와이파이 현황</span>
          </div>
          <p className="text-2xl font-bold tracking-tight md:text-3xl">
            {stats.total.toLocaleString()}
            <span className="ml-1 text-base font-semibold opacity-90 md:text-lg">개소</span>
          </p>
          <p className="mt-2 text-xs opacity-75">
            {referenceDate ? `${referenceDate} 기준` : '실시간 집계'}
          </p>
        </div>
      </div>

      <div
        className={`glass-card grid w-full rounded-none border-t-0 py-3 ${
          compact
            ? 'grid-cols-5 gap-0 px-0'
            : 'grid-cols-3 gap-y-3 px-2 py-4'
        }`}
      >
        {carriers.map(({ key, count }) => {
          const style = getCarrierStyle(key);
          return (
            <div key={key} className="flex min-w-0 flex-col items-center gap-0.5 px-0.5">
              <span
                className={`font-bold ${compact ? 'text-[10px]' : 'text-xs'}`}
                style={{ color: style.text }}
              >
                {style.label}
              </span>
              <span className={`font-bold text-slate-800 ${compact ? 'text-xs' : 'text-base'}`}>
                {count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );

  if (disableEnterAnimation) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className={cardClass}
    >
      {content}
    </motion.div>
  );
}
