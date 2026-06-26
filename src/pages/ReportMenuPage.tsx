import { Link } from 'react-router-dom';

const OPTIONS = [
  { to: '/reportar/encontrada', emoji: '🔍', title: 'Encontré una mascota', sub: 'Reporta un animal que viste o rescataste.', tone: '#1F4D3A' },
  { to: '/reportar/perdida', emoji: '🐾', title: 'Perdí mi mascota', sub: 'Publica una alerta de búsqueda.', tone: '#D62828' },
  { to: '/reportar/centro', emoji: '📍', title: 'Reportar centro o rescatista', sub: 'Avisa de un punto que recibe o necesita ayuda.', tone: '#C2410C' },
  { to: '/reportar/necesidad', emoji: '📦', title: 'Reportar necesidad', sub: 'Avisa qué insumo hace falta y dónde.', tone: '#1F4D3A' },
  { to: '/puedo-ser-hogar-temporal', emoji: '🏠', title: 'Puedo ser hogar temporal', sub: 'Ofrece refugio temporal a una mascota.', tone: '#2A9D8F' },
];

export function ReportMenuPage() {
  return (
    <div className="animate-fade">
      <h1 className="text-[23px] font-extrabold text-forest-dark">¿Qué quieres reportar?</h1>
      <p className="mt-1 text-[13.5px] leading-snug text-[#5C6670]">
        Un reporte claro puede salvar una mascota.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <Link
            key={o.to}
            to={o.to}
            className="flex items-center gap-3.5 rounded-2xl border border-sand-200 bg-white p-4"
            style={{ borderLeft: `4px solid ${o.tone}` }}
          >
            <span className="text-2xl">{o.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">{o.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{o.sub}</span>
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
