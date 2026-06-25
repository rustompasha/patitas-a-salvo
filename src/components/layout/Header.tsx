import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex items-center gap-2.5 bg-sand-50 px-4 py-3">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="#FF6B2C">
            <path d="M12 21s-7.5-4.6-10-9.2C.4 8.7 2 5.5 5.2 5.5c1.9 0 3.1 1 3.8 2 .3.4.7.6 1 .6s.7-.2 1-.6c.7-1 1.9-2 3.8-2 3.2 0 4.8 3.2 3.2 6.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[16.5px] font-extrabold tracking-tight text-ink">
            Patitas a Salvo <span className="text-forest">Venezuela</span>
          </span>
          <span className="block text-[11.5px] font-medium text-muted">
            Respuesta animal post-terremoto
          </span>
        </span>
      </Link>
    </header>
  );
}
