export const CARRIER_COLORS = {
  KT: {
    bg: '#2563EB',
    light: '#DBEAFE',
    text: '#1D4ED8',
    label: 'KT',
    fullName: 'KT(케이티)',
  },
  SKT: {
    bg: '#F97316',
    light: '#FFEDD5',
    text: '#C2410C',
    label: 'SKT',
    fullName: 'SKT(에스케이텔레콤)',
  },
  SKB: {
    bg: '#8B5CF6',
    light: '#EDE9FE',
    text: '#6D28D9',
    label: 'SKB',
    fullName: 'SKB(에스케이브로드밴드)',
  },
  'LGU+': {
    bg: '#EC4899',
    light: '#FCE7F3',
    text: '#BE185D',
    label: 'LGU+',
    fullName: 'LGU+(엘지유플러스)',
  },
  복합: {
    bg: '#6366F1',
    light: '#E0E7FF',
    text: '#4338CA',
    label: '복합',
    fullName: '복합 통신사',
  },
  기타: {
    bg: '#64748B',
    light: '#F1F5F9',
    text: '#475569',
    label: '기타',
    fullName: '기타',
  },
};

export const CARRIERS = ['KT', 'SKT', 'SKB', 'LGU+', '복합'];

export const CHANGWON_CENTER = {
  lat: 35.228545,
  lng: 128.681104,
};

export function getCarrierStyle(carrier) {
  return CARRIER_COLORS[carrier] ?? CARRIER_COLORS.기타;
}

export function getCarrierCategory(wifi) {
  return wifi.통신사분류 ?? wifi.통신사;
}

export function getMarkerBackground(carrier) {
  if (carrier === '복합') {
    return 'conic-gradient(from 0deg, #2563EB, #F97316, #8B5CF6, #EC4899, #6366F1, #2563EB)';
  }
  return CARRIER_COLORS[carrier]?.bg ?? CARRIER_COLORS.기타.bg;
}
