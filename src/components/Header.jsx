import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, List, Bot, Info, Wifi } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/wifi-list', label: 'Wi-Fi 목록', icon: List },
  { to: '/ai-assistant', label: 'AI Wi-Fi Assistant', icon: Bot },
  { to: '/guide', label: '서비스 안내', icon: Info },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card-strong z-30 flex h-[72px] shrink-0 items-center justify-between px-5 md:px-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <Wifi className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-primary md:text-lg">
            창원 공공 Wi-Fi Map
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            창원시 공공와이파이 정보를 한눈에!
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-1 md:gap-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all md:gap-2 md:px-4 md:text-sm ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-600 hover:bg-white/70 hover:text-primary'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.header>
  );
}
