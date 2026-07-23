import { motion } from 'framer-motion';
import { Wifi, Map, Database, Shield, ExternalLink } from 'lucide-react';
import Header from '../components/Header';

const sections = [
  {
    icon: Wifi,
    title: '서비스 소개',
    content:
      '창원 공공 Wi-Fi Map은 창원시 공공 Wi-Fi 공공데이터를 활용하여 시민들이 주변 무료 공공 Wi-Fi를 쉽고 빠르게 찾을 수 있는 지도 기반 웹서비스입니다.',
  },
  {
    icon: Database,
    title: '데이터 출처',
    content:
      '본 서비스는 창원시에서 제공하는 공공 Wi-Fi AP 설치 현황 공공데이터를 기반으로 제작되었습니다. 데이터에는 AP 설치장소명, 주소, 좌표, 설치년월, 통신사, AP 대수 정보가 포함됩니다.',
  },
  {
    icon: Map,
    title: '주요 기능',
    items: [
      '지도 기반 Wi-Fi AP 위치 확인 (832개소 실시간 연동)',
      '장소명·주소 검색 및 통신사/설치년도 필터',
      'KT / SKT / SKB / LGU+ / 복합 통신사별 색상 마커',
      'AP 상세 정보 및 길찾기 연동',
      'AI Wi-Fi Assistant — 자연어 검색·필터·지도 연동',
    ],
  },
  {
    icon: Shield,
    title: '이용 안내',
    content:
      '공공 Wi-Fi는 무료로 이용 가능하나, 일부 장소에서는 접속 시 본인 인증이 필요할 수 있습니다. 실제 AP 설치 현황은 공공데이터 기준이며, 현장 상황과 다를 수 있습니다.',
  },
];

export default function ServiceGuide() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <Header />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="mx-auto w-full max-w-3xl p-4 pb-8 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-800">서비스 안내</h2>
          <p className="mt-1 text-sm text-slate-500">
            창원 공공 Wi-Fi Map 이용 가이드
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
              </div>

              {section.content && (
                <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
              )}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            href="https://www.changwon.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            창원시 공식 홈페이지
            <ExternalLink className="h-4 w-4" />
          </motion.a>
        </div>
        </div>
      </main>
    </div>
  );
}
