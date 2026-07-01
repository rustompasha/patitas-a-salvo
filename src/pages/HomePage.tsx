import { Link } from 'react-router-dom';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
import { UrgentNeeds } from '@/features/centers/components/UrgentNeeds';
import { ImpactCounters } from '@/features/stats/components/ImpactCounters';
import { HomeRescueBoard } from '@/features/rescue/components/HomeRescueBoard';
import { HomeCentros } from '@/features/help/components/HomeCentros';

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

      {/* Where help is needed most — surfaced right under the primary actions so
          anyone wanting to help sees it first. */}
      <UrgentNeeds />

      {/* Explore the network — clickable navigation shortcuts (not statistics). */}
      <section>
        <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-faint">Red de apoyo</h2>
        <ImpactCounters />

        {/* Brigada de Respuesta Animal — prominent recruitment card. Operational,
            serious, safety-first: a field-response team, not general volunteering. */}
        <Link to="/brigada" className="mt-3 flex items-center gap-3 rounded-2xl bg-forest-dark p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember/20 text-xl" aria-hidden>
            🦺
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold leading-tight text-white">
              Postularme a la brigada
            </span>
            <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-white/80">
              Equipo de campo en Caracas para apoyo animal coordinado en La Guaira.
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-ember">
              Brigada de Respuesta Animal · aprobación requerida
            </span>
          </span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M9 6l6 6-6 6" stroke="#FF6B2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* Animales que buscan lugar + Refugios con cupo disponible */}
      <HomeRescueBoard />

      {/* Centros de acopio activos — directly below "Refugios con cupo disponible". */}
      <HomeCentros />

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

      {/* Join the support network — single consolidated entry. /ayudar already lists
          hogar temporal, registrar refugio and veterinario (plus more). */}
      <Link
        to="/ayudar"
        className="flex items-center gap-3 rounded-2xl border border-[#CFE6D6] bg-[#F1F8F3] p-4 text-ink"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0EFE4]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3" stroke="#1F4D3A" strokeWidth="1.7" />
            <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M16 11a3 3 0 100-6M17.5 14c2.3.5 3.5 2.3 3.5 5" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold leading-tight text-forest-dark">
            Únete a la red de apoyo
          </span>
          <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-muted">
            Regístrate como hogar temporal, refugio, veterinario o voluntario.
          </span>
        </span>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M9 6l6 6-6 6" stroke="#1F4D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Reportar una necesidad — important, but kept near the bottom so it doesn't
          compete with the primary emergency actions. */}
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
    </div>
  );
}
