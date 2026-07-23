import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { loadKakaoMapScript, createMarkerElement } from '../utils/kakaoMap';
import { CHANGWON_CENTER, getCarrierCategory } from '../utils/carrierColors';
import { parseCoordinate } from '../utils/filters';
import WifiInfoCard from './WifiInfoCard';
import StatusBar from './StatusBar';
import FloatingButtons from './FloatingButtons';
import CarrierLegend from './CarrierLegend';

const MAP_TYPES = ['ROADMAP', 'HYBRID', 'SKYVIEW'];
const AUTO_FIT_MAX = 50;
/** 카카오맵 level: 숫자가 작을수록 확대. minLevel 6 이상에서 클러스터 */
const CLUSTER_MAX_ZOOM_LEVEL = 6;

function resetMapView(map, maps) {
  const center = new maps.LatLng(CHANGWON_CENTER.lat, CHANGWON_CENTER.lng);
  map.setCenter(center);
  map.setLevel(7);
}

function fitMapToPositions(map, maps, positions, shouldAutoFit) {
  if (positions.length === 0) {
    resetMapView(map, maps);
    return;
  }

  if (positions.length === 1) {
    map.setCenter(positions[0]);
    map.setLevel(5);
    return;
  }

  if (!shouldAutoFit || positions.length > AUTO_FIT_MAX) {
    return;
  }

  const bounds = new maps.LatLngBounds();
  positions.forEach((p) => bounds.extend(p));
  map.setBounds(bounds, 80, 80, 80, 380);
}

