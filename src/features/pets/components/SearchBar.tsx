interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar por nombre, zona o descripción…' }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="11" cy="11" r="7" stroke="#9AA3AD" strokeWidth="1.8" />
        <path d="M16 16l5 5" stroke="#9AA3AD" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[14px] outline-none placeholder:text-faint"
        type="search"
        inputMode="search"
        aria-label="Buscar mascotas"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="shrink-0 text-faint"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
