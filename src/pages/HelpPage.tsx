import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/donar-insumos', emoji: '📦', title: 'Donar insumos', sub: 'Lleva alimento, medicinas o transportadoras.' },
  { to: '/puedo-ser-hogar-temporal', emoji: '🏠', title: 'Ser hogar temporal', sub: 'Da refugio seguro mientras encuentran familia.' },
  { to: '/reportar/centro', emoji: '📍', title: 'Reportar centro o necesidad', sub: 'Ayuda a construir el mapa de ayuda real.' },
  { to: '/mascotas', emoji: '🐾', title: 'Ver mascotas perdidas/encontradas', sub: 'Comparte información que ayude a reunirlas.' },
];

export function HelpPage() {
  return (
    <div className="animate-fade">
      <h1 className="text-[23px] font-extrabold text-forest-dark">¿Cómo puedes ayudar?</h1>
      <p className="mt-1 text-[13.5px] leading-snug text-[#5C6670]">
        Cada acción cuenta. Elige cómo quieres sumarte hoy.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="flex items-center gap-3.5 rounded-2xl border border-sand-200 bg-white p-4"
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">{c.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{c.sub}</span>
            </span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M9 6l6 6-6 6" stroke="#C7CDD3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
