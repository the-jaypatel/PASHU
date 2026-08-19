import type {
  AnalysisProgress,
  Prediction,
  UploadedImage,
  AnimalType,
} from '../types/prediction'

import { BREED_INFO } from '../data/breeds'

const API_BASE_URL = 'http://127.0.0.1:8000'

interface BackendPrediction {
  breed: string
  confidence: number
  top_predictions: {
    breed: string
    confidence: number
  }[]
}

interface BackendResponse {
  success: boolean
  is_bovine: boolean
  detected_type?: 'cow' | 'buffalo'
  detector_confidence?: number
  message?: string
  prediction?: BackendPrediction | null
}

function getAnimalType(type?: 'cow' | 'buffalo'): AnimalType {
  return type === 'buffalo' ? 'Buffalo' : 'Cow'
}

function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 75) return 'high'
  if (confidence >= 40) return 'medium'
  return 'low'
}

function getBreedInfo(breedName: string, animalType: AnimalType) {
  const info = BREED_INFO[breedName]

  if (info) {
    return info
  }

  // Fallback in case backend returns a breed
  // that isn't present in the frontend breed database.
  return {
    name: breedName,
    type: animalType,
    origin: 'India',
    primaryUse: 'Cattle / Buffalo',
    description: `AI identified this animal as ${breedName}.`,
    characteristics: [],
    tags: [],
  }
}

/**
 * Convert backend response into the format
 * expected by the existing ResultsPage.
 */
function convertBackendPrediction(
  response: BackendResponse,
): Prediction {
  if (!response.prediction) {
    throw new Error(response.message || 'No prediction returned.')
  }

  const backendPrediction = response.prediction

  const animalType = getAnimalType(response.detected_type)

  const confidence = backendPrediction.confidence * 100

  const topPredictions = backendPrediction.top_predictions.map((item) => ({
    breed: item.breed,
    type: animalType,
    confidence: item.confidence * 100,
  }))

  const breedInfo = getBreedInfo(
    backendPrediction.breed,
    animalType,
  )

  return {
    predictedBreed: backendPrediction.breed,
    animalType,
    confidence,
    level: getConfidenceLevel(confidence),
    topPredictions,
    breedInfo,
  }
}

/**
 * Sends the uploaded image to the real PASHU FastAPI backend.
 */
export async function analyzeBreed(
  image: UploadedImage,
  onProgress: (progress: AnalysisProgress) => void,
): Promise<Prediction> {

  onProgress({
    progress: 10,
    stepIndex: 0,
  })

  const formData = new FormData()

  formData.append('image', image.file)

  onProgress({
    progress: 25,
    stepIndex: 0,
  })

  const response = await fetch(
    `${API_BASE_URL}/api/predict`,
    {
      method: 'POST',
      body: formData,
    },
  )

  onProgress({
    progress: 55,
    stepIndex: 1,
  })

  if (!response.ok) {
    throw new Error(
      `Backend request failed: ${response.status}`,
    )
  }

  const data: BackendResponse = await response.json()

  onProgress({
    progress: 80,
    stepIndex: 2,
  })

  /*
   * IMPORTANT:
   * Backend successfully received the image,
   * but YOLO determined that it isn't a cow/buffalo.
   */
  if (!data.is_bovine) {
    throw new Error(
      data.message ||
        'No cow or buffalo detected. Please upload a clear image containing a cow or buffalo.',
    )
  }

  if (!data.prediction) {
    throw new Error(
      data.message || 'No breed prediction returned.',
    )
  }

  const prediction = convertBackendPrediction(data)

  onProgress({
    progress: 100,
    stepIndex: 3,
  })

  return prediction
}