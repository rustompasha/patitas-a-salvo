import { Link } from 'react-router-dom';
import { useImpactStats } from '../hooks';

interface Stat {
  emoji: string;
  value: number;
  label: string;
  to: string;
  /** Optional accent classes for the card (border/bg) + value color. */
  cardClass?: string;
  valueClass?: string;
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

export function ImpactCounters() {
  const { data, isLoading } = useImpactStats();

  const stats: Stat[] = [
    {
      emoji: '🐾',
      value: data?.pets ?? 0,
      label: plural(data?.pets ?? 0, 'mascota reportada', 'mascotas reportadas'),
      to: '/mascotas',
    },
    {
      emoji: '🏠',
      value: data?.fosters ?? 0,
      label: plural(data?.fosters ?? 0, 'hogar temporal disponible', 'hogares temporales disponibles'),
      to: '/puedo-ser-hogar-temporal',
    },
    {
      emoji: '📋',
      value: data?.needs ?? 0,
      label: plural(data?.needs ?? 0, 'solicitud de ayuda', 'solicitudes de ayuda'),
      to: '/necesidades',
    },
    {
      emoji: '🏘️',
      value: data?.refugios ?? 0,
      label: plural(data?.refugios ?? 0, 'refugio publicado', 'refugios publicados'),
      to: '/refugios',
    },
    {
      // Subtle green/medical accent.
      emoji: '🩺',
      value: data?.vets ?? 0,
      label: plural(data?.vets ?? 0, 'veterinario disponible', 'veterinarios disponibles'),
      to: '/veterinarios',
      cardClass: 'border-[#CFE6D6] bg-[#F1F8F3] hover:border-forest/50',
      valueClass: 'text-[#1F7A6D]',
    },
    {
      // Subtle amber/orange accent (matches the Centros de acopio identity).
      emoji: '📦',
      value: data?.centros ?? 0,
      label: plural(data?.centros ?? 0, 'centro de acopio', 'centros de acopio'),
      to: '/centros-acopio',
      cardClass: 'border-[#F2D7A8] bg-[#FFF9EF] hover:border-[#E0A93F]',
      valueClass: 'text-[#8A5A14]',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {stats.map((s) => (
        <Link
          key={s.label}
          to={s.to}
          className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition hover:bg-white active:scale-[0.98] ${
            s.cardClass ?? 'border-sand-200 bg-[#FBF8F1] hover:border-forest/40'
          }`}
        >
          <span className="text-base leading-none" aria-hidden>
            {s.emoji}
          </span>
          <span className="min-w-0">
            <span
              className={`block text-[14px] font-extrabold leading-none ${s.valueClass ?? 'text-forest-dark'}`}
            >
              {isLoading ? '·' : s.value}
            </span>
            <span className="mt-0.5 block text-[10.5px] font-medium leading-tight text-muted">{s.label}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
