import { Check, Loader2 } from 'lucide-react'

interface AnalysisStepProps {
  label: string
  status: 'pending' | 'active' | 'completed'
}

export function AnalysisStep({ label, status }: AnalysisStepProps) {
  const isActive = status === 'active'
  const isCompleted = status === 'completed'

  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
          isCompleted
            ? 'border-forest bg-forest text-white'
            : isActive
              ? 'border-forest text-forest'
              : 'border-sage/50 text-sage-dark'
        }`}
        aria-hidden="true"
      >
        {isCompleted ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : isActive ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          isCompleted || isActive ? 'text-ink' : 'text-ink-muted'
        }`}
      >
        {label}
        {isActive && <span className="sr-only">(in progress)</span>}
        {isCompleted && <span className="sr-only">(completed)</span>}
      </span>
    </li>
  )
}
