import type { ReactNode } from 'react';

/**
 * Honest post-submit confirmation. Used by the report/help forms whose data is
 * not yet persisted publicly — it confirms receipt without implying the report
 * is already published.
 */
export function SubmittedNotice({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#D4E7D8] bg-white px-6 py-10 text-center animate-fade">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EC]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <h2 className="mt-4 text-[19px] font-extrabold text-forest-dark">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">{message}</p>
      {children && <div className="mt-5 flex w-full max-w-xs flex-col gap-2">{children}</div>}
    </div>
  );
}
