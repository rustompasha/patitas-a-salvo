import { Spinner } from '@/components/ui/Spinner';
import { NeedCard } from '@/features/help/components/NeedCard';
import { useVerifiedNeeds } from '@/features/help/hooks';
import { rankNeeds } from '../matching';

/**
 * Open needs (food, medicine, transport, volunteers…) near `city`, ranked by
 * proximity then urgency. Reused by the shelter onboarding and refuge detail.
 */
export function NeedsNearby({
  city,
  excludeId,
  limit = 4,
  emptyMessage = 'No hay necesidades activas cerca por ahora.',
}: {
  city?: string | null;
  excludeId?: string;
  limit?: number;
  emptyMessage?: string;
}) {
  const { data, isLoading } = useVerifiedNeeds();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6 text-forest" />
      </div>
    );
  }

  const needs = rankNeeds(data ?? [], city)
    .filter((n) => n.id !== excludeId)
    .slice(0, limit);

  if (needs.length === 0) {
    return (
      <p className="rounded-2xl border border-sand-200 bg-white px-3.5 py-4 text-[13px] text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {needs.map((n) => (
        <NeedCard key={n.id} need={n} />
      ))}
    </div>
  );
}
