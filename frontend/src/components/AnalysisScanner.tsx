import type { UploadedImage } from '../types/prediction'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface AnalysisScannerProps {
  image: UploadedImage
}

export function AnalysisScanner({ image }: AnalysisScannerProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="surface-card overflow-hidden">
      <div className="relative bg-forest-dark p-3 sm:p-5">
        <div className="relative mx-auto max-h-[24rem] overflow-hidden rounded-xl bg-black/20">
          <img
            src={image.url}
            alt="Animal image being analyzed by AI"
            className="mx-auto max-h-[24rem] w-auto object-contain"
          />

          {!reducedMotion && (
            <div
              className="pointer-events-none absolute inset-x-0 h-[3px] animate-scan-sweep bg-gradient-to-r from-transparent via-emerald-300/90 to-transparent"
              style={{ boxShadow: '0 0 20px rgba(110, 231, 183, 0.5)' }}
              aria-hidden="true"
            />
          )}

          <div className="pointer-events-none absolute left-3 top-3 h-7 w-7 rounded-tl-xl border-l-[3px] border-t-[3px] border-emerald-300/80" aria-hidden="true" />
          <div className="pointer-events-none absolute right-3 top-3 h-7 w-7 rounded-tr-xl border-r-[3px] border-t-[3px] border-emerald-300/80" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-emerald-300/80" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 rounded-br-xl border-b-[3px] border-r-[3px] border-emerald-300/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}