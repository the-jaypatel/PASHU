import type { ReactNode } from 'react'

type Tone = 'forest' | 'sage' | 'earth' | 'amber' | 'red' | 'neutral'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

const toneClasses: Record<Tone, string> = {
  forest: 'bg-forest text-white',
  sage: 'bg-sage-light text-forest',
  earth: 'bg-earth/10 text-earth',
  amber: 'bg-amber-100 text-amber-900',
  red: 'bg-red-50 text-red-700',
  neutral: 'bg-cream-dark text-ink-soft',
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
