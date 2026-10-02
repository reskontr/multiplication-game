import type { DelayMode, Table } from './types'

export const DEFAULT_SELECTED_TABLES: Table[] = [2, 3, 4, 5]

export const DEFAULT_TIMEOUT_SECONDS = 10
export const MIN_TIMEOUT_SECONDS = 3
export const MAX_TIMEOUT_SECONDS = 30

export const DEFAULT_MASTERY_TARGET = 3
export const MIN_MASTERY_TARGET = 1
export const MAX_MASTERY_TARGET = 10

export const DEFAULT_DELAY_MODE: DelayMode = 'normal'
export const FEEDBACK_DELAYS_MS: Record<DelayMode, { correct: number; incorrect: number }> = {
  slow: { correct: 2000, incorrect: 4000 },
  normal: { correct: 1000, incorrect: 2000 },
  fast: { correct: 500, incorrect: 1000 },
}
