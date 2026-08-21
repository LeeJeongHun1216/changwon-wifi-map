import SearchPanel from './SearchPanel';
import StatisticsCard from './StatisticsCard';
import AIChat from './AIChat';

export function SidebarContent({
  query,
  onQueryChange,
  onSearch,
  carrier,
  onCarrierChange,
  year,
  onYearChange,
  years,
  stats,
  referenceDate,
  onAssistantActions,
  compact = false,
}) {
  return (
    <div className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden">
      <SearchPanel
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        carrier={carrier}
        onCarrierChange={onCarrierChange}
        year={year}
        onYearChange={onYearChange}
        years={years}
        compact={compact}
        disableEnterAnimation={compact}
      />
      <StatisticsCard
        stats={stats}
        referenceDate={referenceDate}
        compact={compact}
        disableEnterAnimation={compact}
      />
      {!compact && <AIChat onApplyActions={onAssistantActions} />}
    </div>
  );
}

export default function Sidebar(props) {
  return (
    <aside className="hidden w-[380px] shrink-0 flex-col gap-4 overflow-y-auto p-5 md:flex">
      <SidebarContent {...props} />
    </aside>
  );
}
