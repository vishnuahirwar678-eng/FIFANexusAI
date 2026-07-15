import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, type AuthContextValue } from '../src/context/AuthContext';
import { useAuth } from '../src/context/useAuth';
import { DEMO_CREDENTIALS } from '../src/lib/demo-credentials';
import type { UserRole } from '../src/types';

// Helper to consume auth context for testing
function AuthConsumer({ onAuth }: { onAuth: (v: AuthContextValue) => void }) {
  const auth = useAuth();
  onAuth(auth);
  return <div data-testid="consumer">{auth.user ? auth.user.name : 'no user'}</div>;
}

function renderWithProvider(onAuth: (v: AuthContextValue) => void) {
  return render(
    <AuthProvider>
      <AuthConsumer onAuth={onAuth} />
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

// ─── Demo Credentials ─────────────────────────────────────────────────
describe('Demo credentials', () => {
  it('has 5 demo accounts', () => {
    expect(DEMO_CREDENTIALS).toHaveLength(5);
  });
  it('all passwords are nexus2026', () => {
    expect(DEMO_CREDENTIALS.every(c => c.password === 'nexus2026')).toBe(true);
  });
  it('includes all role types', () => {
    const roles = DEMO_CREDENTIALS.map(c => c.role);
    expect(roles).toContain('Commander');
    expect(roles).toContain('Operations');
    expect(roles).toContain('Security');
    expect(roles).toContain('Volunteer');
    expect(roles).toContain('Fan');
  });
  it('all emails use fifanexus.ai domain', () => {
    expect(DEMO_CREDENTIALS.every(c => c.email.endsWith('@fifanexus.ai'))).toBe(true);
  });
  it('each has a name', () => {
    expect(DEMO_CREDENTIALS.every(c => c.name.length > 0)).toBe(true);
  });
});

// ─── Auth Provider — Initialization ───────────────────────────────────
describe('AuthProvider initialization', () => {
  it('starts in loading state then resolves to no user', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });
    // After initial effect, loading should be false
    await waitFor(() => {
      expect(capturedAuth?.loading).toBe(false);
    });
    expect(capturedAuth?.user).toBeNull();
  });

  it('restores user from localStorage', async () => {
    const storedUser = {
      id: 'u_001',
      email: 'commander@fifanexus.ai',
      name: 'Commander Chen',
      role: 'commander' as UserRole,
      avatar: 'CC',
      zone: 'Command Center',
      shift: 'Full Event',
    };
    localStorage.setItem('nexus_auth_user', JSON.stringify(storedUser));

    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => {
      expect(capturedAuth?.user?.name).toBe('Commander Chen');
    });
  });

  it('clears corrupted localStorage on init', async () => {
    localStorage.setItem('nexus_auth_user', 'invalid-json{');

    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => {
      expect(capturedAuth?.loading).toBe(false);
    });
    expect(capturedAuth?.user).toBeNull();
    expect(localStorage.getItem('nexus_auth_user')).toBeNull();
  });
});

// ─── Auth Provider — Sign In ──────────────────────────────────────────
describe('AuthProvider signIn', () => {
  it('signs in with valid demo credentials (commander)', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user).not.toBeNull();
    expect(capturedAuth?.user?.role).toBe('commander');
    expect(capturedAuth?.user?.name).toBe('Commander Chen');
  });

  it('signs in with valid demo credentials (volunteer)', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('volunteer@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user?.role).toBe('volunteer');
    expect(capturedAuth?.user?.name).toBe('Maria Santos');
  });

  it('signs in with fan credentials', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('fan@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user?.role).toBe('fan');
  });

  it('signs in with security credentials', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('security@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user?.role).toBe('security');
  });

  it('signs in with operations credentials', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('ops@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user?.role).toBe('operations');
  });

  it('rejects invalid email', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('wrong@email.com', 'nexus2026');
      expect(result.error).not.toBeNull();
    });

    expect(capturedAuth?.user).toBeNull();
  });

  it('rejects invalid password', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('commander@fifanexus.ai', 'wrongpassword');
      expect(result.error).not.toBeNull();
    });

    expect(capturedAuth?.user).toBeNull();
  });

  it('rejects empty email', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('', 'nexus2026');
      expect(result.error).not.toBeNull();
    });
  });

  it('rejects empty password', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('commander@fifanexus.ai', '');
      expect(result.error).not.toBeNull();
    });
  });

  it('is case-insensitive for email', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      const result = await capturedAuth!.signIn('COMMANDER@fifanexus.ai', 'nexus2026');
      expect(result.error).toBeNull();
    });

    expect(capturedAuth?.user?.role).toBe('commander');
  });

  it('persists user to localStorage after sign in', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
    });

    const stored = localStorage.getItem('nexus_auth_user');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).name).toBe('Commander Chen');
  });
});

