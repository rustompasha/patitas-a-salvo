import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const linkBase = 'flex w-16 flex-col items-center gap-1 text-[10px] font-bold';

function navClass({ isActive }: { isActive: boolean }) {
  return cn(linkBase, isActive ? 'text-forest' : 'text-[#A9B0B6]');
}

export function BottomNav() {
  return (
    <nav className="safe-bottom flex items-end justify-around border-t border-[#EFE7D6] bg-white px-2 pt-2">
      <NavLink to="/" end className={navClass}>
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9h5v-5h4v5h5v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/mascotas" className={navClass}>
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>Mascotas</span>
      </NavLink>

      <NavLink to="/reportar/perdida" className="flex w-16 flex-col items-center gap-1">
        <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-white bg-ember shadow-[0_8px_18px_-6px_rgba(255,107,44,.7)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[10px] font-extrabold text-ember-dark">Reportar</span>
      </NavLink>
    </nav>
  );
}
