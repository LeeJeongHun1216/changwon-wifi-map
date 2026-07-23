import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Zap } from 'lucide-react';
import Header from '../components/Header';
import AIChat from '../components/AIChat';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: MessageSquare,
    title: '자연어 검색',
    desc: '복잡한 필터 없이 일상 언어로 Wi-Fi를 찾아보세요.',
  },
  {
    icon: Sparkles,
    title: '맞춤 추천',
    desc: '위치와 상황에 맞는 최적의 공공 Wi-Fi를 추천합니다.',
  },
  {
    icon: Zap,
    title: '빠른 응답',
    desc: 'AI가 즉시 답변하여 원하는 정보를 빠르게 제공합니다.',
  },
];

export default function AIAssistant() {
  const navigate = useNavigate();

  const handleApplyActions = (actions) => {
    if (!actions) return;

    const params = new URLSearchParams();
    if (actions.searchQuery || actions.syncQuery) {
      params.set('q', actions.syncQuery ?? actions.searchQuery);
    }
    if (actions.carrier && actions.carrier !== '전체') {
      params.set('carrier', actions.carrier);
    }
    if (actions.year && actions.year !== '전체') {
      params.set('year', actions.year);
    }

    const qs = params.toString();
    navigate(qs ? `/?${qs}` : '/');
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <Header />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="mx-auto w-full max-w-3xl p-4 pb-8 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-primary shadow-lg shadow-primary/25">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">AI Wi-Fi Assistant</h2>
          <p className="mt-2 text-sm text-slate-500">
            AI가 창원시 공공 Wi-Fi 정보를 똑똑하게 안내해드립니다
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="glass-card rounded-2xl p-5 text-center"
            >
              <f.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-1 text-sm font-bold text-slate-800">{f.title}</h3>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <AIChat onApplyActions={handleApplyActions} expanded />
        </div>
      </main>
    </div>
  );
}
