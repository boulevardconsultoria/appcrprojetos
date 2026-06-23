import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full rounded-md border px-4 py-2.5 text-sm transition-colors bg-elevated text-[#eee] focus:outline-none focus:border-[rgba(255,255,255,0.3)] ${
            error ? 'border-[rgba(255,255,255,0.2)]' : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-elevated">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-elevated">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-[11px] text-muted">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
