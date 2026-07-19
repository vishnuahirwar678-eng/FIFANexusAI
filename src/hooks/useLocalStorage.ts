import { useCallback, useEffect, useState } from 'react';

/** Persist state to localStorage with JSON serialization and SSR safety. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or unavailable — fail silently
    }
  }, [key, value]);

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue(v);
  }, []);

  return [value, set];
}
