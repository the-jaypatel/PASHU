export const ANALYSIS_STEPS = [
  { key: 'detect', label: 'Detecting animal' },
  { key: 'features', label: 'Identifying visual characteristics' },
  { key: 'compare', label: 'Comparing breed patterns' },
  { key: 'predict', label: 'Generating prediction' },
] as const

export const STEP_LABELS = ANALYSIS_STEPS.map((step) => step.label)
