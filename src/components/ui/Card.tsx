import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  glass?: boolean
}

export function Card({ children, className = '', onClick, hover, glass }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`${glass ? 'glass' : 'bg-surface'} rounded-xl border border-border ${
        hover ? 'hover:scale-[1.02] hover:border-white/20 transition-all duration-200 ease-out cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 pb-0 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}
