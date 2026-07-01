import { cn } from '@/lib/utils';

/** First+last initial of a name, e.g. "María José Pérez" -> "MP". */
export function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Circular profile photo with an initials fallback (existing volunteers without
 *  a photo yet). Instagram-style round crop. */
export function VolunteerAvatar({
  name,
  photoUrl,
  className,
  textClassName = 'text-[15px]',
}: {
  name: string;
  photoUrl: string | null;
  className?: string;
  textClassName?: string;
}) {
  const base = cn('shrink-0 overflow-hidden rounded-full', className);
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className={cn(base, 'border border-sand-200 object-cover')} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        base,
        'flex items-center justify-center bg-[#EFE7FA] font-extrabold text-[#5B3B8B]',
        textClassName,
      )}
    >
      {nameInitials(name)}
    </span>
  );
}
