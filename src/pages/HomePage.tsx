import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
import { UrgentNeeds } from '@/features/centers/components/UrgentNeeds';
import { VerifiedCenterCard } from '@/features/help/components/VerifiedCenterCard';
import { useVerifiedCenters } from '@/features/help/hooks';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

function ActionCard({
  to,
  label,
  primary,
  icon,
}: {
  to: string;
  label: string;
  primary?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={
        primary
          ? 'flex flex-col gap-2 rounded-2xl bg-forest p-3.5 text-white shadow-[0_6px_16px_-8px_rgba(31,77,58,.7)]'
          : 'flex flex-col gap-2 rounded-2xl border border-sand-200 bg-white p-3.5 text-ink'
      }
    >
      {icon}
      <span className="text-[13.5px] font-bold leading-tight">{label}</span>
    </Link>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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

      <div className="grid grid-cols-2 gap-2.5">
        <ActionCard
          to="/donar-insumos"
          label="Quiero donar insumos"
          primary
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 8h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8z" stroke="#FF6B2C" strokeWidth="1.7" />
              <path d="M3 5h18v3H3z" stroke="#fff" strokeWidth="1.7" />
              <path d="M10 12h4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />
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
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/mascotas${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
        }}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar mascota, zona, centro o insumo…" />
      </form>

      <UrgentNeeds />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold text-forest-dark">Centros activos</h2>
          {hasCenters && (
            <Link to="/centros" className="text-[12.5px] font-bold text-forest">
              Ver todos
            </Link>
          )}
        </div>
        {hasCenters ? (
          <div className="flex flex-col gap-3">
            {centers.data!.slice(0, 3).map((c) => (
              <VerifiedCenterCard key={c.id} center={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🏥"
            title="Centros por cargar"
            message="Todavía no hay centros verificados publicados."
            action={
              <Link to="/reportar/centro">
                <Button>Agregar centro o necesidad</Button>
              </Link>
            }
          />
        )}
      </section>

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
