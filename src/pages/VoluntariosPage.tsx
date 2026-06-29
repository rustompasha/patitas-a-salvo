import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { VolunteerCard } from '@/features/help/components/VolunteerCard';
import { useVolunteers } from '@/features/help/hooks';
import type { VolunteerRow } from '@/types/help';

const FILTERS: { key: string; label: string; test: (v: VolunteerRow) => boolean }[] = [
  { key: 'all', label: 'Todos', test: () => true },
  { key: 'remote', label: 'Remoto', test: (v) => v.can_help_remote },
  { key: 'inperson', label: 'Presencial', test: (v) => v.can_help_in_person },
  {
    key: 'transport',
    label: 'Transporte',
    test: (v) => v.has_transport || v.help_types.some((h) => h === 'Transporte' || h === 'Traslados'),
  },
  { key: 'verify', label: 'Verificación', test: (v) => v.help_types.includes('Verificación de casos') },
  { key: 'centros', label: 'Centros de acopio', test: (v) => v.help_types.includes('Apoyo en centros de acopio') },
  { key: 'refugios', label: 'Refugios', test: (v) => v.help_types.includes('Apoyo a refugios') },
];

export function VoluntariosPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useVolunteers();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const test = FILTERS.find((f) => f.key === filter)?.test ?? (() => true);
    return (data ?? []).filter((v) => {
      if (!test(v)) return false;
      if (!q) return true;
      return `${v.name} ${v.city} ${v.state ?? ''} ${v.area ?? ''} ${v.help_types.join(' ')}`
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
        <h1 className="text-[21px] font-extrabold text-forest-dark">Voluntarios activos</h1>
        <p className="mt-1 text-[13px] text-muted">
          Personas disponibles para apoyar con difusión, coordinación, traslados y verificación de casos.
        </p>
        <Link
          to="/reportar/voluntario"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-forest bg-white px-3.5 py-2 text-[12.5px] font-bold text-forest"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#1F4D3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Quiero ser voluntario
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
          emoji="🙌"
          title="Aún no hay voluntarios publicados"
          message="Sé la primera persona en sumarte a la red de apoyo."
          action={
            <Link to="/reportar/voluntario">
              <Button>Sumarme como voluntario</Button>
            </Link>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por ciudad, zona o tipo de apoyo…" />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </Chip>
            ))}
          </div>
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} voluntario{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((v) => (
              <VolunteerCard key={v.id} volunteer={v} />
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
