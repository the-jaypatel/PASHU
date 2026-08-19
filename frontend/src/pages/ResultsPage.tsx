import { Navigate, useNavigate } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { Camera, CheckCircle2, HelpCircle, ScanSearch, TriangleAlert } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { TopPredictions } from '../components/TopPredictions'
import { BreedInfoCard } from '../components/BreedInfoCard'
import { ConfidenceGauge } from '../components/ConfidenceGauge'
import { ErrorState } from '../components/ErrorState'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { useAnalysis } from '../context/AnalysisContext'
import type { ConfidenceLevel } from '../types/prediction'

const LEVEL_META: Record<ConfidenceLevel, { badge: ComponentProps<typeof Badge>['tone']; label: string; message: string }> = {
  high: { badge: 'forest', label: 'High confidence', message: 'The AI is highly confident in this prediction.' },
  medium: {
    badge: 'amber',
    label: 'Medium confidence',
    message: 'The result appears likely, but manual verification is recommended.',
  },
  low: { badge: 'red', label: 'Low confidence', message: 'The prediction has low confidence. Try uploading a clearer image.' },
}

function ConfidenceNote({ level }: { level: ConfidenceLevel }) {
  const meta = LEVEL_META[level]
  const toneClasses =
    level === 'high'
      ? 'bg-forest/[0.05] text-forest'
      : level === 'medium'
        ? 'bg-amber-50 text-amber-900'
        : 'bg-red-50 text-red-800'

  return (
    <p className={`flex items-start gap-2 rounded-xl p-4 text-sm font-medium ${toneClasses}`}>
      {level === 'high' ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      ) : level === 'medium' ? (
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      ) : (
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      )}
      {meta.message}
    </p>
  )
}

export function ResultsPage() {
  const { image, prediction, error, reset } = useAnalysis()
  const navigate = useNavigate()

  if (error === 'analysis-failed') {
    return (
      <AppShell>
        <section className="container-page py-16">
          <ErrorState
            onRetry={() => navigate('/analyze')}
            onNewUpload={() => {
              reset()
              navigate('/upload')
            }}
          />
        </section>
      </AppShell>
    )
  }

  if (!image || !prediction) {
    return <Navigate to="/upload" replace />
  }

  const { predictedBreed: result, level, topPredictions, breedInfo } = prediction
  const meta = LEVEL_META[level]

  const handleAnalyzeAnother = () => {
    reset()
    navigate('/upload')
  }

  return (
    <AppShell>
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-earth">
              <ScanSearch className="h-4 w-4" aria-hidden="true" />
              Analysis Complete
            </span>
          </div>

          {level === 'low' ? (
            <div className="animate-fade-up mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                We couldn't confidently identify this breed.
              </h1>
              <p className="mt-2 text-ink-soft">
                Try uploading a clearer image with the animal fully visible.
              </p>
              <div className="mt-5">
                <ConfidenceNote level={level} />
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink to="/upload" onClick={handleAnalyzeAnother} icon={Camera}>
                  Upload a Clearer Image
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {level !== 'low' && (
            <div className="surface-card animate-fade-up mt-5 overflow-hidden">
              <div className="flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                    Predicted Breed
                  </p>
                  <h1 className="mt-1 font-display text-5xl font-extrabold tracking-tight text-forest sm:text-6xl">
                    {result}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    <Badge tone="sage">{breedInfo.type}</Badge>
                    <Badge tone={meta.badge}>{meta.label}</Badge>
                  </div>
                </div>
                <ConfidenceGauge value={prediction.confidence} />
              </div>
              <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                <ConfidenceNote level={level} />
              </div>
            </div>
          )}

          <div className="mt-10 animate-fade-up">
            <TopPredictions predictions={topPredictions} />
          </div>

          <div className="mt-10 animate-fade-up">
            <BreedInfoCard breed={breedInfo} />
          </div>

          <div className="mt-10 animate-fade-up text-center">
            <ButtonLink
              to="/upload"
              onClick={handleAnalyzeAnother}
              size="lg"
              icon={ScanSearch}
            >
              Analyze Another Image
            </ButtonLink>
            <p className="mt-3 text-xs text-ink-muted">
              This will clear the current image and start fresh.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}