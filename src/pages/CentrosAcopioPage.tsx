import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { CentroCard } from '@/features/help/components/CentroCard';
import { useCentrosAcopio } from '@/features/help/hooks';
import { DEMO_CENTRO } from '@/constants/help';

export function CentrosAcopioPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useCentrosAcopio();
  const [search, setSearch] = useState('');

  // DEMO seed always present, real centros after it.
  const all = useMemo(() => [DEMO_CENTRO, ...(data ?? [])], [data]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return all;
    return all.filter((c) =>
      `${c.name} ${c.city} ${c.notes ?? ''}`.toLowerCase().includes(q),
    );
  }, [all, search]);

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
        <h1 className="text-[21px] font-extrabold text-[#7A4E12]">📦 Centros de acopio</h1>
        <p className="mt-1 text-[13px] text-muted">
          Puntos que reciben y distribuyen alimento, medicinas e insumos para animales.
        </p>
        <Link
          to="/reportar/centro-acopio"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#E0A93F] bg-white px-3.5 py-2 text-[12.5px] font-bold text-[#8A5A14]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#8A5A14" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Registrar centro de acopio
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-[#E0A93F]" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, ciudad o descripción…" />
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} centro{filtered.length === 1 ? '' : 's'} de acopio
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((c) => (
              <CentroCard key={c.id} centro={c} demo={c.id === DEMO_CENTRO.id} />
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-center text-[13px] text-muted">Sin resultados para “{search}”.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
