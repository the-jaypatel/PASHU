import { AlertCircle, RefreshCw, ImagePlus } from 'lucide-react'
import { Button } from './ui/Button'

interface ErrorStateProps {
  onRetry: () => void
  onNewUpload: () => void
}

export function ErrorState({ onRetry, onNewUpload }: ErrorStateProps) {
  return (
    <div className="surface-card mx-auto max-w-xl p-8 text-center sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">
        Unable to Analyze Image
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">
        We couldn't complete the breed analysis. Please try again with a clearer image.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
        <Button variant="outline" icon={ImagePlus} onClick={onNewUpload}>
          Upload Another Image
        </Button>
      </div>
    </div>
  )
}