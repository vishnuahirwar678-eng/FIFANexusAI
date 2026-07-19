import { useCallback } from 'react';
import { Send, Mic, User, Volume2, Languages, AudioLines } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChatMessage } from '../../types';
import type { Language } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text: string) => void;
  listening: boolean;
  onToggleListening: () => void;
  quickPrompts: readonly string[];
  agentIcon: LucideIcon;
  accentClass: string;
  currentLang?: Language;
  onSpeak?: (text: string) => void;
  placeholder?: string;
  scrollRef: React.RefObject<HTMLDivElement>;
}

/** Reusable chat panel for AI copilot views. Eliminates duplicated chat UI. */
export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  listening,
  onToggleListening,
  quickPrompts,
  agentIcon: AgentIcon,
  accentClass,
  currentLang,
  onSpeak,
  placeholder = 'Ask me anything...',
  scrollRef,
}: ChatPanelProps) {
  return (
    <div className="flex flex-col" style={{ minHeight: 480 }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex gap-3 animate-slide-in', m.role === 'user' ? 'flex-row-reverse' : '')}>
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                m.role === 'user' ? 'bg-ink-700 text-ink-200' : accentClass,
              )}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <AgentIcon className="w-3.5 h-3.5" />}
            </div>
            <div className={cn('max-w-[80%]', m.role === 'user' ? 'text-right' : '')}>
              <div
                className={cn(
                  'inline-block p-2.5 rounded-2xl text-sm',
                  m.role === 'user'
                    ? 'bg-nexus-500/15 border border-nexus-500/30 text-ink-100 rounded-tr-sm'
                    : 'bg-ink-900/60 border border-ink-700/50 text-ink-100 rounded-tl-sm',
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                {m.translated && (
                  <div className="mt-2 pt-2 border-t border-ink-700/50 text-xs text-ink-300">
                    <p className="flex items-center gap-1 text-pitch-400 mb-1">
                      <Languages size={10} /> {currentLang?.nativeName}:
                    </p>
                    <p>{m.translated}</p>
                  </div>
                )}
              </div>
              <div className={cn('flex items-center gap-2 mt-1 text-[10px] text-ink-500', m.role === 'user' ? 'justify-end' : '')}>
                <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                {m.confidence && <span>· {(m.confidence * 100).toFixed(1)}% confidence</span>}
                {m.role === 'assistant' && onSpeak && (
                  <button onClick={() => onSpeak(m.content)} className="hover:text-nexus-300" aria-label="Speak response">
                    <Volume2 size={10} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {quickPrompts.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-300 hover:border-nexus-500/40 hover:text-ink-100 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-ink-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleListening}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              listening ? 'bg-alert-500/20 text-alert-300 animate-pulse' : 'bg-ink-800 text-ink-300 hover:text-ink-100',
            )}
            aria-label="Voice input"
            aria-pressed={listening}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend(input)}
            placeholder={listening ? 'Listening...' : placeholder}
            aria-label="Message input"
            className="flex-1 px-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-sm text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none"
          />
          <Button onClick={() => onSend(input)} disabled={!input.trim()}>
            <Send size={14} />
          </Button>
        </div>
        {listening && (
          <div className="mt-2 flex items-center gap-2 text-xs text-alert-300">
            <AudioLines className="w-3 h-3 animate-pulse" />
            Listening{currentLang ? ` in ${currentLang.nativeName}` : ''}...
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared speech synthesis hook. */
export function useSpeech() {
  return useCallback((text: string, lang = 'en') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, []);
}
