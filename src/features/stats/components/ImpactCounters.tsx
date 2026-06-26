import { useImpactStats } from '../hooks';

interface Stat {
  emoji: string;
  value: number;
  label: string;
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

export function ImpactCounters() {
  const { data, isLoading } = useImpactStats();

  const stats: Stat[] = [
    { emoji: '🐾', value: data?.pets ?? 0, label: plural(data?.pets ?? 0, 'mascota reportada', 'mascotas reportadas') },
    {
      emoji: '🏠',
      value: data?.fosters ?? 0,
      label: plural(data?.fosters ?? 0, 'hogar temporal disponible', 'hogares temporales disponibles'),
    },
    {
      emoji: '📦',
      value: data?.needs ?? 0,
      label: plural(data?.needs ?? 0, 'solicitud de ayuda', 'solicitudes de ayuda'),
    },
    {
      emoji: '🏘️',
      value: data?.refugios ?? 0,
      label: plural(data?.refugios ?? 0, 'refugio publicado', 'refugios publicados'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-2 rounded-xl border border-sand-200 bg-[#FBF8F1] px-2.5 py-2"
        >
          <span className="text-base leading-none" aria-hidden>
            {s.emoji}
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-extrabold leading-none text-forest-dark">
              {isLoading ? '·' : s.value}
            </span>
            <span className="mt-0.5 block text-[10.5px] font-medium leading-tight text-muted">{s.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
