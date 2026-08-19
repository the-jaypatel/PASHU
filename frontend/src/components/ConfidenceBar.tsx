interface ConfidenceBarProps {
  value: number
}

export function ConfidenceBar({ value }: ConfidenceBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-sage-light/50"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={`Confidence ${Math.round(clamped)} percent`}
    >
      <div
        className="h-full rounded-full bg-forest transition-[width] duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}