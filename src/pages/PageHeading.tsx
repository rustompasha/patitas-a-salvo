import { useNavigate } from 'react-router-dom';

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-sand-300 bg-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#1F2933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="text-[23px] font-extrabold text-forest-dark">{title}</h1>
      {subtitle && <p className="mt-1 text-[13.5px] leading-snug text-[#5C6670]">{subtitle}</p>}
    </div>
  );
}
