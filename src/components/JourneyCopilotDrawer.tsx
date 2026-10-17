import React, { useState, useRef, useEffect } from 'react';
import { Journey, CopilotMessage } from '../types/journey';
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  Bot,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Lightbulb,
} from 'lucide-react';

interface JourneyCopilotDrawerProps {
  activeJourney: Journey;
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
}

export const JourneyCopilotDrawer: React.FC<JourneyCopilotDrawerProps> = ({
  activeJourney,
  isOpen,
  onToggle,
  isDark = true,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I'm **Journey Copilot**, your strategic AI advisor. I have analyzed **"${activeJourney.title}"** across ${activeJourney.stages.length} stages.\n\nAsk me how to eliminate friction, prioritize KPIs, optimize onboarding, or benchmark customer sentiment against competitors.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How can we reduce drop-off in our lowest sentiment stage?',
        'What 3 high-impact retention experiments should we run?',
        'Suggest 2 new touchpoints to improve onboarding joy',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeJourney,
          history: messages.slice(-6),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from Journey Copilot.');
      }

      const data = await res.json();
      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I ran into an issue connecting with Gemini. Please try again or rephrase your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full animated-gradient-active text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 font-bold group border border-white/25 neon-glow-violet"
      >
        <Sparkles className="w-5 h-5 animate-spin-slow group-hover:rotate-12 transition-transform text-cyan-200" />
        <span className="text-xs font-semibold pr-1">Journey Copilot</span>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping"></span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-full max-w-[420px] h-[580px] rounded-3xl glass-panel border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 ${
        isDark
          ? 'border-white/[0.12] text-white shadow-black/80'
          : 'bg-white/95 border-purple-300 text-slate-900 shadow-purple-900/20'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 bg-[#050816]/90 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-cyan-300 border border-purple-500/40 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white">Journey Copilot</h4>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Context-Aware
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
              Active: {activeJourney.productName} ({activeJourney.industry})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl relative group ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {/* Copy action for assistant responses */}
              {m.sender === 'assistant' && (
                <button
                  type="button"
                  onClick={() => handleCopyText(m.text, m.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                  title="Copy response"
                >
                  {copiedId === m.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              <div className="leading-relaxed whitespace-pre-line space-y-1">
                {m.text}
              </div>

              <div
                className={`text-[9px] mt-1.5 ${
                  m.sender === 'user' ? 'text-purple-200 text-right' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {/* Suggested actions chips */}
            {m.suggestedActions && m.suggestedActions.length > 0 && (
              <div className="mt-2 space-y-1 w-full max-w-[90%]">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-cyan-400" /> Suggested follow-ups:
                </span>
                <div className="flex flex-col gap-1">
                  {m.suggestedActions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="text-left text-[11px] p-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-800/40 text-purple-200 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span className="text-[11px]">Thinking & auditing journey...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3.5 bg-[#050816]/95 border-t border-white/[0.08] backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about friction, retention, or KPIs..."
            className="flex-1 px-3.5 py-2.5 rounded-xl glass-card-subtle border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl animated-gradient-active hover:brightness-110 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-600/30 border border-white/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <span className="text-[9px] text-slate-400 block text-center mt-1.5 font-mono">
          Gemini 3.8 Flash • Real-time CX strategic copilot
        </span>
      </div>
    </div>
  );
};
