import { BrainCircuit, BadgeCheck } from 'lucide-react'
import { CowSilhouette } from './ui/CowSilhouette'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function HeroVisual() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-sage/40 via-cream to-earth/15 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-forest to-forest-dark shadow-float">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-sage-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            AI Breed Scanner
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sage-light">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            On-device vision
          </span>
        </div>

        <div className="relative mx-6 mb-6 overflow-hidden rounded-2xl border border-white/15 bg-forest-dark/60 sm:mx-8">
          <div className="relative aspect-[4/3] w-full">
            <CowSilhouette
              className="h-full w-full object-contain p-6 sm:p-8"
              primary="#F6F3EA"
              secondary="#7E8D78"
            />

            {!reducedMotion && (
              <div
                className="pointer-events-none absolute inset-x-0 h-[3px] animate-scan-sweep bg-gradient-to-r from-transparent via-emerald-200/90 to-transparent"
                style={{ boxShadow: '0 0 18px rgba(167, 243, 208, 0.55)' }}
                aria-hidden="true"
              />
            )}

            <span
              className="absolute h-3 w-3 rounded-full bg-emerald-300"
              style={{ left: '18%', top: '62%', boxShadow: '0 0 12px rgba(110, 231, 183, 0.9)' }}
              aria-hidden="true"
            />
            <span
              className="absolute h-3 w-3 rounded-full bg-emerald-300"
              style={{ right: '22%', top: '48%', boxShadow: '0 0 12px rgba(110, 231, 183, 0.9)' }}
              aria-hidden="true"
            />
          </div>

          <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-emerald-200/70" aria-hidden="true" />
          <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-emerald-200/70" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-emerald-200/70" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-emerald-200/70" aria-hidden="true" />
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-3 px-6 pb-6 sm:px-8">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-forest">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Gir</p>
              <p className="text-xs text-sage-light">Cow · Gujarat, India</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
            <p className="font-display text-xl font-extrabold text-white">94.2%</p>
            <p className="text-xs text-sage-light">confidence</p>
          </div>
        </div>
      </div>
    </div>
  )
}
