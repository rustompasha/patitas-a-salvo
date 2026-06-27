import { Link } from 'react-router-dom';

/** Consistent heading + optional "see all" link for a matching/recommendation block. */
export function MatchSection({
  title,
  subtitle,
  seeAllTo,
  seeAllLabel = 'Ver todo',
  children,
}: {
  title: string;
  subtitle?: string;
  seeAllTo?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-[16px] font-extrabold leading-tight text-forest-dark">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{subtitle}</p>}
        </div>
        {seeAllTo && (
          <Link to={seeAllTo} className="shrink-0 text-[12.5px] font-bold text-forest">
            {seeAllLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
