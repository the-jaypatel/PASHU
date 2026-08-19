import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ padded = true, className, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`surface-card ${padded ? 'p-6 sm:p-8' : ''} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
