import type { Language } from '../game/types'

export const translations = {
  fi: {
    appName: 'Kertotaulupeli',
    playerName: 'Nimi',
    namePlaceholder: 'Pelaajan nimi',
    tables: 'Taulut',
    selectAll: 'Kaikki',
    clearAll: 'Tyhjennä',
    selected: '{count} valittu',
    answerTime: 'Vastausaika',
    masteryTarget: 'Oikeita vastauksia putkeen',
    feedbackDelay: 'Palautteen viive',
    slow: 'Hidas',
    normal: 'Normaali',
    fast: 'Nopea',
    secondsShort: 's',
    start: 'Aloita peli',
    check: 'Tarkista',
    timeLeft: 'Aikaa',
    questionAria: 'Kysymys {table} kertaa {multiplier}',
    answerAria: 'Vastaus',
    answerPlaceholder: '?',
    invalidAnswer: 'Anna luku',
    correct: 'Jes!',
    tryAgain: 'Yritä uudelleen',
    timeout: 'Aika loppui!',
    correctAnswer: '{table} × {multiplier} = {answer}',
    completeTitle: 'Mahtavaa, {name}!',
    factsDone: 'tehtävää',
    attempts: 'vastausta',
    playAgain: 'Uudestaan',
    backToSetup: 'Asetukset',
    stop: 'Lopeta',
    language: 'Kieli',
    finnish: 'Suomi',
    english: 'English',
    categoryAria: 'Taulu {table}, valmiina {done} / {total}',
    timeAria: 'Aikaa jäljellä {seconds} sekuntia',
    countdownAria: 'Peli alkaa luvulla {count}',
  },
  en: {
    appName: 'Multiplication game',
    playerName: 'Name',
    namePlaceholder: 'Player name',
    tables: 'Tables',
    selectAll: 'All',
    clearAll: 'Clear',
    selected: '{count} selected',
    answerTime: 'Answer time',
    masteryTarget: 'Consecutive correct answers',
    feedbackDelay: 'Feedback delay',
    slow: 'Slow',
    normal: 'Normal',
    fast: 'Fast',
    secondsShort: 's',
    start: 'Start game',
    check: 'Check',
    timeLeft: 'Time',
    questionAria: 'Question {table} times {multiplier}',
    answerAria: 'Answer',
    answerPlaceholder: '?',
    invalidAnswer: 'Enter a number',
    correct: 'Yes!',
    tryAgain: 'Keep going!',
    timeout: 'Time!',
    correctAnswer: '{table} × {multiplier} = {answer}',
    completeTitle: 'Amazing, {name}!',
    factsDone: 'facts',
    attempts: 'answers',
    playAgain: 'Again',
    backToSetup: 'Settings',
    stop: 'Stop',
    language: 'Language',
    finnish: 'Suomi',
    english: 'English',
    categoryAria: 'Table {table}, done {done} of {total}',
    timeAria: '{seconds} seconds left',
    countdownAria: 'Game starts at {count}',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function translate(
  language: Language,
  key: TranslationKey,
  values: Record<string, number | string> = {},
): string {
  return translations[language][key].replace(/\{(\w+)\}/g, (_, name: string) =>
    String(values[name] ?? `{${name}}`),
  )
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const saved = window.localStorage.getItem('kertotaulupeli-language')
  if (saved === 'fi' || saved === 'en') {
    return saved
  }

  return navigator.language.toLowerCase().startsWith('fi') ? 'fi' : 'en'
}
