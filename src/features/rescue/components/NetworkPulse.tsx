import { usePets } from '@/features/pets/hooks/usePets';
import { useVerifiedNeeds, useRefugios } from '@/features/help/hooks';
import { urgencyRank, isShelterAvailable } from '../matching';

/** Live "the network is active right now" numbers, shown on shelter onboarding. */
export function NetworkPulse() {
  const pets = usePets({ status: 'found', search: '' });
  const needs = useVerifiedNeeds();
  const refugios = useRefugios();

  const foundCount = (pets.data ?? []).length;
  const urgentCount = (needs.data ?? []).filter((n) => urgencyRank(n.urgency) >= 2).length;
  const needsCount = (needs.data ?? []).length;
  const availableShelters = (refugios.data ?? []).filter(isShelterAvailable).length;

  const items = [
    { value: foundCount, label: 'animales esperan ubicación' },
    { value: urgentCount, label: 'pedidos urgentes de rescate' },
    { value: needsCount, label: 'solicitudes de insumos activas' },
    { value: availableShelters, label: 'refugios con cupo disponible' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-sand-200 bg-[#FBF8F1] px-3 py-2.5">
          <div className="text-[20px] font-extrabold leading-none text-forest-dark">{it.value}</div>
          <div className="mt-1 text-[11px] font-medium leading-tight text-muted">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
