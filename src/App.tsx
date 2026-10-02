import { CircleStop, Globe2 } from 'lucide-react'
import { useEffect, useReducer, useState } from 'react'
import { CompletionScreen } from './components/CompletionScreen'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { GameScreen } from './components/GameScreen'
import { SetupScreen } from './components/SetupScreen'
import { FEEDBACK_DELAYS_MS } from './game/config'
import { createSession, gameReducer } from './game/engine'
import type { GameAction, GameSession, GameSettings, Language } from './game/types'
import { getInitialLanguage } from './i18n/translations'
import { useTranslation } from './i18n/useTranslation'
import { useCountdown } from './hooks/useCountdown'
import './App.css'

type AppAction =
  | { type: 'START'; settings: GameSettings }
  | { type: 'RESET' }
  | GameAction

function appReducer(session: GameSession | null, action: AppAction): GameSession | null {
  if (action.type === 'START') {
    return createSession(action.settings)
  }

  if (action.type === 'RESET') {
    return null
  }

  return session ? gameReducer(session, action) : session
}

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [session, dispatch] = useReducer(appReducer, null)
  const [pendingSettings, setPendingSettings] = useState<GameSettings | null>(null)
  const [startCount, setStartCount] = useState<number | null>(null)
  const { t } = useTranslation(language)

  useEffect(() => {
    window.localStorage.setItem('kertotaulupeli-language', language)
    document.documentElement.lang = language
    document.title = t('appName')
  }, [language, t])

  useEffect(() => {
    if (startCount === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (startCount === 1) {
        if (pendingSettings) {
          dispatch({ type: 'START', settings: pendingSettings })
        }
        setPendingSettings(null)
        setStartCount(null)
        return
      }

      setStartCount((current) => (current === null ? null : current - 1))
    }, 1000)
    return () => window.clearTimeout(timeoutId)
  }, [pendingSettings, startCount])

  useEffect(() => {
    if (session?.phase !== 'feedback' || !session.lastFeedback) {
      return
    }

    const delays = FEEDBACK_DELAYS_MS[session.settings.delayMode]
    const delay = session.lastFeedback.correct ? delays.correct : delays.incorrect
    const timeoutId = window.setTimeout(() => dispatch({ type: 'NEXT' }), delay)
    return () => window.clearTimeout(timeoutId)
  }, [session])

  const currentFactId = session?.phase === 'playing' ? session.currentFact?.id ?? null : null
  const handleTimeout = () => {
    if (session?.phase === 'playing' && session.currentFact) {
      dispatch({ type: 'TIMEOUT', factId: session.currentFact.id })
    }
  }
  const countdown = useCountdown({
    durationSeconds: session?.settings.timeoutSeconds ?? 10,
    active: session?.phase === 'playing' && currentFactId !== null,
    resetKey: currentFactId,
    onTimeout: handleTimeout,
  })

  const startGame = (settings: GameSettings) => {
    setPendingSettings(settings)
    setStartCount(3)
  }
  const resetGame = () => {
    setPendingSettings(null)
    setStartCount(null)
    dispatch({ type: 'RESET' })
  }
  const replayGame = () => {
    if (session) {
      startGame(session.settings)
    }
  }

  return (
    <div className="app-frame">
      <header className="app-header">
        <button className="brand-lockup" type="button" onClick={session ? resetGame : undefined}>
          <span>{t('appName')}</span>
        </button>
        <div className="header-actions">
          {session && (
            <button
              className="header-action stop-button"
              type="button"
              title={t('stop')}
              aria-label={t('stop')}
              onClick={resetGame}
            >
              <CircleStop size={17} />
              <span>{t('stop')}</span>
            </button>
          )}
          <div className="language-picker" role="group" aria-label={t('language')}>
            <Globe2 size={16} />
            <button
              className={language === 'fi' ? 'active' : ''}
              type="button"
              aria-pressed={language === 'fi'}
              onClick={() => setLanguage('fi')}
            >
              FI
            </button>
            <button
              className={language === 'en' ? 'active' : ''}
              type="button"
              aria-pressed={language === 'en'}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {!session && <SetupScreen language={language} onStart={startGame} />}
      {session?.phase === 'playing' && (
        <GameScreen
          language={language}
          session={session}
          remainingSeconds={countdown.remainingSeconds}
          remainingProgress={countdown.progress}
          onAnswer={(answer) => {
            if (session.currentFact) {
              dispatch({ type: 'ANSWER', factId: session.currentFact.id, answer })
            }
          }}
        />
      )}
      {session?.phase === 'feedback' && session.lastFeedback && (
        <FeedbackOverlay language={language} feedback={session.lastFeedback} />
      )}
      {session?.phase === 'complete' && (
        <CompletionScreen language={language} session={session} onReplay={replayGame} onSetup={resetGame} />
      )}
      {startCount !== null && (
        <div
          className="start-countdown"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          aria-label={t('countdownAria', { count: startCount })}
        >
          <strong key={startCount} aria-hidden="true">{startCount}</strong>
        </div>
      )}
    </div>
  )
}

export default App
