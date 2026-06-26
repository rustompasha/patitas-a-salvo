import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const linkBase = 'flex w-[58px] flex-col items-center gap-1 text-[10px] font-bold';

function navClass({ isActive }: { isActive: boolean }) {
  return cn(linkBase, isActive ? 'text-forest' : 'text-[#A9B0B6]');
}

export function BottomNav() {
  return (
    <nav className="safe-bottom flex items-end justify-around border-t border-[#EFE7D6] bg-white px-1 pt-2">
      <NavLink to="/" end className={navClass}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9h5v-5h4v5h5v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/mascotas" className={navClass}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>Mascotas</span>
      </NavLink>

      <NavLink to="/reportar" className="flex w-[58px] flex-col items-center gap-1">
        <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-white bg-ember shadow-[0_8px_18px_-6px_rgba(255,107,44,.7)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[10px] font-extrabold text-ember-dark">Reportar</span>
      </NavLink>

      <NavLink to="/refugios" className={navClass}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V8l5-4 5 4v12" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14 20v-8h6v8M3 20h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Refugios</span>
      </NavLink>

      <NavLink to="/ayudar" className={navClass}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 20s-6.5-4-9-7.7C1.2 9.6 2.5 6.5 5.5 6.5c1.7 0 2.8 1 3.5 1.9.3.4.7.6 1 .6s.7-.2 1-.6c.7-.9 1.8-1.9 3.5-1.9 3 0 4.3 3.1 2.5 5.8C18.5 16 12 20 12 20z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <span>Ayudar</span>
      </NavLink>
    </nav>
  );
}
