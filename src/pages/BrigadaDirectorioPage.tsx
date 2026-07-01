import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { BrigadeMemberCard } from '@/features/brigade/components/BrigadeMemberCard';
import { useBrigadeDirectory } from '@/features/brigade/hooks';
import type { BrigadeRow } from '@/types/brigade';

const FILTERS: { key: string; label: string; test: (m: BrigadeRow) => boolean }[] = [
  { key: 'all', label: 'Todos', test: () => true },
  { key: 'laguaira', label: 'La Guaira', test: (m) => m.can_travel_to_la_guaira },
  { key: 'vehicle', label: 'Con vehículo', test: (m) => m.has_vehicle },
  { key: 'firstaid', label: 'Primeros auxilios', test: (m) => m.first_aid_training },
  { key: 'vet', label: 'Formación veterinaria', test: (m) => m.veterinary_training },
  { key: 'handling', label: 'Manejo de animales', test: (m) => m.animal_handling_experience },
];

export function BrigadaDirectorioPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useBrigadeDirectory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const test = FILTERS.find((f) => f.key === filter)?.test ?? (() => true);
    return (data ?? []).filter((m) => {
      if (!test(m)) return false;
      if (!q) return true;
      return `${m.full_name} ${m.municipality ?? ''} ${m.sector ?? ''} ${m.experience_level ?? ''}`
        .toLowerCase()
        .includes(q);
    });
  }, [data, search, filter]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-sand-300 bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#1F2933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Brigadistas activos</h1>
        <p className="mt-1 text-[13px] text-muted">
          Equipo de campo aprobado, con base en Caracas y capacidad de apoyar operaciones
          coordinadas en La Guaira. Todo despliegue se coordina y evalúa previamente.
        </p>
        <Link
          to="/brigada"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-forest bg-white px-3.5 py-2 text-[12.5px] font-bold text-forest"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#1F4D3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Postularme a la brigada
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-forest" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !hasData ? (
        <EmptyState
          emoji="🦺"
          title="Aún no hay brigadistas activos"
          message="Las postulaciones se evalúan antes de activarse. Sé parte del equipo de respuesta animal."
          action={
            <Link to="/brigada">
              <Button>Postularme a la brigada</Button>
            </Link>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, municipio o experiencia…" />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </Chip>
            ))}
          </div>
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} brigadista{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((m) => (
              <BrigadeMemberCard key={m.id} member={m} />
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-center text-[13px] text-muted">Sin resultados para tu búsqueda.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