// ─── Auth Provider — Sign Out ─────────────────────────────────────────
describe('AuthProvider signOut', () => {
  it('signs out and clears user', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
    });
    expect(capturedAuth?.user).not.toBeNull();

    await act(async () => {
      await capturedAuth!.signOut();
    });
    expect(capturedAuth?.user).toBeNull();
  });

  it('removes user from localStorage on sign out', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
    });
    expect(localStorage.getItem('nexus_auth_user')).not.toBeNull();

    await act(async () => {
      await capturedAuth!.signOut();
    });
    expect(localStorage.getItem('nexus_auth_user')).toBeNull();
  });
});

// ─── RBAC — Role-Based Access Control ────────────────────────────────
describe('RBAC hasRole', () => {
  it('returns true for matching role', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
    });

    expect(capturedAuth?.hasRole('commander')).toBe(true);
  });

  it('returns false for non-matching role', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('commander@fifanexus.ai', 'nexus2026');
    });

    expect(capturedAuth?.hasRole('volunteer')).toBe(false);
  });

  it('returns true when one of multiple roles matches', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('security@fifanexus.ai', 'nexus2026');
    });

    expect(capturedAuth?.hasRole('commander', 'security')).toBe(true);
  });

  it('returns false when no roles match', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('fan@fifanexus.ai', 'nexus2026');
    });

    expect(capturedAuth?.hasRole('commander', 'security')).toBe(false);
  });

  it('returns false when user is null', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    expect(capturedAuth?.hasRole('commander')).toBe(false);
  });

  it('returns false for all roles when user is null', async () => {
    let capturedAuth: AuthContextValue | null = null;
    renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    expect(capturedAuth?.hasRole('commander', 'operations', 'security', 'volunteer', 'fan')).toBe(false);
  });
});

// ─── useAuth — Context Guard ──────────────────────────────────────────
describe('useAuth context guard', () => {
  it('throws when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer onAuth={() => {}} />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});

// ─── All 5 Demo Roles Complete Login Flow ─────────────────────────────
describe('Complete login flow for all roles', () => {
  DEMO_CREDENTIALS.forEach(({ email, password, role, name }) => {
    it(`successfully signs in as ${role} (${name})`, async () => {
      let capturedAuth: AuthContextValue | null = null;
      renderWithProvider((v) => { capturedAuth = v; });

      await waitFor(() => expect(capturedAuth?.loading).toBe(false));

      await act(async () => {
        const result = await capturedAuth!.signIn(email, password);
        expect(result.error).toBeNull();
      });

      expect(capturedAuth?.user?.name).toBe(name);
      expect(capturedAuth?.user?.email).toBe(email);
    });
  });
});

// ─── Session Persistence ──────────────────────────────────────────────
describe('Session persistence', () => {
  it('user persists across re-renders', async () => {
    let capturedAuth: AuthContextValue | null = null;
    const { rerender } = renderWithProvider((v) => { capturedAuth = v; });

    await waitFor(() => expect(capturedAuth?.loading).toBe(false));

    await act(async () => {
      await capturedAuth!.signIn('volunteer@fifanexus.ai', 'nexus2026');
    });

    // Simulate re-render
    rerender(
      <AuthProvider>
        <AuthConsumer onAuth={(v) => { capturedAuth = v; }} />
      </AuthProvider>,
    );

    expect(capturedAuth?.user?.name).toBe('Maria Santos');
  });
});
