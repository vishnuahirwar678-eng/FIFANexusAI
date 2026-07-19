import { useCallback, useEffect, useRef, useState } from 'react';
import type { AgentId, ChatMessage } from '../types';
import { generateAgentResponse, detectPromptInjection } from '../lib/ai-agents';
import { uid } from '../lib/utils';

interface UseChatOptions {
  agent: AgentId;
  greeting: string;
  language?: string;
  greetingConfidence?: number;
}

interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  listening: boolean;
  toggleListening: () => void;
  injectionBlocked: number;
  send: (text: string) => void;
  clear: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

/** Shared chat state and logic for AI copilot views. */
export function useChat({
  agent,
  greeting,
  language = 'en',
  greetingConfidence = 0.98,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid('msg'),
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
      language,
      agent,
      confidence: greetingConfidence,
    },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [injectionBlocked, setInjectionBlocked] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatMessage = {
        id: uid('msg'),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
        language,
      };
      setInput('');
      if (detectPromptInjection(trimmed)) {
        setInjectionBlocked((n) => n + 1);
        setMessages((m) => [
          ...m,
          userMsg,
          {
            id: uid('msg'),
            role: 'assistant',
            content:
              'For your safety, I can\'t process that request. I\'m here to help with stadium-related queries only.',
            timestamp: new Date().toISOString(),
            language,
            agent,
            confidence: 1.0,
          },
        ]);
        return;
      }
      setMessages((m) => [...m, userMsg]);
      window.setTimeout(() => {
        const response = generateAgentResponse(trimmed, agent, language);
        setMessages((m) => [...m, response]);
      }, 600);
    },
    [agent, language],
  );

  const toggleListening = useCallback(() => {
    setListening((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => {
          setListening(false);
          setInput('Where is the nearest restroom?');
        }, 2000);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMessages([
      {
        id: uid('msg'),
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toISOString(),
        language,
        agent,
        confidence: greetingConfidence,
      },
    ]);
    setInjectionBlocked(0);
  }, [agent, greeting, greetingConfidence, language]);

  return {
    messages,
    input,
    setInput,
    listening,
    toggleListening,
    injectionBlocked,
    send,
    clear,
    scrollRef,
  };
}
