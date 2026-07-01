import { useEffect, useRef, useState } from 'react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Circular selfie/profile-photo picker for volunteer registration. Validates type
 * (JPG/PNG/WEBP) and size (≤5MB) client-side and shows a round, Instagram-style
 * preview. Emits the raw File; compression to WebP happens at upload time.
 */
export function SelfieUpload({
  value,
  onChange,
  error,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setLocalError('Formato no válido. Usa una imagen JPG, PNG o WEBP.');
      onChange(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError('La imagen supera 5MB. Usa una foto más liviana.');
      onChange(null);
      return;
    }
    setLocalError(null);
    onChange(file);
  }

  function clear() {
    onChange(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const shown = error ?? localError;

  return (
    <div>
      <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Foto de perfil (selfie)</div>
      <div className="flex items-center gap-3.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {preview ? (
          <div className="relative shrink-0">
            <img
              src={preview}
              alt="Tu selfie"
              className="h-20 w-20 rounded-full border border-sand-300 object-cover"
            />
            <button
              type="button"
              onClick={clear}
              aria-label="Quitar foto"
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70"
            >
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CCB6] bg-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="3.3" stroke="#9AA3AD" strokeWidth="1.7" />
              <path d="M5 19c0-3 3-5 7-5s7 2 7 5" stroke="#9AA3AD" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[13px] font-bold text-forest"
          >
            {preview ? 'Cambiar foto' : 'Subir foto'}
          </button>
          <p className="mt-1 text-[11.5px] leading-snug text-faint">
            Sube una foto tipo selfie, de frente, con fondo claro o pared blanca. Esta foto ayuda a
            que la red sea más humana y confiable.
          </p>
        </div>
      </div>
      {shown && <p className="mt-1.5 text-xs font-medium text-lost">{shown}</p>}
    </div>
  );
}
