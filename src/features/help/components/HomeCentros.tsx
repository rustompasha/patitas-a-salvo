import { MatchSection } from '@/features/rescue/components/MatchSection';
import { useCentrosAcopio } from '../hooks';
import { DEMO_CENTRO } from '@/constants/help';
import { CentroCard } from './CentroCard';

/** Home section: the 3 most recent centros de acopio (DEMO seed first), with a
 *  "Ver todos" link to the full directory. */
export function HomeCentros() {
  const { data } = useCentrosAcopio();
  const list = [DEMO_CENTRO, ...(data ?? [])].slice(0, 3);

  return (
    <MatchSection
      title="📦 Centros de acopio activos"
      subtitle="Puntos que reciben alimento, medicinas e insumos"
      seeAllTo="/centros-acopio"
      seeAllLabel="Ver todos"
    >
      <div className="flex flex-col gap-3">
        {list.map((c) => (
          <CentroCard key={c.id} centro={c} demo={c.id === DEMO_CENTRO.id} />
        ))}
      </div>
    </MatchSection>
  );
}
