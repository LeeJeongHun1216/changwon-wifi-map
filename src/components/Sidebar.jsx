import SearchPanel from './SearchPanel';
import StatisticsCard from './StatisticsCard';
import AIChat from './AIChat';

export default function Sidebar({
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
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto p-4 md:w-[380px] md:p-5">
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
      <AIChat />
    </aside>
  );
}
