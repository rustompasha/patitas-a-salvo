import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-[12.5px] font-bold text-[#3A4650]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={3}
        aria-invalid={!!error}
        className={cn(
          'w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-[14px] outline-none',
          'placeholder:text-faint focus:border-forest',
          error ? 'border-lost' : 'border-sand-300',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-lost">{error}</p>}
    </div>
  );
});
