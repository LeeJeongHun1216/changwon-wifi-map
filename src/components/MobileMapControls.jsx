import { Search, Bot, SlidersHorizontal, Map } from 'lucide-react';

const items = [
  { id: 'map', icon: Map, label: '지도' },
  { id: 'search', icon: Search, label: '검색' },
  { id: 'ai', icon: Bot, label: 'AI' },
  { id: 'filter', icon: SlidersHorizontal, label: '필터' },
];

export default function MobileMapControls({ activePanel, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        {items.map(({ id, icon: Icon, label }) => {
          const isActive = id === 'map' ? !activePanel : activePanel === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id === 'map' ? null : id)}
              className={`flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold transition ${
                isActive ? 'bg-primary/10 text-primary' : 'text-slate-500'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
