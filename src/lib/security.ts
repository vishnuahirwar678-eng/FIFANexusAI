import { detectPromptInjection, sanitizeInput } from './ai-agents';

export const MAX_INPUT_LENGTH = 1000;
export const MAX_EMAIL_LENGTH = 254;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Validate email format per RFC 5321 length limits. */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: 'Email is too long' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

/** Validate password meets minimum security requirements. */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters' };
  }
  return { valid: true };
}

/** Centralized input sanitization with length bounds. */
export function sanitizeUserInput(input: string): string {
  return sanitizeInput(input).slice(0, MAX_INPUT_LENGTH);
}

/** Check input for prompt injection and return safe flag. */
export function isInjectionAttempt(input: string): boolean {
  return detectPromptInjection(input);
}

/** Log security-relevant events (audit trail). */
export interface AuditEvent {
  timestamp: string;
  userId?: string;
  action: string;
  resource: string;
  status: 'success' | 'denied' | 'error';
  details: string;
}

const auditLog: AuditEvent[] = [];
const MAX_AUDIT_LOG = 500;

export function logAuditEvent(event: Omit<AuditEvent, 'timestamp'>): void {
  auditLog.push({ ...event, timestamp: new Date().toISOString() });
  if (auditLog.length > MAX_AUDIT_LOG) {
    auditLog.shift();
  }
}

export function getAuditLog(): readonly AuditEvent[] {
  return auditLog;
}

/** Sanitize error messages to avoid leaking sensitive internals. */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Only expose safe, user-facing messages
    const msg = error.message;
    if (/network|timeout|connection/i.test(msg)) {
      return 'Network error. Please check your connection and try again.';
    }
    if (/unauthorized|forbidden|401|403/i.test(msg)) {
      return 'Access denied. Please sign in again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}
