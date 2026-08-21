import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { CARRIERS, getCarrierStyle } from '../utils/carrierColors';

const CARRIER_LABELS = {
  SKB: 'SKB',
  복합: '복합',
};

export default function SearchPanel({
  query,
  onQueryChange,
  onSearch,
  carrier,
  onCarrierChange,
  year,
  onYearChange,
  years,
  compact = false,
  disableEnterAnimation = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  const cardClass = `glass-card w-full max-w-full overflow-hidden rounded-2xl ${compact ? 'p-4' : 'p-5'}`;

  const content = (
    <>
      {!compact && (
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-slate-800">Wi-Fi 검색</h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex w-full items-center rounded-xl border border-slate-200/80 bg-white/90 p-1 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              compact
                ? '장소를 검색하세요...'
                : '장소를 검색하세요 (예: 창원역, 용지호수공원)'
            }
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/25"
            aria-label="검색"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="전체"
          active={carrier === '전체'}
          onClick={() => onCarrierChange('전체')}
          staticChip={compact}
        />
        {CARRIERS.map((c) => (
          <FilterChip
            key={c}
            label={CARRIER_LABELS[c] ?? c}
            title={getCarrierStyle(c).fullName}
            active={carrier === c}
            onClick={() => onCarrierChange(c)}
            carrier={c}
            staticChip={compact}
          />
        ))}
      </div>

      <div className="relative mt-3">
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="전체">설치년도 전체</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
      transition={{ duration: 0.45, delay: 0.1 }}
      className={cardClass}
    >
      {content}
    </motion.div>
  );
}

function FilterChip({ label, title, active, onClick, carrier, staticChip = false }) {
  const carrierStyles = {
    KT: active ? 'bg-kt text-white' : 'bg-blue-50 text-kt hover:bg-blue-100',
    SKT: active ? 'bg-skt text-white' : 'bg-orange-50 text-skt hover:bg-orange-100',
    SKB: active ? 'bg-skb text-white' : 'bg-violet-50 text-skb hover:bg-violet-100',
    'LGU+': active ? 'bg-lgu text-white' : 'bg-pink-50 text-lgu hover:bg-pink-100',
    복합: active ? 'bg-composite text-white' : 'bg-indigo-50 text-composite hover:bg-indigo-100',
  };

  const style = carrier
    ? carrierStyles[carrier]
    : active
      ? 'bg-primary text-white shadow-sm shadow-primary/20'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200';

  const className = `rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${style}`;

  if (staticChip) {
    return (
      <button type="button" title={title} onClick={onClick} className={className}>
        {label}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      title={title}
      onClick={onClick}
      className={className}
    >
      {label}
    </motion.button>
  );
}
