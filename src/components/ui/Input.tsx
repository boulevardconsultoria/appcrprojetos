import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-md border px-4 py-2.5 text-sm transition-colors bg-elevated text-[#eee] placeholder:text-muted focus:outline-none focus:border-[rgba(255,255,255,0.3)] ${
            error
              ? 'border-[rgba(255,255,255,0.2)]'
              : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-[11px] text-muted">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
