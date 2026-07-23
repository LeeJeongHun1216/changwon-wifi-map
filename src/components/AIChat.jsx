import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  '창원역 근처 Wi-Fi 알려줘',
  'KT만 보여줘',
  '가장 가까운 Wi-Fi 찾아줘',
  'AP가 가장 많은 곳은?',
];

export default function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const message = text || input.trim();
    if (!message) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message },
      {
        role: 'assistant',
        content: 'AI Wi-Fi Assistant 기능은 곧 제공될 예정입니다. 현재는 UI 미리보기입니다.',
      },
    ]);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      className="glass-card flex flex-col rounded-2xl p-5"
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
        자연어로 질문하면 AI가 편리하게 답변해드려요!
      </p>

      <div className="mb-3 flex flex-col gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <motion.button
            key={question}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleSend(question)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 text-left text-xs text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            {question}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 max-h-32 space-y-2 overflow-y-auto"
          >
            {messages.slice(-4).map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={`rounded-xl px-3 py-2 text-xs ${
                  msg.role === 'user'
                    ? 'ml-4 bg-primary/10 text-primary'
                    : 'mr-4 bg-slate-100 text-slate-600'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-auto flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="궁금한 내용을 입력하세요..."
          className="flex-1 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25"
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </form>
    </motion.div>
  );
}
