import { MapPin, Milk, Sprout, Info } from 'lucide-react'
import type { BreedInfo } from '../types/prediction'
import { Badge } from './ui/Badge'

interface BreedInfoCardProps {
  breed: BreedInfo
}

export function BreedInfoCard({ breed }: BreedInfoCardProps) {
  return (
    <section aria-labelledby="breed-info-heading" className="surface-card overflow-hidden">
      <div className="bg-forest px-6 py-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-sage-light">
          Breed Information
        </p>
        <h2 id="breed-info-heading" className="mt-1 font-display text-2xl font-extrabold text-white">
          {breed.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="sage">{breed.type}</Badge>
          {breed.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="neutral" className="!bg-white/10 !text-sage-light">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-cream p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-earth" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Origin</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{breed.origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-cream p-4">
            <Milk className="mt-0.5 h-5 w-5 shrink-0 text-earth" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Primary Use</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{breed.primaryUse}</p>
            </div>
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-earth" aria-hidden="true" />
          {breed.description}
        </p>

        <h3 className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink">
          <Sprout className="h-4 w-4 text-forest" aria-hidden="true" />
          Key characteristics
        </h3>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {breed.characteristics.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}