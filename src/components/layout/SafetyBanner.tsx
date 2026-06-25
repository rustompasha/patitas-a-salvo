export function SafetyBanner() {
  return (
    <div className="flex gap-2 border-b border-[#F6D9C2] bg-[#FCEFE4] px-4 py-2.5">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
        <path d="M12 3l9 16H3L12 3z" stroke="#C2410C" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v4M12 16.5v.2" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <p className="text-[11px] font-medium leading-snug text-[#9A4A1A]">
        Información ciudadana en actualización. Verifica antes de movilizarte. No pongas tu vida en
        riesgo para rescatar animales en estructuras inestables.
      </p>
    </div>
  );
}
