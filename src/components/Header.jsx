import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, Bot, Info, Wifi, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/wifi-list', label: 'Wi-Fi 목록', icon: List },
  { to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { to: '/guide', label: '서비스 안내', icon: Info },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-card-strong z-30 flex h-14 shrink-0 items-center justify-between px-4 md:h-[72px] md:px-8"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 md:h-10 md:w-10 md:rounded-2xl">
            <Wifi className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight text-primary md:text-lg">
              창원 공공 Wi-Fi Map
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              창원시 공공와이파이 정보를 한눈에!
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex md:gap-2">
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

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,280px)] flex-col bg-white p-5 shadow-2xl md:hidden"
              style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-bold text-slate-800">메뉴</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
