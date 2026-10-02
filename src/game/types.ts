export type Language = 'fi' | 'en'

export type Table = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type FactId = `${Table}x${number}`

export interface Fact {
  id: FactId
  table: Table
  multiplier: number
  answer: number
}

export interface GameSettings {
  playerName: string
  selectedTables: Table[]
  timeoutSeconds: number
  masteryTarget: number
}

export type GamePhase = 'setup' | 'playing' | 'feedback' | 'complete'

export interface Feedback {
  fact: Fact
  correct: boolean
  timedOut: boolean
  givenAnswer: number | null
}

export interface GameSession {
  phase: Exclude<GamePhase, 'setup'>
  playerName: string
  settings: GameSettings
  facts: Fact[]
  mastery: Record<FactId, number>
  currentFact: Fact | null
  lastFeedback: Feedback | null
  masteredCount: number
  totalAttempts: number
}

export type GameAction =
  | { type: 'ANSWER'; factId: FactId; answer: number }
  | { type: 'TIMEOUT'; factId: FactId }
  | { type: 'NEXT' }
