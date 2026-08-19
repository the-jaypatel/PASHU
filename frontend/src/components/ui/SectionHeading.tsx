import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className ?? ''}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth">{eyebrow}</p>
      )}
      <h2 className="section-title">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-soft">{description}</p>}
    </div>
  )
}
