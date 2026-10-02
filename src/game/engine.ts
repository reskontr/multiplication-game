import type {
  Fact,
  FactId,
  GameAction,
  GameSession,
  GameSettings,
  Table,
} from './types'

export const TABLES: Table[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function createFacts(selectedTables: Table[]): Fact[] {
  return selectedTables.flatMap((table) =>
    Array.from({ length: 10 }, (_, index) => {
      const multiplier = index + 1
      return {
        id: `${table}x${multiplier}` as FactId,
        table,
        multiplier,
        answer: table * multiplier,
      }
    }),
  )
}

export function createMastery(facts: Fact[]): Record<FactId, number> {
  return facts.reduce<Record<FactId, number>>((result, fact) => {
    result[fact.id] = 0
    return result
  }, {})
}

export function chooseNextFact(
  facts: Fact[],
  mastery: Record<FactId, number>,
  target: number,
  previousFactId?: FactId,
  random = Math.random,
): Fact | null {
  const unfinishedFacts = facts.filter((fact) => mastery[fact.id] < target)
  if (unfinishedFacts.length === 0) {
    return null
  }

  const alternatives = unfinishedFacts.filter((fact) => fact.id !== previousFactId)
  const choices = alternatives.length > 0 ? alternatives : unfinishedFacts
  return choices[Math.floor(random() * choices.length)]
}

export function createSession(settings: GameSettings, random = Math.random): GameSession {
  const facts = createFacts(settings.selectedTables)
  const mastery = createMastery(facts)

  return {
    phase: 'playing',
    playerName: settings.playerName,
    settings,
    facts,
    mastery,
    currentFact: chooseNextFact(facts, mastery, settings.masteryTarget, undefined, random),
    lastFeedback: null,
    masteredCount: 0,
    totalAttempts: 0,
  }
}

function resolveAttempt(
  session: GameSession,
  factId: FactId,
  answer: number | null,
  timedOut: boolean,
): GameSession {
  if (session.phase !== 'playing' || session.currentFact?.id !== factId) {
    return session
  }

  const fact = session.currentFact
  const correct = !timedOut && answer === fact.answer
  const nextStreak = correct ? session.mastery[fact.id] + 1 : 0
  const mastery = { ...session.mastery, [fact.id]: nextStreak }
  const masteredCount = (Object.values(mastery) as number[]).filter(
    (streak) => streak >= session.settings.masteryTarget,
  ).length
  const completed = masteredCount === session.facts.length

  return {
    ...session,
    phase: completed ? 'complete' : 'feedback',
    mastery,
    masteredCount,
    totalAttempts: session.totalAttempts + 1,
    lastFeedback: { fact, correct, timedOut, givenAnswer: answer },
  }
}

export function gameReducer(session: GameSession, action: GameAction): GameSession {
  switch (action.type) {
    case 'ANSWER':
      return resolveAttempt(session, action.factId, action.answer, false)
    case 'TIMEOUT':
      return resolveAttempt(session, action.factId, null, true)
    case 'NEXT': {
      if (session.phase !== 'feedback' || !session.currentFact) {
        return session
      }

      const currentFactId = session.currentFact.id
      return {
        ...session,
        phase: 'playing',
        currentFact: chooseNextFact(
          session.facts,
          session.mastery,
          session.settings.masteryTarget,
          currentFactId,
        ),
        lastFeedback: null,
      }
    }
  }
}
