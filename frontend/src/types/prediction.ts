export type AnimalType = 'Cow' | 'Buffalo'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface BreedPrediction {
  breed: string
  type: AnimalType
  confidence: number
}

export interface BreedInfo {
  name: string
  type: AnimalType
  origin: string
  primaryUse: string
  description: string
  characteristics: string[]
  tags: string[]
}

export interface Prediction {
  predictedBreed: string
  animalType: AnimalType
  confidence: number
  level: ConfidenceLevel
  topPredictions: BreedPrediction[]
  breedInfo: BreedInfo
}

export interface UploadedImage {
  file: File
  url: string
  name: string
  size: number
  type: string
}

export interface AnalysisProgress {
  progress: number
  stepIndex: number
}
