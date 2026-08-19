interface ConfidenceGaugeProps {
  value: number
  size?: number
}

export function ConfidenceGauge({ value, size = 132 }: ConfidenceGaugeProps) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label="Confidence"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-sage-light/60"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="text-forest transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-extrabold text-ink">
          {Math.round(clamped)}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
          confidence
        </span>
      </div>
    </div>
  )
}