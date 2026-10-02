import { Check, Clock3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import type { GameSession, Language } from '../game/types'
import { useTranslation } from '../i18n/useTranslation'
import { CategoryMastery } from './CategoryMastery'

interface GameScreenProps {
  language: Language
  session: GameSession
  remainingSeconds: number
  remainingProgress: number
  onAnswer: (answer: number) => void
}

export function GameScreen({
  language,
  session,
  remainingSeconds,
  remainingProgress,
  onAnswer,
}: GameScreenProps) {
  const { t } = useTranslation(language)
  const [answer, setAnswer] = useState('')
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fact = session.currentFact

  useEffect(() => {
    setAnswer('')
    setInvalid(false)
    const focusId = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(focusId)
  }, [fact?.id])

  if (!fact) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedAnswer = answer.trim()
    if (!/^\d+$/.test(normalizedAnswer)) {
      setInvalid(true)
      return
    }

    onAnswer(Number(normalizedAnswer))
  }

  const timerStyle = { '--timer-progress': `${remainingProgress}%` } as CSSProperties

  return (
    <main className="game-screen">
      <CategoryMastery
        language={language}
        tables={session.settings.selectedTables}
        facts={session.facts}
        mastery={session.mastery}
        masteryTarget={session.settings.masteryTarget}
      />

      <section className="question-stage" aria-labelledby="question-title">
        <div className={`timer-card${remainingSeconds <= 2 ? ' urgent' : ''}`} style={timerStyle}>
          <div className="timer-icon"><Clock3 size={20} strokeWidth={2.4} /></div>
          <div>
            <span>{t('timeLeft')}</span>
            <strong aria-label={t('timeAria', { seconds: remainingSeconds })}>
              {remainingSeconds}<small>{t('secondsShort')}</small>
            </strong>
          </div>
          <div className="timer-line" aria-hidden="true" />
        </div>

        <h1
          id="question-title"
          className="question-prompt"
          aria-label={t('questionAria', { table: fact.table, multiplier: fact.multiplier })}
        >
          <span>{fact.table}</span>
          <b>×</b>
          <span>{fact.multiplier}</span>
          <b>=</b>
          <span className="question-mark">?</span>
        </h1>

        <form className="answer-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="answer-input">{t('answerAria')}</label>
          <input
            ref={inputRef}
            id="answer-input"
            className={`answer-input${invalid ? ' invalid' : ''}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={3}
            value={answer}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'answer-error' : undefined}
            placeholder={t('answerPlaceholder')}
            onChange={(event) => {
              setAnswer(event.target.value.replace(/[^0-9]/g, ''))
              setInvalid(false)
            }}
          />
          <button className="answer-button" type="submit">
            <Check size={23} strokeWidth={2.8} />
            <span>{t('check')}</span>
          </button>
        </form>
        <div className="answer-error" id="answer-error" aria-live="polite">
          {invalid ? t('invalidAnswer') : ''}
        </div>
      </section>
    </main>
  )
}
