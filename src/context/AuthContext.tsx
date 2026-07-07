import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'commander@fifanexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'u_001',
      email: 'commander@fifanexus.ai',
      name: 'Commander Chen',
      role: 'commander',
      avatar: 'CC',
      zone: 'Command Center',
      shift: 'Full Event',
    },
  },
  'ops@fifanexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'u_002',
      email: 'ops@fifanexus.ai',
      name: 'Ops Lead Rivera',
      role: 'operations',
      avatar: 'OR',
      zone: 'Operations Center',
      shift: 'Match Day',
    },
  },
  'security@fifanexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'u_003',
      email: 'security@fifanexus.ai',
      name: 'Security Chief Volkov',
      role: 'security',
      avatar: 'SV',
      zone: 'Security Hub',
      shift: 'Match Day',
    },
  },
  'volunteer@fifanexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'u_004',
      email: 'volunteer@fifanexus.ai',
      name: 'Maria Santos',
      role: 'volunteer',
      avatar: 'MS',
      zone: 'Gate A — North',
      shift: '4:00 PM – 11:00 PM',
    },
  },
  'fan@fifanexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'u_005',
      email: 'fan@fifanexus.ai',
      name: 'Alex Johnson',
      role: 'fan',
      avatar: 'AJ',
      zone: 'Section 222',
      shift: 'Spectator',
    },
  },
};

const STORAGE_KEY = 'nexus_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const demo = DEMO_USERS[email.toLowerCase()];
          if (demo && demo.password === password) {
            setUser(demo.user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demo.user));
            return { error: null };
          }
          return { error: error.message };
        }
        if (data.user) {
          const role: UserRole = email.includes('commander') ? 'commander'
            : email.includes('security') ? 'security'
            : email.includes('volunteer') ? 'volunteer'
            : email.includes('fan') ? 'fan'
            : 'operations';
          const u: User = {
            id: data.user.id,
            email: data.user.email ?? email,
            name: data.user.email?.split('@')[0] ?? 'User',
            role,
            avatar: (data.user.email?.slice(0, 2) ?? 'U').toUpperCase(),
          };
          setUser(u);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        }
        return { error: null };
      }
      const demo = DEMO_USERS[email.toLowerCase()];
      if (!demo || demo.password !== password) {
        return { error: 'Invalid credentials. Try commander@fifanexus.ai / nexus2026' };
      }
      setUser(demo.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo.user));
      return { error: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut, hasRole }),
    [user, loading, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
