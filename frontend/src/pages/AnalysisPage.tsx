import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { AnalysisScanner } from '../components/AnalysisScanner'
import { AnalysisStep } from '../components/AnalysisStep'
import { ANALYSIS_STEPS } from '../data/steps'
import { analyzeBreed } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'
import type { AnalysisProgress } from '../types/prediction'

function getStepStatus(index: number, activeIndex: number) {
  if (index < activeIndex) return 'completed' as const
  if (index === activeIndex) return 'active' as const
  return 'pending' as const
}

export function AnalysisPage() {
  const { image, setPrediction, setError } = useAnalysis()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!image) return

    let cancelled = false

    const onProgress = ({ progress: value, stepIndex }: AnalysisProgress) => {
      if (cancelled) return
      setProgress(value)
      setActiveStep(stepIndex)
    }

    analyzeBreed(image, onProgress)
      .then((prediction) => {
        if (cancelled) return
        setPrediction(prediction)
        navigate('/results')
      })
      .catch(() => {
        if (cancelled) return
        setError('analysis-failed')
        navigate('/results')
      })

    return () => {
      cancelled = true
    }
  }, [image, setPrediction, setError, navigate])

  if (!image) {
    return <Navigate to="/upload" replace />
  }

  return (
    <AppShell>
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Analyzing Your Image
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-ink-soft">
              Our AI is examining the animal's visual characteristics and comparing them with
              known Indian bovine breeds.
            </p>
          </div>

          <div className="mt-8">
            <AnalysisScanner image={image} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_16rem]">
            <ul className="surface-card space-y-4 p-6">
              {ANALYSIS_STEPS.map((step, index) => (
                <AnalysisStep
                  key={step.key}
                  label={step.label}
                  status={getStepStatus(index, activeStep)}
                />
              ))}
            </ul>

            <div className="surface-card flex flex-col items-center justify-center p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-earth">Progress</p>
              <p
                className="mt-2 font-display text-4xl font-extrabold text-forest"
                aria-live="polite"
              >
                {Math.round(progress)}
                <span className="text-xl text-forest/60">%</span>
              </p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Analysis progress"
                className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-sage-light/60"
              >
                <div
                  className="h-full rounded-full bg-forest transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-center text-xs text-ink-muted">
                This may take a few seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}