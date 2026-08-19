import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { FileImage, RefreshCw, Trash2 } from 'lucide-react'
import type { UploadedImage } from '../types/prediction'
import { formatFileSize, validateImageFile } from '../utils/validation'

interface ImagePreviewProps {
  image: UploadedImage
  onRemove: () => void
  onReplace: (image: UploadedImage) => void
  onReject: (title: string, message: string) => void
}

export function ImagePreview({ image, onRemove, onReplace, onReject }: ImagePreviewProps) {
  const replaceInputRef = useRef<HTMLInputElement>(null)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = validateImageFile(file)
    if (result.valid) {
      onReplace({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      })
    } else if (result.error) {
      onReject(result.error.title, result.error.message)
    }
    event.target.value = ''
  }

  return (
    <div className="surface-card overflow-hidden">
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onInputChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="bg-cream-dark/50 p-4 sm:p-6">
        <div className="mx-auto max-h-[26rem] max-w-2xl overflow-hidden rounded-xl border border-sage/30 bg-white shadow-card">
          <img
            src={image.url}
            alt="Uploaded cow or buffalo to be analyzed"
            className="mx-auto max-h-[26rem] w-auto object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-sage/20 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-light text-forest">
            <FileImage className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink" title={image.name}>
              {image.name}
            </p>
            <p className="text-xs text-ink-muted">
              {formatFileSize(image.size)} · ready for analysis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-forest/30 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-cream"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Replace Image
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove Image
          </button>
        </div>
      </div>
    </div>
  )
}
