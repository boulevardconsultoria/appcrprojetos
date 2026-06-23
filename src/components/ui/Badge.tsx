import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'premium' | 'free' | 'success' | 'warning'
}

const variants = {
  default: 'glass text-secondary',
  premium: 'bg-accent/20 text-accent border border-accent/30',
  free: 'glass text-muted',
  success: 'glass text-secondary',
  warning: 'bg-accent2/20 text-accent2 border border-accent2/30',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium uppercase tracking-[0.05em] ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
