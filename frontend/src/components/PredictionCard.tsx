import type { BreedPrediction } from '../types/prediction'
import { ConfidenceBar } from './ConfidenceBar'

interface PredictionCardProps {
  rank: number
  prediction: BreedPrediction
  highlight?: boolean
}

export function PredictionCard({ rank, prediction, highlight = false }: PredictionCardProps) {
  return (
    <li
      className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
        highlight
          ? 'border-forest bg-forest/[0.04] ring-1 ring-forest/20'
          : 'border-sage/25 bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              highlight ? 'bg-forest text-white' : 'bg-cream-dark text-ink-soft'
            }`}
            aria-hidden="true"
          >
            {rank}
          </span>
          <div>
            <p className={`text-sm font-bold sm:text-base ${highlight ? 'text-forest' : 'text-ink'}`}>
              {prediction.breed}
            </p>
            <p className="text-xs text-ink-muted">{prediction.type}</p>
          </div>
        </div>
        <p className="font-display text-base font-extrabold text-ink sm:text-lg">
          {prediction.confidence.toFixed(1)}%
        </p>
      </div>
      <div className="mt-3">
        <ConfidenceBar value={prediction.confidence} />
      </div>
    </li>
  )
}