import { motion } from 'framer-motion';
import { CARRIERS, getCarrierStyle } from '../utils/carrierColors';

export default function CarrierLegend({ visibleCarriers, onToggle, clusterEnabled, onClusterToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="glass-card absolute right-4 top-4 z-20 rounded-2xl p-4"
    >
      <p className="mb-3 text-xs font-bold text-slate-600">통신사 표시</p>
      <div className="space-y-2.5">
        {CARRIERS.map((carrier) => {
          const style = getCarrierStyle(carrier);
          const isOn = visibleCarriers[carrier] !== false;

          return (
            <label
              key={carrier}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: style.bg }}
                />
                <span className="text-sm font-medium text-slate-700">{carrier}</span>
              </div>
              <ToggleSwitch
                checked={isOn}
                onChange={() => onToggle(carrier)}
                color={style.bg}
              />
            </label>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="text-xs font-medium text-slate-600">클러스터 표시</span>
          <ToggleSwitch
            checked={clusterEnabled}
            onChange={onClusterToggle}
            color="#2563EB"
          />
        </label>
      </div>
    </motion.div>
  );
}

function ToggleSwitch({ checked, onChange, color }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        checked ? '' : 'bg-slate-200'
      }`}
      style={checked ? { backgroundColor: color } : undefined}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
        style={{ left: checked ? '22px' : '2px' }}
      />
    </button>
  );
}
