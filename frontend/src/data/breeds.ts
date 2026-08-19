import type { BreedInfo } from '../types/prediction'
import { COW_BREEDS } from './cowBreeds'
import { BUFFALO_BREEDS } from './buffaloBreeds'

export const ALL_BREEDS: BreedInfo[] = [...COW_BREEDS, ...BUFFALO_BREEDS]

export const BREED_INFO: Record<string, BreedInfo> = Object.fromEntries(
  ALL_BREEDS.map((breed) => [breed.name, breed]),
)
