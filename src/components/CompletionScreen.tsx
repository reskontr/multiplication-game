import { RotateCcw, Settings2 } from 'lucide-react'
import type { GameSession, Language } from '../game/types'
import { useTranslation } from '../i18n/useTranslation'

interface CompletionScreenProps {
  language: Language
  session: GameSession
  onReplay: () => void
  onSetup: () => void
}

export function CompletionScreen({ language, session, onReplay, onSetup }: CompletionScreenProps) {
  const { t } = useTranslation(language)

  return (
    <main className="completion-screen">
      <section className="completion-card" aria-labelledby="completion-title">
        <h1 id="completion-title">{t('completeTitle', { name: session.playerName })}</h1>
        <div className="completion-stats">
          <div><strong>{session.facts.length}</strong><span>{t('factsDone')}</span></div>
          <div><strong>{session.totalAttempts}</strong><span>{t('attempts')}</span></div>
        </div>
        <div className="completion-actions">
          <button className="primary-button" type="button" onClick={onReplay}>
            <RotateCcw size={20} />
            <span>{t('playAgain')}</span>
          </button>
          <button className="secondary-button" type="button" onClick={onSetup}>
            <Settings2 size={19} />
            <span>{t('backToSetup')}</span>
          </button>
        </div>
      </section>
    </main>
  )
}
