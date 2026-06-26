import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "hace 3 min", "hace 2 h", "hace 4 d" — Spanish relative time. */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });
}

/**
 * Normalize a Venezuelan phone number to international digits (no +) for wa.me.
 * Examples: "0412-555-0142" -> "584125550142", "+58 414 5550199" -> "584145550199".
 */
export function normalizeVePhone(raw: string | null | undefined): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('58')) return digits;
  if (digits.startsWith('0')) return `58${digits.slice(1)}`;
  if (digits.length === 10) return `58${digits}`;
  return digits;
}

/** Human-readable phone for display/manual calling: "+58 412 555 0142". */
export function formatVePhoneDisplay(raw: string | null | undefined): string {
  const d = normalizeVePhone(raw);
  if (!d) return '';
  if (d.length === 12 && d.startsWith('58')) {
    return `+58 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  }
  return `+${d}`;
}
