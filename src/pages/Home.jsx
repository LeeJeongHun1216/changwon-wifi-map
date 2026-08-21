import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Sidebar, { SidebarContent } from '../components/Sidebar';
import MapContainer from '../components/MapContainer';
import MobileBottomSheet from '../components/MobileBottomSheet';
import MobileMapControls from '../components/MobileMapControls';
import AIChat from '../components/AIChat';
import { CarrierLegendContent } from '../components/CarrierLegend';
import { useWifiData } from '../hooks/useWifiData';
import { CARRIERS } from '../utils/carrierColors';
import {
  filterWifiData,
  filterByVisibleCarriers,
  computeStatistics,
  getAvailableYears,
} from '../utils/filters';

const DEFAULT_VISIBLE = Object.fromEntries(CARRIERS.map((c) => [c, true]));

const PANEL_TITLES = {
  search: 'Wi-Fi 검색',
  ai: 'AI Wi-Fi Assistant',
  filter: '지도 필터',
};

export default function Home() {
  const { data, loading, error } = useWifiData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [carrier, setCarrier] = useState('전체');
  const [year, setYear] = useState('전체');
  const [visibleCarriers, setVisibleCarriers] = useState(DEFAULT_VISIBLE);
  const [clusterEnabled, setClusterEnabled] = useState(false);
  const [mapResetKey, setMapResetKey] = useState(0);
  const [mobilePanel, setMobilePanel] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    const c = searchParams.get('carrier');
    const y = searchParams.get('year');

    if (q) {
      setQuery(q);
      setSearchQuery(q);
    }
    if (c) setCarrier(c);
    if (y) setYear(y);

    if (q || c || y) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const years = useMemo(() => getAvailableYears(data), [data]);

  const searchFilteredData = useMemo(
    () =>
      filterWifiData(data, {
        query: searchQuery,
        carrier,
        year,
      }),
    [data, searchQuery, carrier, year],
  );

  const visibleMapData = useMemo(
    () => filterByVisibleCarriers(searchFilteredData, visibleCarriers),
    [searchFilteredData, visibleCarriers],
  );

  const allStats = useMemo(() => computeStatistics(data), [data]);
  const displayStats = useMemo(() => computeStatistics(visibleMapData), [visibleMapData]);

  const referenceDate = allStats.latestInstall;

  const shouldAutoFit = useMemo(() => {
    return Boolean(searchQuery.trim()) && visibleMapData.length <= 50;
  }, [searchQuery, visibleMapData.length]);

  const handleSearch = useCallback(() => {
    setSearchQuery(query);
  }, [query]);

  const handleCarrierChange = useCallback((nextCarrier) => {
    setCarrier(nextCarrier);
  }, []);

  const handleToggleCarrier = useCallback((c) => {
    setVisibleCarriers((prev) => {
      const isOn = prev[c] !== false;
      return { ...prev, [c]: !isOn };
    });
  }, []);

  const handleInfoCardClose = useCallback(() => {
    if (searchQuery.trim()) {
      setQuery('');
      setSearchQuery('');
      setMapResetKey((k) => k + 1);
    }
  }, [searchQuery]);

  const handleAssistantActions = useCallback((actions) => {
    if (!actions) return;

    if (actions.clearSearch) {
      setQuery('');
      setSearchQuery('');
      setCarrier('전체');
      setYear('전체');
      setVisibleCarriers(DEFAULT_VISIBLE);
      setMapResetKey((k) => k + 1);
      setMobilePanel(null);
      return;
    }

    if (actions.syncQuery !== undefined || actions.searchQuery !== undefined) {
      const q = actions.syncQuery ?? actions.searchQuery ?? '';
      setQuery(q);
      setSearchQuery(q);
    }

    if (actions.carrier) {
      setCarrier(actions.carrier);
    }

    if (actions.year) {
      setYear(actions.year);
    }

    if (actions.resetMap) {
      setMapResetKey((k) => k + 1);
    }

    setMobilePanel(null);
  }, []);

  const sidebarProps = {
    query,
    onQueryChange: setQuery,
    onSearch: handleSearch,
    carrier,
    onCarrierChange: handleCarrierChange,
    year,
    onYearChange: setYear,
    years,
    stats: allStats,
    referenceDate,
    onAssistantActions: handleAssistantActions,
  };

  if (loading) {
    return (
      <div className="flex h-dvh flex-col bg-bg">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh flex-col bg-bg">
        <Header />
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-w-full flex-col overflow-hidden bg-bg">
      <Header />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar {...sidebarProps} />

        <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-hidden md:p-0">
          <MapContainer
            wifiData={searchFilteredData}
            stats={displayStats}
            visibleCarriers={visibleCarriers}
            onToggleCarrier={handleToggleCarrier}
            clusterEnabled={clusterEnabled}
            onClusterToggle={() => setClusterEnabled((v) => !v)}
            shouldAutoFit={shouldAutoFit}
            onInfoCardClose={handleInfoCardClose}
            mapResetKey={mapResetKey}
            isMobileLayout
          />

          <MobileMapControls
            activePanel={mobilePanel}
            onChange={(panel) => setMobilePanel(panel)}
          />

          <MobileBottomSheet
            open={Boolean(mobilePanel)}
            onClose={() => setMobilePanel(null)}
            title={PANEL_TITLES[mobilePanel] ?? ''}
          >
            {mobilePanel === 'search' && <SidebarContent {...sidebarProps} compact />}
            {mobilePanel === 'ai' && (
              <AIChat
                onApplyActions={handleAssistantActions}
                expanded
                disableEnterAnimation
              />
            )}
            {mobilePanel === 'filter' && (
              <div className="glass-card w-full max-w-full overflow-hidden rounded-2xl p-4">
                <CarrierLegendContent
                  visibleCarriers={visibleCarriers}
                  onToggle={handleToggleCarrier}
                  clusterEnabled={clusterEnabled}
                  onClusterToggle={() => setClusterEnabled((v) => !v)}
                />
              </div>
            )}
          </MobileBottomSheet>
        </main>
      </div>
    </div>
  );
}
