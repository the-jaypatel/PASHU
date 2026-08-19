import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: LucideIcon
  iconRight?: LucideIcon
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-50 disabled:cursor-not-allowed select-none'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-forest text-white shadow-card hover:bg-forest-dark hover:shadow-cardhover active:translate-y-px',
  secondary:
    'bg-sage-light text-forest hover:bg-sage/60 active:translate-y-px',
  outline:
    'border border-forest/30 text-forest bg-white hover:bg-cream active:translate-y-px',
  ghost: 'text-forest hover:bg-sage-light/60 active:translate-y-px',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm sm:text-base px-5 py-2.5',
  lg: 'text-base px-6 py-3.5 sm:px-8 sm:py-4',
}

function buildClassName(variant: Variant, size: Size, fullWidth: boolean, className?: string) {
  return [baseClasses, variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ')
}

interface ButtonLinkProps extends ButtonStyleProps {
  to: string
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  children,
  className,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link to={to} onClick={onClick} className={buildClassName(variant, size, fullWidth, className)}>
      {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="h-5 w-5 shrink-0" aria-hidden="true" />}
    </Link>
  )
}

interface ButtonProps
  extends ButtonStyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button {...rest} className={buildClassName(variant, size, fullWidth, className)}>
      {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="h-5 w-5 shrink-0" aria-hidden="true" />}
    </button>
  )
}
