import { Link } from 'react-router-dom';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
import { UrgentNeeds } from '@/features/centers/components/UrgentNeeds';
import { ImpactCounters } from '@/features/stats/components/ImpactCounters';
import { HomeRescueBoard } from '@/features/rescue/components/HomeRescueBoard';

/** Large, top-of-page decision card. Solid, high-contrast white-on-color so the
 *  three primary actions dominate the page for stressed, scanning users. */
function BigCard({
  to,
  label,
  sublabel,
  icon,
  cardClass,
}: {
  to: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  /** Solid background color class (e.g. "bg-lost"). White text/icon assumed. */
  cardClass: string;
}) {
  return (
    <Link to={to} className={`flex flex-col gap-2.5 rounded-2xl p-4 ${cardClass}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">{icon}</span>
      <span>
        <span className="block text-[15.5px] font-extrabold leading-tight text-white">{label}</span>
        <span className="mt-1 block text-[12px] font-medium leading-snug text-white/85">{sublabel}</span>
      </span>
    </Link>
  );
}

/** Compact secondary action row. */
function RowCard({
  to,
  label,
  sublabel,
  icon,
}: {
  to: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white p-3.5 text-ink"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold leading-tight">{label}</span>
        {sublabel && <span className="mt-0.5 block text-[12px] font-medium text-muted">{sublabel}</span>}
      </span>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M9 6l6 6-6 6" stroke="#C7CDD3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function HomePage() {
  const recent = usePets({ status: 'all', search: '' });

  return (
    <div className="space-y-6 animate-fade">
      <section>
        <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-forest-dark">
          ¿Necesitas ayuda con una mascota?
        </h1>
        <p className="mt-2 text-[13.5px] leading-snug text-[#5C6670]">
          Reporta una mascota perdida, avisa si encontraste una, o ayuda con refugios e insumos.
        </p>
      </section>

      {/* Primary actions — the three dominant decisions. Solid, high-contrast. */}
      <div className="grid grid-cols-2 gap-2.5">
        <BigCard
          to="/reportar/perdida"
          label="Perdí mi mascota"
          sublabel="Publica una alerta de búsqueda"
          cardClass="bg-lost"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-4.3-9.3-8.5C1.3 9.9 2.7 7 5.6 7c1.7 0 2.8.9 3.5 1.8.3.4.6.5.9.5s.6-.1.9-.5C11.6 7.9 12.7 7 14.4 7c2.9 0 4.3 2.9 2.9 5.5C15 16.7 12 21 12 21z"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <BigCard
          to="/reportar/encontrada"
          label="Encontré una mascota"
          sublabel="Te guiamos para conseguirle apoyo"
          cardClass="bg-forest"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.8" />
              <path d="M16 16l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Donate CTA — third primary action. Solid action orange, white on color.
          Sends donors straight to the people & refuges asking for help. */}
      <Link
        to="/necesidades"
        className="flex items-center gap-3 rounded-2xl bg-ember-dark p-4"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-4.3-9.3-8.5C1.3 9.9 2.7 7 5.6 7c1.7 0 2.8.9 3.5 1.8.3.4.6.5.9.5s.6-.1.9-.5C11.6 7.9 12.7 7 14.4 7c2.9 0 4.3 2.9 2.9 5.5C15 16.7 12 21 12 21z"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15.5px] font-extrabold leading-tight text-white">Quiero donar</span>
          <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-white/85">
            Ver necesidades cercanas
          </span>
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Pedir ayuda (request help) */}
      <div className="space-y-2.5">
        <h2 className="text-[12px] font-bold uppercase tracking-wide text-faint">Pedir ayuda</h2>
        <RowCard
          to="/reportar/necesidad"
          label="Reportar una necesidad"
          sublabel="Pide alimento, medicinas, traslado o rescate"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 4h6v3H9zM9 5H7a1 1 0 00-1 1v13a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2"
                stroke="#D9531E"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M12 11v5M9.5 13.5h5" stroke="#D9531E" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Ofrecer ayuda (offer help) */}
      <div className="space-y-2.5">
        <h2 className="text-[12px] font-bold uppercase tracking-wide text-faint">Ofrecer ayuda</h2>
        <RowCard
          to="/necesidades"
          label="Ver necesidades"
          sublabel="Mira quién necesita ayuda ahora"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 4h6v3H9zM9 5H7a1 1 0 00-1 1v13a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2"
                stroke="#1F4D3A"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M9 12h6M9 16h4" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />
        <RowCard
          to="/puedo-ser-hogar-temporal"
          label="Puedo ser hogar temporal"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 11l9-7 9 7" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10v9h14v-9" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <RowCard
          to="/reportar/refugio"
          label="Soy refugio / registrar refugio"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 20V8l5-4 5 4v12" stroke="#1F4D3A" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M14 20v-8h6v8M3 20h18" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <RowCard
          to="/reportar/veterinario"
          label="Veterinario disponible"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="#1F7A6D" strokeWidth="1.7" />
              <path d="M12 8v8M8 12h8" stroke="#1F7A6D" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Network status (stats — below actions, lighter) */}
      <section>
        <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-faint">Estado de la red</h2>
        <ImpactCounters />
      </section>

      <UrgentNeeds />

      <HomeRescueBoard />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold text-forest-dark">Perdidas y encontradas</h2>
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
