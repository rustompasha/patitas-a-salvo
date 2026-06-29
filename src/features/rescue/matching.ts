// Patitas a Salvo — rescue matching engine.
// Pure, dependency-free ranking helpers shared by every "what can help here?" block.
// We only have free-text `city`, so token containment is our proxy for "same state".
//
// Matching priority (per spec): 1) same city  2) same state/area  3) newest  4) urgency.
import type { CenterRow, FosterRow, NeedRow, VolunteerRow } from '@/types/help';
import type { Pet } from '@/types/pet';

export function normalizeCity(s: string | null | undefined): string {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[\s,]+/g, ' ')
    .trim();
}

/**
 * Proximity score between a reference location and a candidate city.
 *   2 = same city, 1 = same area/state (shared token or one contains the other), 0 = unrelated.
 * Example: "Maiquetía, La Guaira" vs "La Guaira" -> 1.
 */
export function cityScore(ref: string | null | undefined, candidate: string | null | undefined): number {
  const a = normalizeCity(ref);
  const b = normalizeCity(candidate);
  if (!a || !b) return 0;
  if (a === b) return 2;
  const at = new Set(a.split(' ').filter((t) => t.length >= 3));
  for (const t of b.split(' ')) if (t.length >= 3 && at.has(t)) return 1;
  if (a.includes(b) || b.includes(a)) return 1;
  return 0;
}

const URGENCY_RANK: Record<string, number> = { critico: 3, alto: 2, medio: 1, bajo: 0 };
export function urgencyRank(u: string | null | undefined): number {
  return URGENCY_RANK[u ?? ''] ?? 0;
}

function ms(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** A shelter is "available" unless it reports itself full / saturated. */
export function isShelterAvailable(c: CenterRow): boolean {
  const s = normalizeCity(c.status); // reuse accent/lowercase normalization
  return !s.includes('lleno') && !s.includes('satur');
}

/** Generic stable-ish sort by a list of numeric scorers (higher = first). */
function rankBy<T>(items: T[], scorers: ((item: T) => number)[]): T[] {
  return [...items].sort((a, b) => {
    for (const score of scorers) {
      const d = score(b) - score(a);
      if (d !== 0) return d;
    }
    return 0;
  });
}

/** Shelters/refuges near `city`: same city first, then available, then newest. */
export function rankShelters(centers: CenterRow[], city: string | null | undefined): CenterRow[] {
  return rankBy(centers, [
    (c) => cityScore(city, c.city),
    (c) => (isShelterAvailable(c) ? 1 : 0),
    (c) => ms(c.created_at),
  ]);
}

/** Foster homes near `city`: same city first, then newest. */
export function rankFosters(fosters: FosterRow[], city: string | null | undefined): FosterRow[] {
  return rankBy(fosters, [(f) => cityScore(city, f.city), (f) => ms(f.created_at)]);
}

/** Needs near `city`: same city first, then urgency, then newest. */
export function rankNeeds(needs: NeedRow[], city: string | null | undefined): NeedRow[] {
  return rankBy(needs, [
    (n) => cityScore(city, n.city),
    (n) => urgencyRank(n.urgency),
    (n) => ms(n.created_at),
  ]);
}

/** Found pets near `city` that still need placement: same city first, then newest. */
export function rankFoundPets(pets: Pet[], city: string | null | undefined): Pet[] {
  return rankBy(
    pets.filter((p) => p.status === 'found'),
    [(p) => cityScore(city, p.location), (p) => ms(p.created_at)],
  );
}

/** Active volunteers near `city`/state: same area first, then (optionally) those whose
 *  help_types match `preferred`, then verified, then newest. `preferred` may include
 *  'Transporte'/'Traslados' to also surface volunteers with has_transport. */
export function rankVolunteers(
  vols: VolunteerRow[],
  city: string | null | undefined,
  preferred: string[] = [],
): VolunteerRow[] {
  const pref = new Set(preferred);
  const wantsTransport = pref.has('Transporte') || pref.has('Traslados');
  const matches = (v: VolunteerRow): number => {
    if (!pref.size) return 0;
    if (v.help_types?.some((h) => pref.has(h))) return 1;
    if (wantsTransport && v.has_transport) return 1;
    return 0;
  };
  return rankBy(vols, [
    (v) => cityScore(city, [v.city, v.state].filter(Boolean).join(' ')),
    (v) => matches(v),
    (v) => (v.verified ? 1 : 0),
    (v) => ms(v.created_at),
  ]);
}
