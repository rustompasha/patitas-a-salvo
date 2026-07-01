import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { VolunteerCard } from '@/features/help/components/VolunteerCard';
import { useVolunteers } from '@/features/help/hooks';
import { isPresencial, isRemoto, resolveModality } from '@/constants/help';
import type { VolunteerRow } from '@/types/help';

type Section = 'presencial' | 'remoto';

/** Push a value into a Map-of-arrays keyed by `key`. */
function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const arr = map.get(key);
  if (arr) arr.push(value);
  else map.set(key, [value]);
}

/** Venezuela first, then countries alphabetically. */
function countryOrder(a: string, b: string) {
  const rank = (c: string) => (c === 'Venezuela' ? 0 : 1);
  return rank(a) - rank(b) || a.localeCompare(b);
}

interface Group {
  country: string;
  /** Presenciales: state. Remotos: city. */
  subgroups: { label: string; volunteers: VolunteerRow[] }[];
}

/** Presenciales -> country > state (cards sorted by city). Remotos -> country > city. */
function buildGroups(list: VolunteerRow[], section: Section): Group[] {
  const byCountry = new Map<string, VolunteerRow[]>();
  for (const v of list) push(byCountry, v.country?.trim() || 'Venezuela', v);

  return [...byCountry.keys()].sort(countryOrder).map((country) => {
    const vols = byCountry.get(country)!;
    const sub = new Map<string, VolunteerRow[]>();
    if (section === 'presencial') {
      for (const v of vols) push(sub, v.state?.trim() || 'Otras zonas', v);
    } else {
      for (const v of vols) push(sub, v.city?.trim() || 'Sin ciudad', v);
    }
    const subgroups = [...sub.keys()].sort((a, b) => a.localeCompare(b)).map((label) => {
      const volunteers = sub.get(label)!;
      volunteers.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
      return { label, volunteers };
    });
    return { country, subgroups };
  });
}

function CountPill({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-2 py-2 text-center">
      <div className="text-[17px] font-extrabold leading-none text-forest-dark">{n}</div>
      <div className="mt-1 text-[10.5px] font-medium leading-tight text-muted">{label}</div>
    </div>
  );
}

export function VoluntariosPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useVolunteers();
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section>('presencial');

  const all = data ?? [];
  const presenciales = useMemo(() => all.filter((v) => isPresencial(resolveModality(v))), [all]);
  const remotos = useMemo(() => all.filter((v) => isRemoto(resolveModality(v))), [all]);

  const q = search.toLowerCase().trim();
  const groups = useMemo(() => {
    const base = section === 'presencial' ? presenciales : remotos;
    const filtered = q
      ? base.filter((v) =>
          `${v.name} ${v.city} ${v.state ?? ''} ${v.area ?? ''} ${v.country ?? ''} ${v.help_types.join(' ')}`
            .toLowerCase()
            .includes(q),
        )
      : base;
    return buildGroups(filtered, section);
  }, [presenciales, remotos, section, q]);

  const hasData = all.length > 0;
  const shownCount = groups.reduce((n, g) => n + g.subgroups.reduce((m, s) => m + s.volunteers.length, 0), 0);

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-sand-300 bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#1F2933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Conoce nuestra red de voluntarios</h1>
        <p className="mt-1 text-[13px] leading-snug text-muted">
          Personas reales, en Venezuela y fuera del país, ayudando a coordinar, verificar, difundir y
          mover recursos para los animales que lo necesitan.
        </p>
        <Link
          to="/reportar/voluntario"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-forest bg-white px-3.5 py-2 text-[12.5px] font-bold text-forest"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#1F4D3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Quiero ser voluntario
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-forest" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !hasData ? (
        <EmptyState
          emoji="🙌"
          title="Aún no hay voluntarios publicados"
          message="Sé la primera persona en sumarte a la red de apoyo."
          action={
            <Link to="/reportar/voluntario">
              <Button>Sumarme como voluntario</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <CountPill n={presenciales.length} label="Presenciales" />
            <CountPill n={remotos.length} label="Remotos" />
            <CountPill n={all.length} label="Total" />
          </div>

          <div className="flex gap-2">
            <Chip active={section === 'presencial'} onClick={() => setSection('presencial')}>
              Presenciales ({presenciales.length})
            </Chip>
            <Chip active={section === 'remoto'} onClick={() => setSection('remoto')}>
              Remotos ({remotos.length})
            </Chip>
          </div>

          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, ciudad, país o tipo de apoyo…" />

          {shownCount === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted">
              {q ? 'Sin resultados para tu búsqueda.' : 'Aún no hay voluntarios en esta modalidad.'}
            </p>
          ) : (
            <div className="space-y-6">
              {groups.map((g) => (
                <section key={g.country} className="space-y-3">
                  <h2 className="text-[15px] font-extrabold text-forest-dark">{g.country}</h2>
                  {g.subgroups.map((sg) => (
                    <div key={sg.label} className="space-y-2.5">
                      <h3 className="text-[11.5px] font-bold uppercase tracking-wide text-faint">
                        {sg.label}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {sg.volunteers.map((v) => (
                          <VolunteerCard key={v.id} volunteer={v} />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
