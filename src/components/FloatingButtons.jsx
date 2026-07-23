import { motion } from 'framer-motion';
import { Crosshair, Plus, Minus, Map as MapIcon } from 'lucide-react';

export default function FloatingButtons({
  onLocate,
  onZoomIn,
  onZoomOut,
  onToggleMapType,
  isMobileLayout = false,
}) {
  const btnClass =
    'flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-lg backdrop-blur-sm transition active:scale-95 md:h-11 md:w-11 md:hover:bg-white md:hover:text-primary';

  return (
    <div
      className={`absolute right-3 z-20 flex flex-col gap-2 md:right-4 ${
        isMobileLayout ? 'bottom-[7.5rem]' : 'bottom-24 md:bottom-28'
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onLocate}
        className={btnClass}
        title="현재 위치"
        aria-label="현재 위치"
      >
        <Crosshair className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onZoomIn}
        className={btnClass}
        title="확대"
        aria-label="확대"
      >
        <Plus className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onZoomOut}
        className={btnClass}
        title="축소"
        aria-label="축소"
      >
        <Minus className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onToggleMapType}
        className={`${btnClass} hidden sm:flex`}
        title="지도 타입"
        aria-label="지도 타입"
      >
        <MapIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
