import { useEffect } from 'react';

/**
 * Fullscreen image viewer. Renders the image with object-contain on a dark
 * backdrop so the whole photo/poster is visible. Tap the backdrop or the close
 * button to dismiss. Mobile-Safari safe: fixed inset-0 + safe-area inset for the
 * close button, body scroll locked while open.
 */
export function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
    >
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] max-w-full object-contain"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
