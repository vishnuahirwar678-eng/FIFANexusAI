import { useEffect, useRef, useState } from 'react';
import {
  Hand, Send, Mic, MapPin, Clock, CheckCircle2, AlertTriangle, Users,
  Languages, ClipboardList, Brain, Sparkles, User,
  TrendingUp, Award, Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button, Badge } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { generateVolunteerTasks } from '../../lib/mock-data';
import { generateVolunteerResponse, QUICK_PROMPTS, detectPromptInjection } from '../../lib/ai-agents';
import { useAuth } from '../../context/useAuth';
import { cn, uid, timeAgo, statusColor } from '../../lib/utils';
import type { ChatMessage, VolunteerTask } from '../../types';

export function VolunteerCopilot() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<VolunteerTask[]>(() => generateVolunteerTasks());
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid('msg'),
      role: 'assistant',
      content: `Hello ${user?.name ?? 'Volunteer'}! I'm your Volunteer Copilot. I can help with task instructions, translation, incident reporting, and shift summaries. What do you need?`,
      timestamp: new Date().toISOString(),
      language: 'en',
      agent: 'volunteer',
      confidence: 0.98,
    },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTask(tasks.find((t) => t.status === 'in-progress' || t.status === 'assigned') ?? tasks[0] ?? null);
  }, [tasks]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    if (detectPromptInjection(text)) {
      setMessages((m) => [
        ...m,
        { id: uid('msg'), role: 'user', content: text, timestamp: new Date().toISOString(), language: 'en' },
        {
          id: uid('msg'),
          role: 'assistant',
          content: 'Safety guardrail: this request was flagged and logged. I only process task-related queries.',
          timestamp: new Date().toISOString(),
          language: 'en',
          agent: 'volunteer',
          confidence: 1.0,
        },
      ]);
      setInput('');
      return;
    }
    setMessages((m) => [...m, { id: uid('msg'), role: 'user', content: text, timestamp: new Date().toISOString(), language: 'en' }]);
    setInput('');
    setTimeout(() => {
      const r = generateVolunteerResponse(text);
      setMessages((m) => [...m, r]);
    }, 600);
  };

  const completeTask = (id: string) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)));
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    overdue: tasks.filter((t) => t.status === 'overdue').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Hand className="w-7 h-7 text-nexus-400" /> AI Volunteer Copilot
          </h1>
          <p className="text-sm text-ink-400 mt-1">Dynamic task assignment · Real-time instructions · Multilingual</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-pitch-400 animate-pulse" /> On shift</Badge>
          <Badge variant="info">{user?.name ?? 'Volunteer'}</Badge>
          <Badge variant="pitch"><Clock size={10} /> 4h 12m logged</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tasks Today', value: stats.total, icon: ClipboardList, color: '#1f6fff' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: '#00e890' },
          { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle, color: '#ff8c00' },
          { label: 'Fans Assisted', value: 87, icon: Users, color: '#a855f7' },
        ].map((s) => (
          <Card key={s.label} hover>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-ink-50 tabular-nums">{s.value}</p>
                <p className="text-xs text-ink-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-nexus-400" /> Task Queue
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border transition-all',
                    selectedTask?.id === t.id
                      ? 'bg-nexus-500/10 border-nexus-500/40'
                      : 'bg-ink-900/40 border-ink-700/50 hover:border-ink-600',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: `${statusColor(t.priority)}20`, color: statusColor(t.priority) }}
                    >
                      {t.priority}
                    </span>
                    <span
                      className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: `${statusColor(t.status)}20`, color: statusColor(t.status) }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-ink-100 line-clamp-1">{t.title}</p>
                  <p className="text-xs text-ink-400 mt-1 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-ink-500">
                    <MapPin size={9} /> {t.zone}
                    <span>·</span>
                    <Clock size={9} /> {timeAgo(t.assignedAt)}
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Task detail + AI instructions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-pitch-400" /> Task Detail & AI Instructions
              </CardTitle>
              {selectedTask && (
                <Badge variant={selectedTask.status === 'overdue' ? 'danger' : 'warning'}>
                  Due: {new Date(selectedTask.dueAt).toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {selectedTask && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${statusColor(selectedTask.priority)}20`, color: statusColor(selectedTask.priority) }}
                    >
                      {selectedTask.priority} priority
                    </span>
                    <Badge variant="info">{selectedTask.status}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink-50">{selectedTask.title}</h3>
                  <p className="text-sm text-ink-300 mt-1">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-ink-900/40">
                    <p className="text-xs text-ink-500 flex items-center gap-1"><MapPin size={10} /> Zone</p>
                    <p className="text-sm text-ink-100 font-medium">{selectedTask.zone}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-900/40">
                    <p className="text-xs text-ink-500 flex items-center gap-1"><User size={10} /> Assigned to</p>
                    <p className="text-sm text-ink-100 font-medium">{selectedTask.volunteerName}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-900/40">
                    <p className="text-xs text-ink-500 flex items-center gap-1"><Clock size={10} /> Assigned</p>
                    <p className="text-sm text-ink-100 font-medium">{timeAgo(selectedTask.assignedAt)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-pitch-500/10 border border-pitch-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-pitch-400" />
                    <p className="text-sm font-semibold text-pitch-300">AI-Generated Instructions</p>
                    <Badge variant="pitch">step-by-step</Badge>
                  </div>
                  <ol className="space-y-2">
                    {selectedTask.aiInstructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-pitch-500/20 text-pitch-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-ink-200 pt-0.5">{inst}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => completeTask(selectedTask.id)} disabled={selectedTask.status === 'completed'}>
                    <CheckCircle2 size={14} /> {selectedTask.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                  <Button variant="outline">
                    <Languages size={14} /> Translate Instructions
                  </Button>
                  <Button variant="ghost">
                    <AlertTriangle size={14} /> Report Issue
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Chat + shift summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col" style={{ minHeight: 480 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-500 to-pitch-500 flex items-center justify-center">
                <Hand className="w-4 h-4 text-white" />
              </div>
              Volunteer Copilot Chat
            </CardTitle>
          </CardHeader>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex gap-3 animate-slide-in', m.role === 'user' ? 'flex-row-reverse' : '')}>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', m.role === 'user' ? 'bg-ink-700 text-ink-200' : 'bg-gradient-to-br from-nexus-500 to-pitch-500 text-white')}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Hand className="w-3.5 h-3.5" />}
                </div>
                <div className={cn('max-w-[80%]', m.role === 'user' ? 'text-right' : '')}>
                  <div className={cn('inline-block p-2.5 rounded-2xl text-sm', m.role === 'user' ? 'bg-nexus-500/15 border border-nexus-500/30 text-ink-100 rounded-tr-sm' : 'bg-ink-900/60 border border-ink-700/50 text-ink-100 rounded-tl-sm')}>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                  <p className="text-[10px] text-ink-500 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS['volunteer'].map((p) => (
              <button key={p} onClick={() => send(p)} className="text-xs px-2.5 py-1 rounded-lg bg-ink-800/60 border border-ink-700 text-ink-300 hover:border-nexus-500/40 hover:text-ink-100 transition-colors">
                {p}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-ink-700/50">
            <div className="flex items-center gap-2">
              <button onClick={() => setListening(!listening)} className={cn('p-2.5 rounded-xl', listening ? 'bg-alert-500/20 text-alert-300 animate-pulse' : 'bg-ink-800 text-ink-300 hover:text-ink-100')} aria-label="Voice input">
                <Mic className="w-4 h-4" />
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)} placeholder="Ask for help..." className="flex-1 px-4 py-2.5 bg-ink-900/60 border border-ink-700 rounded-xl text-sm text-ink-50 placeholder-ink-500 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none" />
              <Button onClick={() => send(input)} disabled={!input.trim()}>
                <Send size={14} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Shift summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-4 h-4 text-flame-400" /> Shift Summary
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-900/40">
                <Calendar className="w-5 h-5 text-nexus-400" />
                <div>
                  <p className="text-xs text-ink-500">Shift</p>
                  <p className="text-sm font-medium text-ink-100">4:00 PM – 11:00 PM</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="font-display text-2xl font-bold text-pitch-400">14</p>
                  <p className="text-xs text-ink-400">Tasks done</p>
                </div>
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="font-display text-2xl font-bold text-nexus-400">87</p>
                  <p className="text-xs text-ink-400">Fans helped</p>
                </div>
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="font-display text-2xl font-bold text-flame-400">3</p>
                  <p className="text-xs text-ink-400">Languages</p>
                </div>
                <div className="p-3 rounded-lg bg-ink-900/40 text-center">
                  <p className="font-display text-2xl font-bold text-pitch-400">98%</p>
                  <p className="text-xs text-ink-400">Positive</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-2">Performance</p>
                <Progress value={94} color="#00e890" showLabel />
              </div>
              <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/30">
                <p className="text-xs font-semibold text-pitch-300 mb-1">AI Feedback</p>
                <p className="text-xs text-ink-200">Excellent work today! You reduced Gate A queue by 22% and assisted 3 accessibility needs. Your next shift is tomorrow 3:00 PM.</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp size={12} /> View full report
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
