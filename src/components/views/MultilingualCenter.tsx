import { useCallback, useMemo, useState } from 'react';
import {
  Globe, Volume2, Mic, Languages, Radio, Sparkles, Brain,
  Play, Pause, ArrowRight, Users, MessageSquare, Zap,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { EmptyState } from '../ui/StateViews';
import { LANGUAGES, generateTranslationEntries, ANNOUNCEMENTS } from '../../lib/mock-data';
import { cn, formatNumber } from '../../lib/utils';
import type { TranslationEntry } from '../../types';

const CATEGORY_META = {
  announcement: { label: 'Announcement', color: '#4d8fff', icon: Radio },
  instruction: { label: 'Instruction', color: '#ff8c00', icon: Zap },
  emergency: { label: 'Emergency', color: '#e61e1e', icon: AlertTriangleIcon },
  wayfinding: { label: 'Wayfinding', color: '#00e890', icon: ArrowRight },
  general: { label: 'General', color: '#6b7a93', icon: MessageSquare },
} as const;

function AlertTriangleIcon(props: { className?: string }) {
  return <AlertTriangle {...props} />;
}

import { AlertTriangle } from 'lucide-react';

const KPI_ITEMS = [
  { label: 'Languages Supported', value: '8', icon: Globe, color: '#4d8fff' },
  { label: 'Translations Today', value: '78K+', icon: Languages, color: '#00e890' },
  { label: 'Voice Translations', value: '12K', icon: Volume2, color: '#ff8c00' },
  { label: 'Avg Response Time', value: '124ms', icon: Zap, color: '#a855f7' },
] as const;

const LANGUAGE_COVERAGE = [
  { lang: 'English', code: 'en', speakers: 38000, pct: 48 },
  { lang: 'Spanish', code: 'es', speakers: 18000, pct: 23 },
  { lang: 'French', code: 'fr', speakers: 8000, pct: 10 },
  { lang: 'Arabic', code: 'ar', speakers: 5000, pct: 6 },
  { lang: 'Portuguese', code: 'pt', speakers: 4000, pct: 5 },
  { lang: 'Hindi', code: 'hi', speakers: 2400, pct: 3 },
  { lang: 'German', code: 'de', speakers: 1800, pct: 2 },
  { lang: 'Japanese', code: 'ja', speakers: 1200, pct: 1.5 },
] as const;

/** Multilingual AI Center: 8-language translation, voice synthesis, live announcements, and AI-powered translation. */
export function MultilingualCenter() {
  const [entries] = useState<TranslationEntry[]>(() => generateTranslationEntries());
  const [selectedEntry, setSelectedEntry] = useState<TranslationEntry | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [playing, setPlaying] = useState(false);

  const handleEntrySelect = useCallback((entry: TranslationEntry) => {
    setSelectedEntry(entry);
    setSelectedLang('en');
  }, []);

  const handleSpeak = useCallback((text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
      utterance.onend = () => setPlaying(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, []);

  const totalUsage = useMemo(() => entries.reduce((sum, e) => sum + e.usageCount, 0), [entries]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Globe className="w-7 h-7 text-nexus-400" aria-hidden="true" /> Multilingual AI Center
          </h1>
          <p className="text-sm text-ink-400 mt-1">8-language AI translation · Voice synthesis · Live announcements · Real-time interpretation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" aria-hidden="true" /> Live</Badge>
          <Badge variant="info"><Brain size={10} aria-hidden="true" /> AI-powered</Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPI_ITEMS.map((k) => (
          <Card key={k.label} hover>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15`, color: k.color }} aria-hidden="true">
                  <k.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-ink-50">{k.value}</p>
              <p className="text-xs text-ink-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Language Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-pitch-400" aria-hidden="true" /> Language Coverage — 8 Languages
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LANGUAGES.map((l) => {
              const coverage = LANGUAGE_COVERAGE.find((c) => c.code === l.code);
              return (
                <div key={l.code} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ink-100">{l.nativeName}</span>
                    <span className="text-[10px] text-ink-500 uppercase">{l.code}</span>
                  </div>
                  <p className="text-xs text-ink-400">{l.name}</p>
                  {coverage && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-ink-500 mb-0.5">
                        <span className="flex items-center gap-1"><Users size={8} aria-hidden="true" /> {formatNumber(coverage.speakers)}</span>
                        <span>{coverage.pct}%</span>
                      </div>
                      <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
                        <div className="h-full bg-nexus-500 rounded-full transition-all duration-500" style={{ width: `${coverage.pct * 2}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-nexus-500/10 border border-nexus-500/30">
            <p className="text-xs font-semibold text-nexus-300 mb-1 flex items-center gap-1">
              <Sparkles size={10} aria-hidden="true" /> AI Translation Engine
            </p>
            <p className="text-xs text-ink-200">
              NLP-powered translation covering 92% of expected international visitors. Voice synthesis available in all 8 languages.
              Average translation latency: 124ms. {formatNumber(totalUsage)} translations served today.
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Translation Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-nexus-400" aria-hidden="true" /> Translation Library
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {entries.length === 0 ? (
                <EmptyState message="No translations available" />
              ) : (
                entries.map((e) => {
                  const meta = CATEGORY_META[e.category];
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleEntrySelect(e)}
                      aria-pressed={selectedEntry?.id === e.id}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border transition-all',
                        selectedEntry?.id === e.id ? 'bg-nexus-500/10 border-nexus-500/40' : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: `${meta.color}20`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[10px] text-ink-500">{formatNumber(e.usageCount)} uses</span>
                      </div>
                      <p className="text-sm text-ink-100 line-clamp-2">{e.sourceText}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {e.voiceAvailable && <Badge variant="info"><Volume2 size={8} aria-hidden="true" /> Voice</Badge>}
                        <span className="text-[10px] text-ink-500">{Object.keys(e.translations).length} languages</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardBody>
        </Card>

        {/* Translation Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-flame-400" aria-hidden="true" /> Translation & Voice Playback
            </CardTitle>
          </CardHeader>
          <CardBody>
            {selectedEntry ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wider mb-1">Source (English)</p>
                  <p className="text-sm text-ink-100 p-3 rounded-lg bg-ink-900/40 border border-ink-700/50">{selectedEntry.sourceText}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-ink-400 uppercase tracking-wider">Translations</p>
                    <div className="flex gap-1">
                      {playing ? (
                        <Button size="sm" variant="danger" onClick={handleStop} aria-label="Stop voice playback">
                          <Pause size={12} aria-hidden="true" /> Stop
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {LANGUAGES.map((l) => {
                      const text = selectedEntry.translations[l.code];
                      if (!text) return null;
                      const isActive = selectedLang === l.code;
                      return (
                        <div
                          key={l.code}
                          className={cn(
                            'p-3 rounded-lg border transition-all cursor-pointer',
                            isActive ? 'bg-nexus-500/10 border-nexus-500/40' : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
                          )}
                          onClick={() => setSelectedLang(l.code)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-ink-100">{l.nativeName}</span>
                              <span className="text-[10px] text-ink-500 uppercase">{l.code}</span>
                            </div>
                            {selectedEntry.voiceAvailable && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSpeak(text, l.code); }}
                                className="p-1.5 rounded-lg hover:bg-ink-800 text-ink-400 hover:text-nexus-300 transition-colors"
                                aria-label={`Play ${l.nativeName} translation`}
                              >
                                <Volume2 size={12} aria-hidden="true" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-ink-200" dir={l.code === 'ar' ? 'rtl' : 'ltr'}>{text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                  <p className="text-xs font-semibold text-pitch-300 mb-1 flex items-center gap-1">
                    <Sparkles size={10} aria-hidden="true" /> AI Translation Quality
                  </p>
                  <p className="text-xs text-ink-200">
                    Translations generated by NLP engine with 94.2% BLEU score. Voice synthesis uses native pronunciation models.
                    All emergency translations are pre-validated by human translators. Latency: 124ms average.
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState message="Select a translation entry to view all 8 languages" />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Live Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-alert-400 animate-pulse" aria-hidden="true" /> Live Multilingual Announcements
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className="p-3 rounded-xl bg-ink-900/40 border border-ink-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={i === 0 ? 'success' : 'info'}>{i === 0 ? 'Active' : 'Scheduled'}</Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSpeak(a.en, 'en')}
                      aria-label="Play English announcement"
                    >
                      <Play size={10} aria-hidden="true" /> EN
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSpeak(a.es, 'es')}
                      aria-label="Play Spanish announcement"
                    >
                      <Play size={10} aria-hidden="true" /> ES
                    </Button>
                    {playing && (
                      <Button size="sm" variant="ghost" onClick={handleStop} aria-label="Stop playback">
                        <Pause size={10} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <p className="text-sm text-ink-100">{a.en}</p>
                  <p className="text-sm text-ink-200" dir="rtl">{a.es}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" size="sm">
              <Mic size={12} aria-hidden="true" /> Broadcast New Announcement
            </Button>
            <Button variant="outline" size="sm">
              <Languages size={12} aria-hidden="true" /> Translate Custom Message
            </Button>
            <Button variant="ghost" size="sm">
              <Globe size={12} aria-hidden="true" /> All Languages
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
