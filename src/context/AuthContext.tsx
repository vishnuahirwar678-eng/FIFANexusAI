import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateEmail, validatePassword, logAuditEvent } from '../lib/security';

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

function parseStoredUser(raw: string): User | null {
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = parseStoredUser(stored);
    if (!parsed) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      logAuditEvent({ action: 'login', resource: 'auth', status: 'denied', details: 'invalid email' });
      return { error: emailCheck.error ?? 'Invalid email' };
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      logAuditEvent({ action: 'login', resource: 'auth', status: 'denied', details: 'invalid password' });
      return { error: passwordCheck.error ?? 'Invalid password' };
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const demo = DEMO_USERS[email.toLowerCase()];
          if (demo && demo.password === password) {
            persistUser(demo.user);
            logAuditEvent({ userId: demo.user.id, action: 'login', resource: 'auth', status: 'success', details: 'demo login' });
            return { error: null };
          }
          logAuditEvent({ action: 'login', resource: 'auth', status: 'denied', details: 'supabase auth failed' });
          return { error: 'Invalid credentials. Try commander@fifanexus.ai / nexus2026' };
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
          persistUser(u);
          logAuditEvent({ userId: u.id, action: 'login', resource: 'auth', status: 'success', details: 'supabase login' });
        }
        return { error: null };
      }
      const demo = DEMO_USERS[email.toLowerCase()];
      if (!demo || demo.password !== password) {
        logAuditEvent({ action: 'login', resource: 'auth', status: 'denied', details: 'demo credentials mismatch' });
        return { error: 'Invalid credentials. Try commander@fifanexus.ai / nexus2026' };
      }
      persistUser(demo.user);
      logAuditEvent({ userId: demo.user.id, action: 'login', resource: 'auth', status: 'success', details: 'demo login' });
      return { error: null };
    } catch {
      logAuditEvent({ action: 'login', resource: 'auth', status: 'error', details: 'unexpected error' });
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (user) {
      logAuditEvent({ userId: user.id, action: 'logout', resource: 'auth', status: 'success', details: 'user signed out' });
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    persistUser(null);
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
