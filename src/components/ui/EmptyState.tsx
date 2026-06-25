import type { ReactNode } from 'react';

export function EmptyState({
  emoji = '🐾',
  title,
  message,
  action,
}: {
  emoji?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-10 text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="mt-2 text-base font-bold text-forest-dark">{title}</h3>
      {message && <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
