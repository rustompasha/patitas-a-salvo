import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, id, ...props },
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
      <select
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          'w-full appearance-none rounded-xl border bg-white px-3.5 py-3 text-[14px] outline-none',
          'focus:border-forest',
          error ? 'border-lost' : 'border-sand-300',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-lost">{error}</p>}
    </div>
  );
});
