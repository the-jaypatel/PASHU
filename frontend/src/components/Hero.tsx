import { ArrowDown, Camera, ScanSearch, Sparkles } from 'lucide-react'
import { ButtonLink } from './ui/Button'
import { HeroVisual } from './HeroVisual'
import { scrollToSection } from '../utils/scroll'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sage/25 to-transparent"
        aria-hidden="true"
      />
      <div className="container-page relative grid items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-earth/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-earth">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Smart India Hackathon 2026
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Identify Indian Bovine Breeds with{' '}
            <span className="text-forest">AI</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Upload a photo of a cow or buffalo and let PASHU's AI analyze its visual
            characteristics to identify the most likely breed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink to="/upload" size="lg" icon={Camera}>
              Identify a Breed
            </ButtonLink>
            <ButtonLink
              to="/#how-it-works"
              size="lg"
              variant="outline"
              iconRight={ArrowDown}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('how-it-works')
              }}
            >
              How It Works
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <ScanSearch className="h-4 w-4 text-forest" aria-hidden="true" />
              Instant analysis
            </span>
            <span className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4 text-forest" aria-hidden="true" />
              No sign-up needed
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-forest" aria-hidden="true" />
              Cows & buffaloes
            </span>
          </div>
        </div>

        <div className="animate-fade-up lg:justify-self-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
