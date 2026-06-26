import { Link, useNavigate } from 'react-router-dom';
import { useVerifiedNeeds } from '@/features/help/hooks';
import { URGENCY_DB_META } from '@/constants/help';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatRelativeTime } from '@/lib/utils';
import type { UrgencyLevel } from '@/types/help';

const RANK: Record<UrgencyLevel, number> = { critico: 0, alto: 1, medio: 2, bajo: 3 };

export function UrgentNeeds() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useVerifiedNeeds();
  const list = data ?? [];

  if (isLoading) {
    return (
      <section className="flex justify-center py-6">
        <Spinner className="h-6 w-6 text-forest" />
      </section>
    );
  }

  if (isError || list.length === 0) {
    return (
      <section>
        <EmptyState
          emoji="📋"
          title="No hay necesidades activas"
          message="Cuando alguien solicite ayuda, aparecerá aquí."
          action={
            <Link to="/reportar/necesidad">
              <Button>Reportar una necesidad</Button>
            </Link>
          }
        />
      </section>
    );
  }

  const top = [...list]
    .sort((a, b) => (RANK[a.urgency ?? 'bajo'] ?? 9) - (RANK[b.urgency ?? 'bajo'] ?? 9))
    .slice(0, 5);

  return (
    <section className="rounded-3xl border border-[#F3E0D6] bg-[#FFF7F1] p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-lost" />
        <h2 className="text-[21px] font-extrabold leading-tight tracking-tight text-forest-dark">
          Más urgente ahora
        </h2>
      </div>
      <p className="mb-4 text-[13px] leading-snug text-[#5C6670]">
        Dónde se necesita ayuda en este momento.
      </p>

      <div className="flex flex-col gap-2.5">
        {top.map((n) => (
          <button
            key={n.id}
            onClick={() => navigate('/necesidades')}
            className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white p-3.5 text-left transition active:scale-[0.99]"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[14.5px] font-bold text-ink">{n.need}</span>
                {n.urgency && (
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${URGENCY_DB_META[n.urgency].badge}`}
                  >
                    {URGENCY_DB_META[n.urgency].label}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-muted">
                {n.city} · {formatRelativeTime(n.created_at)}
              </span>
            </span>
            <span className="shrink-0 text-[12px] font-bold text-forest">Ver ›</span>
          </button>
        ))}
      </div>

      <Link
        to="/necesidades"
        className="mt-4 block text-center text-[13px] font-bold text-forest"
      >
        Ver todas las necesidades
      </Link>
    </section>
  );
}
