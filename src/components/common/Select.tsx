import { type SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder = 'Select option...', id, required, className = '', ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-800">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-900 text-sm sm:text-base appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 ${
              error
                ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-600 font-medium mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
