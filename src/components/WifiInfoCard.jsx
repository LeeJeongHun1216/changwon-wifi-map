import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Wifi,
  Calendar,
  Navigation,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { getCarrierCategory, getCarrierStyle } from '../utils/carrierColors';
import { openKakaoDirections, copyToClipboard } from '../utils/kakaoMap';

export default function WifiInfoCard({ wifi, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!wifi) return null;

  const category = getCarrierCategory(wifi);
  const carrierStyle = getCarrierStyle(category);

  const handleCopy = async () => {
    const success = await copyToClipboard(wifi.주소);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirections = () => {
    openKakaoDirections(parseFloat(wifi.위도), parseFloat(wifi.경도), wifi.AP설치장소명);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="glass-card-strong absolute bottom-[8.5rem] left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-2xl p-4 md:bottom-24 md:left-auto md:right-6 md:w-[calc(100%-2rem)] md:translate-x-0 md:p-5"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: category === '복합' ? getCarrierStyle('복합').bg : carrierStyle.bg }}
            >
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{wifi.AP설치장소명}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: carrierStyle.bg }}
                >
                  {carrierStyle.label}
                </span>
                {wifi.통신사 && wifi.통신사 !== carrierStyle.fullName && (
                  <span className="text-[11px] text-slate-500">{wifi.통신사}</span>
                )}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="mb-4 space-y-2.5">
          <InfoRow icon={MapPin} label="주소" value={wifi.주소} />
          <InfoRow icon={Wifi} label="AP 개수" value={`${wifi.AP대수}대`} />
          <InfoRow icon={Calendar} label="설치일" value={wifi.설치년월} />
          {category === '복합' && (
            <InfoRow icon={Wifi} label="통신사 상세" value={wifi.통신사} />
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleDirections}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25"
          >
            <Navigation className="h-4 w-4" />
            길찾기
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                주소 복사
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <span className="text-xs text-slate-400">{label}</span>
        <p className="font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}
