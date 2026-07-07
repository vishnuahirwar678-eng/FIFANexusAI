import { useEffect, useRef, useState } from 'react';
import {
  Heart, Send, Mic, Globe, Volume2, MapPin, Navigation, UtensilsCrossed,
  Stethoscope, Bus, Accessibility, Sparkles, Shield, User,
  Languages, AudioLines, ArrowRight, Star, Clock,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { LANGUAGES, TRANSLATIONS, ANNOUNCEMENTS } from '../../lib/mock-data';
import { generateFanResponse, QUICK_PROMPTS, detectPromptInjection } from '../../lib/ai-agents';
import { cn, uid } from '../../lib/utils';
import type { ChatMessage } from '../../types';

export function FanCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid('msg'),
      role: 'assistant',
      content: 'Welcome to FIFA World Cup 2026! I\'m your AI Fan Copilot. I can help you with navigation, food, transport, accessibility, and more — in 8 languages. How can I help you today?',
      timestamp: new Date().toISOString(),
      language: 'en',
      agent: 'fan-experience',
      confidence: 0.99,
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [injectionBlocked, setInjectionBlocked] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    if (detectPromptInjection(text)) {
      setInjectionBlocked((n) => n + 1);
      setMessages((m) => [
        ...m,
        {
          id: uid('msg'),
          role: 'user',
          content: text,
          timestamp: new Date().toISOString(),
          language,
        },
        {
          id: uid('msg'),
          role: 'assistant',
          content: 'For your safety, I can\'t process that request. I\'m here to help with stadium-related queries only — navigation, food, transport, accessibility, and match info.',
          timestamp: new Date().toISOString(),
          language,
          agent: 'fan-experience',
          confidence: 1.0,
        },
      ]);
      setInput('');
      return;
    }
    setMessages((m) => [
      ...m,
      { id: uid('msg'), role: 'user', content: text, timestamp: new Date().toISOString(), language },
    ]);
    setInput('');
    setTimeout(() => {
      const response = generateFanResponse(text, language);
      setMessages((m) => [...m, response]);
    }, 600);
  };

  const toggleVoice = () => {
    setListening(!listening);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        setInput('Where is the nearest restroom?');
      }, 2000);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Heart className="w-7 h-7 text-pitch-400" /> AI Fan Copilot
          </h1>
          <p className="text-sm text-ink-400 mt-1">Natural language · Voice · 8 languages · Personalized</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> Online</Badge>
          <Badge variant="info"><Globe size={10} /> {currentLang.nativeName}</Badge>
          {injectionBlocked > 0 && <Badge variant="danger"><Shield size={10} /> {injectionBlocked} blocked</Badge>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col" style={{ minHeight: 600 }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pitch-500 to-nexus-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                Fan Copilot Chat
              </CardTitle>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowLangPicker(!showLangPicker)}>
                  <Globe size={14} /> {currentLang.code.toUpperCase()}
                </Button>
                {showLangPicker && (
                  <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl border border-ink-700 p-1 z-50">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangPicker(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-ink-800 transition-colors',
                          language === l.code ? 'text-nexus-300 bg-ink-800/50' : 'text-ink-200',
                        )}
                      >
                        <span>{l.nativeName}</span>
                        <span className="text-xs text-ink-500">{l.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn('flex gap-3 animate-slide-in', m.role === 'user' ? 'flex-row-reverse' : '')}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    m.role === 'user'
                      ? 'bg-ink-700 text-ink-200'
                      : 'bg-gradient-to-br from-pitch-500 to-nexus-500 text-white',
                  )}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                </div>
                <div className={cn('max-w-[80%]', m.role === 'user' ? 'text-right' : '')}>
                  <div
                    className={cn(
                      'inline-block p-3 rounded-2xl text-sm',
                      m.role === 'user'
                        ? 'bg-nexus-500/15 border border-nexus-500/30 text-ink-100 rounded-tr-sm'
                        : 'bg-ink-900/60 border border-ink-700/50 text-ink-100 rounded-tl-sm',
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    {m.translated && (
                      <div className="mt-2 pt-2 border-t border-ink-700/50 text-xs text-ink-300">
                        <p className="flex items-center gap-1 text-pitch-400 mb-1">
                          <Languages size={10} /> {currentLang.nativeName}:
                        </p>
                        <p>{m.translated}</p>
                      </div>
                    )}
                  </div>
                  <div className={cn('flex items-center gap-2 mt-1 text-[10px] text-ink-500', m.role === 'user' ? 'justify-end' : '')}>
                    <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                    {m.confidence && <span>· {(m.confidence * 100).toFixed(1)}% confidence</span>}
                    {m.role === 'assistant' && (
                      <button onClick={() => speak(m.content)} className="hover:text-nexus-300" aria-label="Speak">
                        <Volume2 size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS['fan-experience'].map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-300 hover:border-pitch-500/40 hover:text-ink-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-ink-700/50">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder={listening ? 'Listening...' : 'Ask me anything about the stadium...'}
                aria-label="Message input"
                className="flex-1 px-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-sm text-ink-50 placeholder-ink-500 focus:border-pitch-500 focus:ring-1 focus:ring-pitch-500 outline-none"
              />
              <Button onClick={() => send(input)} disabled={!input.trim()} size="md">
                <Send size={14} />
              </Button>
            </div>
            {listening && (
              <div className="mt-2 flex items-center gap-2 text-xs text-alert-300">
                <AudioLines className="w-3 h-3 animate-pulse" />
                Listening in {currentLang.nativeName}...
              </div>
            )}
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Quick services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pitch-400" /> Quick Services
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Navigation, label: 'Navigate to seat', color: '#1f6fff' },
                  { icon: UtensilsCrossed, label: 'Find food', color: '#ff8c00' },
                  { icon: Stethoscope, label: 'Medical help', color: '#e61e1e' },
                  { icon: Bus, label: 'Transport', color: '#a855f7' },
                  { icon: Accessibility, label: 'Accessibility', color: '#00e890' },
                  { icon: MapPin, label: 'Restrooms', color: '#4d8fff' },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50 hover:border-pitch-500/40 transition-all text-left group"
                  >
                    <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                    <p className="text-xs font-medium text-ink-200">{s.label}</p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Multilingual demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-nexus-400" /> Multilingual Demo
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-xs text-ink-400 mb-3">"Where is the nearest restroom?" in 8 languages:</p>
              <div className="space-y-2">
                {LANGUAGES.map((l) => (
                  <div key={l.code} className="flex items-center justify-between p-2 rounded-lg bg-ink-900/40 hover:bg-ink-800/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs text-ink-500">{l.nativeName}</p>
                      <p className="text-sm text-ink-100 truncate">{TRANSLATIONS.where_restroom[l.code]}</p>
                    </div>
                    <button
                      onClick={() => speak(TRANSLATIONS.where_restroom[l.code])}
                      className="p-1.5 rounded-lg hover:bg-ink-700 text-ink-400 hover:text-nexus-300 shrink-0"
                      aria-label={`Speak in ${l.name}`}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* AI announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-flame-400" /> AI Announcements
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-ink-900/40 border border-ink-700/50">
                    <p className="text-xs text-ink-200">{a.en}</p>
                    <p className="text-xs text-ink-400 mt-1 italic">{a.es}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => speak(a.en)}
                        className="text-[10px] flex items-center gap-1 text-nexus-400 hover:text-nexus-300"
                      >
                        <Volume2 size={10} /> EN
                      </button>
                      <button
                        onClick={() => speak(a.es)}
                        className="text-[10px] flex items-center gap-1 text-nexus-400 hover:text-nexus-300"
                      >
                        <Volume2 size={10} /> ES
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Personalized journey */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-4 h-4 text-flame-400" /> Your Journey
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[
                  { time: '17:30', label: 'Arrived at Gate A', done: true },
                  { time: '17:45', label: 'Found seat: Section 222, Row J', done: true },
                  { time: '18:20', label: 'Bought snacks at Food Court North', done: true },
                  { time: '20:00', label: 'Match kickoff', done: false, current: true },
                  { time: '21:45', label: 'Planned exit via Gate B → Metro Line 7', done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full border-2',
                          s.done ? 'bg-pitch-500 border-pitch-500' : s.current ? 'border-nexus-500 animate-pulse' : 'border-ink-600',
                        )}
                      />
                      {i < 4 && <div className="w-px h-6 bg-ink-700 mt-1" />}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <div className="flex items-center gap-2">
                        <Clock size={10} className="text-ink-500" />
                        <span className="text-xs text-ink-500">{s.time}</span>
                      </div>
                      <p className={cn('text-sm', s.done ? 'text-ink-300' : s.current ? 'text-nexus-300 font-medium' : 'text-ink-400')}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Optimize journey <ArrowRight size={12} />
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
