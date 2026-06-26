import { useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
}

export function ImageUpload({ value, onChange, hint = 'Una foto clara ayuda a reconocerla' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  // Any image is accepted; it's downscaled, converted to WebP and compressed
  // automatically on upload (see uploadPetImage). No size rejection.
  function handleFile(file: File | undefined) {
    if (!file) return;
    onChange(file);
  }

  function clear() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-sand-300">
          <img src={preview} alt="Vista previa" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white"
          >
            Quitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center rounded-2xl border-[1.5px] border-dashed border-[#D8CCB6] bg-white px-6 py-7 text-center"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#9AA3AD" strokeWidth="1.7" />
            <circle cx="12" cy="13" r="3.2" stroke="#9AA3AD" strokeWidth="1.7" />
            <path d="M8 6l1.5-2h5L16 6" stroke="#9AA3AD" strokeWidth="1.7" />
          </svg>
          <span className="mt-2 text-[13px] font-bold text-[#3A4650]">Agregar foto</span>
          <span className="mt-1 text-[11.5px] text-faint">{hint}</span>
        </button>
      )}
    </div>
  );
}
