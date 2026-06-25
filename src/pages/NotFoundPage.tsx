import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center animate-fade">
      <div className="text-5xl">🐾</div>
      <h1 className="mt-4 text-2xl font-extrabold text-forest-dark">Página no encontrada</h1>
      <p className="mt-2 max-w-xs text-sm text-muted">
        El enlace que seguiste no existe o cambió de lugar.
      </p>
      <Link to="/" className="mt-6">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
