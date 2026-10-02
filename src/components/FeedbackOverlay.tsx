import { CheckCircle2, Clock3, RotateCcw } from 'lucide-react'
import type { Feedback, Language } from '../game/types'
import { useTranslation } from '../i18n/useTranslation'

interface FeedbackOverlayProps {
  language: Language
  feedback: Feedback
}

export function FeedbackOverlay({ language, feedback }: FeedbackOverlayProps) {
  const { t } = useTranslation(language)
  const Icon = feedback.correct ? CheckCircle2 : feedback.timedOut ? Clock3 : RotateCcw
  const title = feedback.correct ? t('correct') : feedback.timedOut ? t('timeout') : t('tryAgain')

  return (
    <main className={`feedback-screen${feedback.correct ? ' is-correct' : ''}`}>
      <section className="feedback-card" role="status" aria-live="assertive">
        <div className="feedback-icon"><Icon size={38} strokeWidth={2.3} /></div>
        <h1>{title}</h1>
        <p>
          {t('correctAnswer', {
            table: feedback.fact.table,
            multiplier: feedback.fact.multiplier,
            answer: feedback.fact.answer,
          })}
        </p>
      </section>
    </main>
  )
}
