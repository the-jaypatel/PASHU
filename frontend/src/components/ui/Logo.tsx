import { Link } from 'react-router-dom'
import { ScanSearch } from 'lucide-react'

interface LogoProps {
  className?: string
  onNavigate?: () => void
}

export function Logo({ className, onNavigate }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className={`inline-flex items-center gap-2.5 ${className ?? ''}`}
      aria-label="PASHU home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white shadow-card">
        <ScanSearch className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold tracking-tight text-ink">PASHU</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Breed AI
        </span>
      </span>
    </Link>
  )
}
