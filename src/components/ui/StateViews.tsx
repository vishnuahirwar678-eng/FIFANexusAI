import { memo, type ReactNode } from 'react';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';

interface StateProps {
  message?: string;
  className?: string;
}

/** Loading spinner with optional message. */
export const LoadingState = memo(function LoadingState({ message = 'Loading...', className }: StateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className ?? ''}`} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-nexus-400 animate-spin" aria-hidden="true" />
        <p className="text-sm text-ink-400">{message}</p>
      </div>
    </div>
  );
});

/** Empty state with icon and message. */
export const EmptyState = memo(function EmptyState({ message = 'No data available', className }: StateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className ?? ''}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-ink-800 flex items-center justify-center">
          <Inbox className="w-6 h-6 text-ink-400" aria-hidden="true" />
        </div>
        <p className="text-sm text-ink-400">{message}</p>
      </div>
    </div>
  );
});

/** Error state with icon and message. */
export const ErrorState = memo(function ErrorState({ message = 'Failed to load data', className }: StateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className ?? ''}`} role="alert">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-alert-500/15 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-alert-400" aria-hidden="true" />
        </div>
        <p className="text-sm text-ink-300">{message}</p>
      </div>
    </div>
  );
});

interface AsyncSectionProps {
  children: ReactNode;
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

/** Wraps content with loading/error/empty conditional rendering. */
export function AsyncSection({
  children,
  loading,
  error,
  empty,
  emptyMessage,
  loadingMessage,
}: AsyncSectionProps) {
  if (loading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState message={error} />;
  if (empty) return <EmptyState message={emptyMessage} />;
  return <>{children}</>;
}
