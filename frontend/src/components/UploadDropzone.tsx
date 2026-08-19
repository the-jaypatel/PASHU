import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FolderOpen, ImagePlus, UploadCloud } from 'lucide-react'
import type { UploadedImage } from '../types/prediction'
import { validateImageFile } from '../utils/validation'
import type { ValidationResult } from '../utils/validation'
import { useAnalysis } from '../context/AnalysisContext'
import { FileError } from './FileError'

interface FileErrorState {
  title: string
  message: string
}

function fileToUploadedImage(file: File): UploadedImage {
  return {
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<FileErrorState | null>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { setImage } = useAnalysis()

  const handleValidationResult = (result: ValidationResult, file: File) => {
    if (result.valid) {
      setImage(fileToUploadedImage(file))
      navigate('/preview')
    } else if (result.error) {
      setError({ title: result.error.title, message: result.error.message })
    }
  }

  const handleFile = (file: File) => {
    handleValidationResult(validateImageFile(file), file)
  }

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    handleFile(files[0])
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(event.target.files)
    event.target.value = ''
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    onFiles(event.dataTransfer.files)
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className="space-y-5">
      {error && (
        <FileError
          title={error.title}
          message={error.message}
          onDismiss={() => setError(null)}
        />
      )}

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        aria-label="Upload an image of a cow or buffalo"
        onClick={() => galleryInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`group cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
          isDragging
            ? 'border-forest bg-forest/5'
            : 'border-sage/60 bg-white hover:border-forest/50 hover:bg-cream'
        }`}
      >
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-card transition-colors sm:h-20 sm:w-20 ${
            isDragging ? 'bg-forest-dark' : 'bg-forest group-hover:bg-forest-light'
          }`}
        >
          {isDragging ? (
            <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
          )}
        </span>

        <p className="mt-5 font-display text-lg font-bold text-ink sm:text-xl">
          {isDragging ? 'Drop it here' : 'Drag and drop your cattle image here'}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          or use one of the options below
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              cameraInputRef.current?.click()
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-base font-semibold text-white shadow-card transition-all hover:bg-forest-dark active:translate-y-px md:hidden"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
            Take a Photo
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              galleryInputRef.current?.click()
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/30 bg-white px-6 py-3.5 text-base font-semibold text-forest transition-all hover:bg-cream active:translate-y-px"
          >
            <FolderOpen className="h-5 w-5" aria-hidden="true" />
            <span className="md:hidden">Choose from Gallery</span>
            <span className="hidden md:inline">Choose Image</span>
          </button>
        </div>

        <p className="mt-6 text-xs font-medium text-ink-muted">
          JPG · JPEG · PNG · WEBP — up to 10 MB
        </p>
      </div>
    </div>
  )
}
