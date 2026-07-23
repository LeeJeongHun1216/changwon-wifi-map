import { motion } from 'framer-motion';
import { Crosshair, Plus, Minus, Map as MapIcon } from 'lucide-react';

export default function FloatingButtons({ onLocate, onZoomIn, onZoomOut, onToggleMapType }) {
  const btnClass =
    'flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white hover:text-primary';

  return (
    <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2 md:bottom-28">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onLocate}
        className={btnClass}
        title="현재 위치"
      >
        <Crosshair className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onZoomIn}
        className={btnClass}
        title="확대"
      >
        <Plus className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onZoomOut}
        className={btnClass}
        title="축소"
      >
        <Minus className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onToggleMapType}
        className={btnClass}
        title="지도 타입"
      >
        <MapIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
