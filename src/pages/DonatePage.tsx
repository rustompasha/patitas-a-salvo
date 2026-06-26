import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ShareButton } from '@/components/contact/ShareButton';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { VerifiedCenterCard } from '@/features/help/components/VerifiedCenterCard';
import { NeedCard } from '@/features/help/components/NeedCard';
import { useVerifiedCenters, useVerifiedNeeds } from '@/features/help/hooks';

const CATEGORIES = ['Perrarina', 'Gatarina', 'Transportadoras', 'Medicinas', 'Atención veterinaria'];

export function DonatePage() {
  const centers = useVerifiedCenters();
  const needs = useVerifiedNeeds();
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const isLoading = centers.isLoading || needs.isLoading;
  const isError = centers.isError || needs.isError;

  const filteredCenters = useMemo(() => {
    let list = centers.data ?? [];
    if (category) {
      const c = category.toLowerCase();
      list = list.filter((x) => x.needs.some((n) => n.toLowerCase().includes(c)));
    }
    const q = search.toLowerCase().trim();
    if (q) list = list.filter((x) => `${x.name} ${x.city} ${x.needs.join(' ')}`.toLowerCase().includes(q));
    return list;
  }, [centers.data, category, search]);

  const filteredNeeds = useMemo(() => {
    let list = needs.data ?? [];
    if (category) {
      const c = category.toLowerCase();
      list = list.filter((x) => x.need.toLowerCase().includes(c));
    }
    const q = search.toLowerCase().trim();
    if (q) list = list.filter((x) => `${x.need} ${x.city}`.toLowerCase().includes(q));
    return list;
  }, [needs.data, category, search]);

  const totalRaw = (centers.data?.length ?? 0) + (needs.data?.length ?? 0);

  return (
    <div className="animate-fade">
      <PageHeading title="Quiero donar insumos" subtitle="Encuentra qué hace falta y dónde llevarlo." />

      <div className="mb-5">
        <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Categorías de donación</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-forest" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => { centers.refetch(); needs.refetch(); }} />
      ) : totalRaw === 0 ? (
        <EmptyState
          emoji="📦"
          title="Sin centros con necesidades publicadas"
          message="Todavía no hay centros con necesidades publicadas. Puedes reportar un centro o compartir la plataforma."
          action={
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Link to="/reportar/centro">
                <Button fullWidth>Reportar centro</Button>
              </Link>
              <Link to="/mascotas">
                <Button variant="secondary" fullWidth>
                  Ver mascotas
                </Button>
              </Link>
              <ShareButton
                title="Patitas a Salvo"
                text="🐾 Patitas a Salvo: ayuda a mascotas perdidas y encontradas tras el terremoto en Venezuela."
                className="w-full"
              />
            </div>
          }
        />
      ) : (
        <div className="space-y-5">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por ciudad, centro o insumo…" />

          {filteredNeeds.length > 0 && (
            <section>
              <h2 className="mb-3 text-[15px] font-extrabold text-forest-dark">Necesidades reportadas</h2>
              <div className="flex flex-col gap-3">
                {filteredNeeds.map((n) => (
                  <NeedCard key={n.id} need={n} />
                ))}
              </div>
            </section>
          )}

          {filteredCenters.length > 0 && (
            <section>
              <h2 className="mb-3 text-[15px] font-extrabold text-forest-dark">Centros que reciben</h2>
              <div className="flex flex-col gap-3">
                {filteredCenters.map((c) => (
                  <VerifiedCenterCard key={c.id} center={c} />
                ))}
              </div>
            </section>
          )}

          {filteredCenters.length === 0 && filteredNeeds.length === 0 && (
            <p className="py-4 text-center text-[13px] text-muted">
              Sin resultados para esta búsqueda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