export default function MapContainer({
  wifiData,
  stats,
  visibleCarriers,
  onToggleCarrier,
  clusterEnabled,
  onClusterToggle,
  shouldAutoFit = false,
  onInfoCardClose,
  mapResetKey = 0,
  isMobileLayout = false,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);
  const overlaysRef = useRef([]);
  const zoomListenerRef = useRef(null);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const [locating, setLocating] = useState(false);

  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  const clearMarkerLayers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clear();
      clustererRef.current = null;
    }
  }, []);

  const buildVisibleItems = useCallback(
    (maps, data) => {
      const items = [];

      data.forEach((wifi) => {
        const lat = parseCoordinate(wifi.위도);
        const lng = parseCoordinate(wifi.경도);
        if (lat === null || lng === null) return;

        const category = getCarrierCategory(wifi);
        if (visibleCarriers[category] === false) return;

        items.push({
          wifi,
          category,
          position: new maps.LatLng(lat, lng),
        });
      });

      return items;
    },
    [visibleCarriers],
  );

  const showCustomOverlays = useCallback((map, maps, items) => {
    items.forEach((item, index) => {
      const content = createMarkerElement(item.category, index);
      content.addEventListener('click', () => {
        setSelectedWifi(item.wifi);
        map.panTo(item.position);
      });

      const overlay = new maps.CustomOverlay({
        position: item.position,
        content,
        yAnchor: 1,
        zIndex: index,
      });

      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });
  }, []);

  const showClusterLayer = useCallback((map, maps, items) => {
    items.forEach((item) => {
      const marker = new maps.Marker({
        position: item.position,
        opacity: 0,
        clickable: false,
      });
      markersRef.current.push(marker);
    });

    if (markersRef.current.length === 0) return;

    clustererRef.current = new maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: CLUSTER_MAX_ZOOM_LEVEL,
      disableClickZoom: false,
    });
    clustererRef.current.addMarkers(markersRef.current);
  }, []);

  const applyMarkerLayer = useCallback(
    (options = { fit: false }) => {
      const map = mapInstanceRef.current;
      const maps = window.kakao?.maps;
      if (!map || !maps) return;

      clearMarkerLayers();

      const items = buildVisibleItems(maps, wifiData);
      const positions = items.map((item) => item.position);

      const useCluster =
        clusterEnabled &&
        maps.MarkerClusterer &&
        map.getLevel() >= CLUSTER_MAX_ZOOM_LEVEL;

      if (useCluster) {
        showClusterLayer(map, maps, items);
      } else {
        showCustomOverlays(map, maps, items);
      }

      if (options.fit) {
        fitMapToPositions(map, maps, positions, shouldAutoFit);
      }

      map.relayout();
    },
    [
      wifiData,
      clusterEnabled,
      shouldAutoFit,
      clearMarkerLayers,
      buildVisibleItems,
      showCustomOverlays,
      showClusterLayer,
    ],
  );

  useEffect(() => {
    if (!apiKey || apiKey === 'your_kakao_javascript_key_here') {
      setMapError('카카오맵 API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_MAP_API_KEY를 추가해주세요.');
      return;
    }

    let cancelled = false;

    loadKakaoMapScript(apiKey)
      .then((maps) => {
        if (cancelled || !mapRef.current) return;

        const center = new maps.LatLng(CHANGWON_CENTER.lat, CHANGWON_CENTER.lng);
        const map = new maps.Map(mapRef.current, {
          center,
          level: 7,
        });

        mapInstanceRef.current = map;
        setMapReady(true);

        requestAnimationFrame(() => {
          map.relayout();
        });
      })
      .catch((err) => {
        if (!cancelled) setMapError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    applyMarkerLayer({ fit: true });
  }, [mapReady, applyMarkerLayer]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const maps = window.kakao?.maps;
    if (!mapReady || !map || !maps) return;

    if (zoomListenerRef.current) {
      maps.event.removeListener(map, 'zoom_changed', zoomListenerRef.current);
      zoomListenerRef.current = null;
    }

    if (!clusterEnabled) return;

    const onZoomChanged = () => {
      applyMarkerLayer({ fit: false });
    };

    zoomListenerRef.current = onZoomChanged;
    maps.event.addListener(map, 'zoom_changed', onZoomChanged);

    return () => {
      if (zoomListenerRef.current) {
        maps.event.removeListener(map, 'zoom_changed', zoomListenerRef.current);
        zoomListenerRef.current = null;
      }
    };
  }, [mapReady, clusterEnabled, applyMarkerLayer]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || mapResetKey === 0) return;
    const map = mapInstanceRef.current;
    const maps = window.kakao?.maps;
    if (maps) {
      resetMapView(map, maps);
      applyMarkerLayer({ fit: false });
    }
  }, [mapResetKey, mapReady, applyMarkerLayer]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !mapRef.current) return;

    const map = mapInstanceRef.current;
    const relayout = () => map.relayout();

    relayout();
    const t1 = setTimeout(relayout, 150);
    const t2 = setTimeout(relayout, 500);

    const observer = new ResizeObserver(relayout);
    observer.observe(mapRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, [mapReady]);

  const handleCloseInfo = () => {
    setSelectedWifi(null);
    onInfoCardClose?.();
  };

  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) map.setLevel(map.getLevel() - 1);
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) map.setLevel(map.getLevel() + 1);
  };

  const handleToggleMapType = () => {
    const map = mapInstanceRef.current;
    const maps = window.kakao?.maps;
    if (!map || !maps) return;

    const nextIndex = (mapTypeIndex + 1) % MAP_TYPES.length;
    setMapTypeIndex(nextIndex);
    map.setMapTypeId(maps.MapTypeId[MAP_TYPES[nextIndex]]);
  };

  const handleLocate = () => {
    const map = mapInstanceRef.current;
    const maps = window.kakao?.maps;
    if (!map || !maps || !navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = new maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.setCenter(loc);
        map.setLevel(3);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div
      className={`relative flex-1 overflow-hidden md:min-h-0 ${
        isMobileLayout ? 'min-h-0 rounded-none' : 'min-h-[400px] rounded-2xl md:rounded-none'
      }`}
    >
      <div
        id="map-container"
        ref={mapRef}
        className="absolute inset-0 h-full w-full md:rounded-none"
      />

      {mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
          <div className="glass-card mx-4 max-w-md rounded-2xl p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h3 className="mb-2 text-lg font-bold text-slate-800">지도를 불러올 수 없습니다</h3>
            <p className="mb-4 text-sm text-slate-500">{mapError}</p>
            <p className="text-xs text-slate-400">
              developers.kakao.com에서 JavaScript 키를 발급받아
              <br />
              <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> 파일에 설정하세요.
            </p>
          </div>
        </div>
      )}

      {!mapError && (
        <>
          <CarrierLegend
            visibleCarriers={visibleCarriers}
            onToggle={onToggleCarrier}
            clusterEnabled={clusterEnabled}
            onClusterToggle={onClusterToggle}
          />

          <FloatingButtons
            onLocate={handleLocate}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleMapType={handleToggleMapType}
            isMobileLayout={isMobileLayout}
          />

          {locating && (
            <div className="absolute right-3 top-14 z-20 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-primary shadow-lg md:right-4 md:top-20">
              위치 확인 중...
            </div>
          )}

          <StatusBar stats={stats} isMobileLayout={isMobileLayout} />

          {selectedWifi && (
            <WifiInfoCard wifi={selectedWifi} onClose={handleCloseInfo} />
          )}
        </>
      )}
    </div>
  );
}
