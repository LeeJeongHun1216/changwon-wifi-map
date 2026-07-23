import { getMarkerBackground } from './carrierColors';

export function loadKakaoMapScript(appKey) {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => resolve(window.kakao.maps));
      return;
    }

    const existing = document.getElementById('kakao-map-script');
    if (existing) {
      existing.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve(window.kakao.maps));
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=clusterer,services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao.maps));
    };
    script.onerror = () => reject(new Error('카카오맵 SDK를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });
}

export function createMarkerElement(carrierCategory, index = 0) {
  const background = getMarkerBackground(carrierCategory);
  const isComposite = carrierCategory === '복합';

  const el = document.createElement('div');
  el.className = 'wifi-marker';
  el.style.cssText = `
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${background};
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation-delay: ${Math.min(index * 0.02, 0.8)}s;
    ${isComposite ? 'box-shadow: 0 4px 14px rgba(99,102,241,0.45);' : ''}
  `;

  el.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  `;

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.15)';
    el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.28)';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.boxShadow = isComposite
      ? '0 4px 14px rgba(99,102,241,0.45)'
      : '0 4px 12px rgba(0,0,0,0.2)';
  });

  return el;
}

export function openKakaoDirections(lat, lng, placeName) {
  const url = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${lat},${lng}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
