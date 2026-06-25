import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-3 text-[14px] outline-none',
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
