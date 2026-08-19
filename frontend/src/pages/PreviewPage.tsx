import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ScanSearch } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { ImagePreview } from '../components/ImagePreview'
import { FileError } from '../components/FileError'
import { Button } from '../components/ui/Button'
import { useAnalysis } from '../context/AnalysisContext'

export function PreviewPage() {
  const { image, setImage, clearImage } = useAnalysis()
  const [replaceError, setReplaceError] = useState<{ title: string; message: string } | null>(null)
  const navigate = useNavigate()

  if (!image) {
    return <Navigate to="/upload" replace />
  }

  const handleAnalyze = () => {
    navigate('/analyze')
  }

  return (
    <AppShell>
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sage-light/50 hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to upload
          </button>

          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Review Your Image
          </h1>
          <p className="mt-2 text-ink-soft">
            If the animal is clearly visible, continue to AI analysis.
          </p>

          {replaceError && (
            <div className="mt-6">
              <FileError
                title={replaceError.title}
                message={replaceError.message}
                onDismiss={() => setReplaceError(null)}
              />
            </div>
          )}

          <div className="mt-6">
            <ImagePreview
              image={image}
              onRemove={() => {
                clearImage()
                navigate('/upload')
              }}
              onReplace={(nextImage) => {
                setImage(nextImage)
              }}
              onReject={(title, message) => setReplaceError({ title, message })}
            />
          </div>

          <div className="mt-6">
            <Button
              size="lg"
              fullWidth
              icon={ScanSearch}
              onClick={handleAnalyze}
              aria-label="Analyze breed with AI"
            >
              Analyze Breed
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  )
}