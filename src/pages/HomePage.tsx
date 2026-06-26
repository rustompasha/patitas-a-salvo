import { Link } from 'react-router-dom';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
import { UrgentNeeds } from '@/features/centers/components/UrgentNeeds';
import { VerifiedCenterCard } from '@/features/help/components/VerifiedCenterCard';
import { useVerifiedCenters } from '@/features/help/hooks';
import { ImpactCounters } from '@/features/stats/components/ImpactCounters';

function ActionCard({
  to,
  label,
  sublabel,
  primary,
  icon,
}: {
  to: string;
  label: string;
  sublabel?: string;
  primary?: boolean;
  icon: React.ReactNode;
}) {
  if (primary) {
    return (
      <Link
        to={to}
        className="flex items-center gap-3 rounded-2xl bg-forest p-4 text-white shadow-[0_6px_16px_-8px_rgba(31,77,58,.7)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15.5px] font-extrabold leading-tight">{label}</span>
          {sublabel && <span className="mt-0.5 block text-[12px] font-medium text-white/85">{sublabel}</span>}
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className="flex flex-col gap-2 rounded-2xl border border-sand-200 bg-white p-3.5 text-ink"
    >
      {icon}
      <span className="text-[13.5px] font-bold leading-tight">{label}</span>
    </Link>
  );
}

export function HomePage() {
  const recent = usePets({ status: 'all', search: '' });
  const centers = useVerifiedCenters();
  const hasCenters = (centers.data?.length ?? 0) > 0;

  return (
    <div className="space-y-6 animate-fade">
      <section>
        <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-forest-dark">
          ¿Cómo puedes ayudar a una mascota hoy?
        </h1>
        <p className="mt-2 text-[13.5px] leading-snug text-[#5C6670]">
          Encuentra necesidades reales de alimento, medicinas, refugio, traslado y atención
          veterinaria tras el terremoto.
        </p>
      </section>

      <ImpactCounters />

      <div className="space-y-2.5">
        <ActionCard
          to="/donar-insumos"
          label="Ver necesidades"
          sublabel="Mira quién necesita ayuda ahora"
          primary
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 4h6v3H9zM9 5H7a1 1 0 00-1 1v13a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2"
                stroke="#fff"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M9 12h6M9 16h4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />

        <div className="grid grid-cols-2 gap-2.5">
          <ActionCard
            to="/reportar/encontrada"
            label="Encontré una mascota"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#1F4D3A" strokeWidth="1.7" />
                <path d="M16 16l5 5" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            }
          />
          <ActionCard
            to="/reportar/perdida"
            label="Perdí mi mascota"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7-4.3-9.3-8.5C1.3 9.9 2.7 7 5.6 7c1.7 0 2.8.9 3.5 1.8.3.4.6.5.9.5s.6-.1.9-.5C11.6 7.9 12.7 7 14.4 7c2.9 0 4.3 2.9 2.9 5.5C15 16.7 12 21 12 21z"
                  stroke="#D62828"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <ActionCard
            to="/puedo-ser-hogar-temporal"
            label="Puedo ser hogar temporal"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 11l9-7 9 7" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 10v9h14v-9" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <ActionCard
            to="/reportar/veterinario"
            label="Veterinario disponible"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="#1F7A6D" strokeWidth="1.7" />
                <path d="M12 8v8M8 12h8" stroke="#1F7A6D" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      </div>

      <UrgentNeeds />

      {hasCenters && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-forest-dark">Centros activos</h2>
            <Link to="/centros" className="text-[12.5px] font-bold text-forest">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {centers.data!.slice(0, 3).map((c) => (
              <VerifiedCenterCard key={c.id} center={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold text-forest-dark">Perdidas y encontradas</h2>
          <Link to="/mascotas" className="text-[12.5px] font-bold text-forest">
            Ver todas
          </Link>
        </div>
        <PetGrid
          pets={recent.data?.slice(0, 4)}
          isLoading={recent.isLoading}
          isError={recent.isError}
          onRetry={recent.refetch}
          emptyMessage="Todavía no hay reportes. Sé el primero en publicar uno."
        />
      </section>
    </div>
  );
}
