export interface ValidationResult {
  valid: boolean
  error?: {
    type: 'format' | 'size' | 'read'
    title: string
    message: string
  }
}

export const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_FILE_SIZE = 10 * 1024 * 1024

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_FORMATS.includes(file.type)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateImageFile(file: File): ValidationResult {
  if (!isAcceptedImage(file)) {
    return {
      valid: false,
      error: {
        type: 'format',
        title: 'Unsupported file format',
        message: `"${file.name}" is not supported. Please upload a JPG, JPEG, PNG, or WEBP image.`,
      },
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: {
        type: 'size',
        title: 'File is too large',
        message: `"${file.name}" is ${formatFileSize(file.size)}. The maximum allowed size is 10 MB.`,
      },
    }
  }

  return { valid: true }
}
