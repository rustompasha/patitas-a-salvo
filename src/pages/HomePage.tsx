import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const recent = usePets({ status: 'all', search: '' });

  function submitSearch() {
    navigate(`/mascotas${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
  }

  return (
    <div className="space-y-5 animate-fade">
      <section>
        <h1 className="text-[25px] font-extrabold leading-tight tracking-tight text-forest-dark">
          Ayuda a una mascota a volver a casa
        </h1>
        <p className="mt-2 text-[13.5px] leading-snug text-[#5C6670]">
          Reporta y encuentra mascotas perdidas y encontradas tras el terremoto.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <Link
          to="/reportar/perdida"
          className="flex flex-col gap-2 rounded-2xl border border-sand-200 bg-white p-3.5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-4.3-9.3-8.5C1.3 9.9 2.7 7 5.6 7c1.7 0 2.8.9 3.5 1.8.3.4.6.5.9.5s.6-.1.9-.5C11.6 7.9 12.7 7 14.4 7c2.9 0 4.3 2.9 2.9 5.5C15 16.7 12 21 12 21z"
              stroke="#D62828"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[13.5px] font-bold leading-tight">Perdí mi mascota</span>
        </Link>

        <Link
          to="/reportar/encontrada"
          className="flex flex-col gap-2 rounded-2xl border border-sand-200 bg-white p-3.5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#1F4D3A" strokeWidth="1.7" />
            <path d="M16 16l5 5" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span className="text-[13.5px] font-bold leading-tight">Encontré una mascota</span>
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <SearchBar value={search} onChange={setSearch} />
      </form>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold text-forest-dark">Reportes recientes</h2>
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
