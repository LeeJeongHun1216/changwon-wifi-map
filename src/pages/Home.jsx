import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MapContainer from '../components/MapContainer';
import { useWifiData } from '../hooks/useWifiData';
import { CARRIERS } from '../utils/carrierColors';
import {
  filterWifiData,
  filterByVisibleCarriers,
  computeStatistics,
  getAvailableYears,
} from '../utils/filters';

const DEFAULT_VISIBLE = Object.fromEntries(CARRIERS.map((c) => [c, true]));

export default function Home() {
  const { data, loading, error } = useWifiData();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [carrier, setCarrier] = useState('전체');
  const [year, setYear] = useState('전체');
  const [visibleCarriers, setVisibleCarriers] = useState(DEFAULT_VISIBLE);
  const [clusterEnabled, setClusterEnabled] = useState(false);
  const [mapResetKey, setMapResetKey] = useState(0);

  const years = useMemo(() => getAvailableYears(data), [data]);

  /** 검색·통신사 탭·설치년도 필터만 적용 (지도에 넘길 원본) */
  const searchFilteredData = useMemo(
    () =>
      filterWifiData(data, {
        query: searchQuery,
        carrier,
        year,
      }),
    [data, searchQuery, carrier, year],
  );

  /** 범례 ON/OFF까지 반영된 표시용 데이터·통계 */
  const visibleMapData = useMemo(
    () => filterByVisibleCarriers(searchFilteredData, visibleCarriers),
    [searchFilteredData, visibleCarriers],
  );

  const allStats = useMemo(() => computeStatistics(data), [data]);
  const displayStats = useMemo(() => computeStatistics(visibleMapData), [visibleMapData]);

  const referenceDate = allStats.latestInstall;

  const shouldAutoFit = Boolean(searchQuery.trim()) && visibleMapData.length <= 50;

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

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-bg">
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
      <div className="flex h-full flex-col bg-bg">
        <Header />
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg">
      <Header />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          carrier={carrier}
          onCarrierChange={handleCarrierChange}
          year={year}
          onYearChange={setYear}
          years={years}
          stats={allStats}
          referenceDate={referenceDate}
        />

        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-3 md:p-0">
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
          />
        </main>
      </div>
    </div>
  );
}
