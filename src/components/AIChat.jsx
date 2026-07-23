import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Loader2, MapPin } from 'lucide-react';
import {
  sendAssistantMessage,
  getUserLocation,
  SUGGESTED_QUESTIONS,
  messageNeedsLocation,
} from '../services/assistantService';

export default function AIChat({
  onApplyActions,
  expanded = false,
  disableEnterAnimation = false,
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const runAssistant = async (text) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    setError(null);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      let location = null;
      if (messageNeedsLocation(message)) {
        location = await getUserLocation();
      }

      const result = await sendAssistantMessage(message, location);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.reply,
          meta: {
            resultCount: result.resultCount,
            needsLocation: result.needsLocation,
            poweredBy: result.poweredBy,
          },
        },
      ]);

      if (result.actions && onApplyActions) {
        onApplyActions(result.actions);
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const maxChatHeight = expanded ? 'max-h-80' : 'max-h-40';

  return (
    <motion.div
      initial={disableEnterAnimation ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: disableEnterAnimation ? 0 : 0.45, delay: disableEnterAnimation ? 0 : 0.3 }}
      className={`glass-card flex flex-col rounded-2xl p-5 ${expanded ? 'min-h-[420px]' : ''}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-800">AI Wi-Fi Assistant</h2>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">
            BETA
          </span>
        </div>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        자연어로 질문하면 AI가 검색·필터·지도 표시까지 도와드려요.
      </p>

      <div className="mb-3 flex flex-col gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <motion.button
            key={question}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={loading}
            onClick={() => runAssistant(question)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 text-left text-xs text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            {question}
          </motion.button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className={`mb-3 space-y-2 overflow-y-auto ${maxChatHeight} ${messages.length ? 'min-h-[4rem]' : ''}`}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.role}-${i}-${msg.content.slice(0, 12)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl px-3 py-2 text-xs whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'ml-4 bg-primary/10 text-primary'
                  : msg.isError
                    ? 'mr-4 bg-red-50 text-red-600'
                    : 'mr-4 bg-slate-100 text-slate-600'
              }`}
            >
              {msg.content}
              {msg.meta?.resultCount != null && msg.role === 'assistant' && !msg.isError && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="h-3 w-3" />
                  지도에 {msg.meta.resultCount}개 결과 반영됨
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            분석 중…
          </div>
        )}
      </div>

      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runAssistant();
        }}
        className="mt-auto flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="궁금한 내용을 입력하세요..."
          className="flex-1 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </motion.button>
      </form>
    </motion.div>
  );
}
