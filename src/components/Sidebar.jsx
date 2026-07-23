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
    <div className={`flex flex-col gap-4 ${compact ? '' : ''}`}>
      <SearchPanel
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        carrier={carrier}
        onCarrierChange={onCarrierChange}
        year={year}
        onYearChange={onYearChange}
        years={years}
      />
      <StatisticsCard stats={stats} referenceDate={referenceDate} />
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
