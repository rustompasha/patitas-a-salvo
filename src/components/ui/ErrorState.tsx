import { Button } from './Button';

export function ErrorState({
  message = 'No pudimos cargar la información. Revisa tu conexión e inténtalo de nuevo.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#F3C6C2] bg-[#FBE3E1] px-6 py-8 text-center">
      <div className="text-3xl">⚠️</div>
      <h3 className="mt-2 text-base font-bold text-[#A11D1D]">Algo salió mal</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-[#A11D1D]">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mx-auto mt-4" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
