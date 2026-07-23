import { motion } from 'framer-motion';
import { Wifi, Calendar, Map } from 'lucide-react';
import { CARRIERS, getCarrierStyle } from '../utils/carrierColors';

export default function StatusBar({ stats, isMobileLayout = false }) {
  const carrierItems = CARRIERS.map((key) => ({
    icon: Wifi,
    label: getCarrierStyle(key).label,
    value: `${(stats[key] ?? 0).toLocaleString()} 개소`,
    color: getCarrierStyle(key).bg,
  }));

  const items = [
    {
      icon: Wifi,
      label: '전체 Wi-Fi',
      value: `${stats.total.toLocaleString()} 개소`,
      color: '#2563EB',
    },
    ...carrierItems,
    {
      icon: Calendar,
      label: '최근 설치',
      value: stats.latestInstall ?? '-',
      color: '#64748B',
    },
    {
      icon: Map,
      label: 'Coverage',
      value: '창원시 전역',
      color: '#64748B',
    },
  ];

  const mobileBottom = isMobileLayout ? 'bottom-[4.25rem]' : 'bottom-16 xl:hidden';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card-strong absolute bottom-4 left-1/2 z-20 hidden w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl px-5 py-3.5 xl:flex"
      >
        <div className="flex w-full items-center gap-3 overflow-x-auto">
          {items.map((item, index) => (
            <div key={item.label} className="flex shrink-0 items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="h-4 w-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">{item.label}</p>
                <p className="text-sm font-bold text-slate-800">{item.value}</p>
              </div>
              {index < items.length - 1 && (
                <div className="ml-2 hidden h-8 w-px bg-slate-200 2xl:block" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`glass-card-strong absolute left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl px-2 py-2 xl:hidden ${mobileBottom}`}
      >
        <div className="flex w-full items-center justify-evenly">
          <MiniStat label="전체" value={stats.total} color="#2563EB" />
          {CARRIERS.map((key) => (
            <MiniStat
              key={key}
              label={getCarrierStyle(key).label}
              value={stats[key] ?? 0}
              color={getCarrierStyle(key).bg}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <p className="text-[9px] font-medium text-slate-400 md:text-[10px]">{label}</p>
      <p className="text-xs font-bold md:text-sm" style={{ color }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
