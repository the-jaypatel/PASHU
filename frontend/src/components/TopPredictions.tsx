import type { BreedPrediction } from '../types/prediction'
import { PredictionCard } from './PredictionCard'

interface TopPredictionsProps {
  predictions: BreedPrediction[]
}

export function TopPredictions({ predictions }: TopPredictionsProps) {
  return (
    <section aria-labelledby="top-predictions-heading">
      <h2 id="top-predictions-heading" className="section-title text-xl sm:text-2xl">
        Top 3 Predictions
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Ranked by how closely the animal's features match each breed.
      </p>
      <ul className="mt-5 space-y-3">
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.breed}
            rank={index + 1}
            prediction={prediction}
            highlight={index === 0}
          />
        ))}
      </ul>
    </section>
  )
}