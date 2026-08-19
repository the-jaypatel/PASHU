import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Prediction, UploadedImage } from '../types/prediction'

export type AnalysisErrorCode =
  | 'analysis-failed'
  | 'not-bovine'
  | 'invalid-image'

interface AnalysisContextValue {
  image: UploadedImage | null
  prediction: Prediction | null
  error: AnalysisErrorCode | null
  errorMessage: string | null

  setImage: (image: UploadedImage) => void
  clearImage: () => void
  setPrediction: (prediction: Prediction | null) => void

  setError: (
    error: AnalysisErrorCode | null,
    message?: string,
  ) => void

  reset: () => void
}

const AnalysisContext =
  createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({
  children,
}: {
  children: ReactNode
}) {
  const [image, setImageState] =
    useState<UploadedImage | null>(null)

  const [prediction, setPrediction] =
    useState<Prediction | null>(null)

  const [error, setErrorState] =
    useState<AnalysisErrorCode | null>(null)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  const urlRef = useRef<string | null>(null)

  const releaseUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const setImage = useCallback(
    (nextImage: UploadedImage) => {
      releaseUrl()

      urlRef.current = nextImage.url

      setImageState(nextImage)
      setPrediction(null)
      setErrorState(null)
      setErrorMessage(null)
    },
    [releaseUrl],
  )

  const clearImage = useCallback(() => {
    releaseUrl()

    setImageState(null)
    setPrediction(null)
    setErrorState(null)
    setErrorMessage(null)
  }, [releaseUrl])

  const setError = useCallback(
    (
      nextError: AnalysisErrorCode | null,
      message?: string,
    ) => {
      setErrorState(nextError)
      setErrorMessage(message ?? null)
    },
    [],
  )

  const reset = useCallback(() => {
    clearImage()
  }, [clearImage])

  const value = useMemo(
    () => ({
      image,
      prediction,
      error,
      errorMessage,
      setImage,
      clearImage,
      setPrediction,
      setError,
      reset,
    }),
    [
      image,
      prediction,
      error,
      errorMessage,
      setImage,
      clearImage,
      setPrediction,
      setError,
      reset,
    ],
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis(): AnalysisContextValue {
  const context = useContext(AnalysisContext)

  if (!context) {
    throw new Error(
      'useAnalysis must be used within an AnalysisProvider',
    )
  }

  return context
}