import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import type { DelayMode, GameSettings, Language, Table } from '../game/types'
import { TABLES } from '../game/engine'
import {
  DEFAULT_MASTERY_TARGET,
  DEFAULT_DELAY_MODE,
  DEFAULT_SELECTED_TABLES,
  DEFAULT_TIMEOUT_SECONDS,
  MAX_MASTERY_TARGET as MAX_MASTERY,
  MAX_TIMEOUT_SECONDS as MAX_TIMEOUT,
  MIN_MASTERY_TARGET as MIN_MASTERY,
  MIN_TIMEOUT_SECONDS as MIN_TIMEOUT,
} from '../game/config'
import { useTranslation } from '../i18n/useTranslation'

interface SetupScreenProps {
  language: Language
  onStart: (settings: GameSettings) => void
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function SetupScreen({ language, onStart }: SetupScreenProps) {
  const { t } = useTranslation(language)
  const [name, setName] = useState('')
  const [selectedTables, setSelectedTables] = useState<Table[]>(DEFAULT_SELECTED_TABLES)
  const [timeoutSeconds, setTimeoutSeconds] = useState(DEFAULT_TIMEOUT_SECONDS)
  const [timeoutText, setTimeoutText] = useState(String(DEFAULT_TIMEOUT_SECONDS))
  const [masteryTarget, setMasteryTarget] = useState(DEFAULT_MASTERY_TARGET)
  const [masteryText, setMasteryText] = useState(String(DEFAULT_MASTERY_TARGET))
  const [delayMode, setDelayMode] = useState<DelayMode>(DEFAULT_DELAY_MODE)

  const updateTimeout = (value: number) => {
    const safeValue = clamp(value, MIN_TIMEOUT, MAX_TIMEOUT)
    setTimeoutSeconds(safeValue)
    setTimeoutText(String(safeValue))
  }

  const updateMastery = (value: number) => {
    const safeValue = clamp(value, MIN_MASTERY, MAX_MASTERY)
    setMasteryTarget(safeValue)
    setMasteryText(String(safeValue))
  }

  const toggleTable = (table: Table) => {
    setSelectedTables((current) => {
      if (current.includes(table)) {
        return current.filter((selected) => selected !== table)
      }

      return [...current, table].sort((left, right) => left - right)
    })
  }

  const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || selectedTables.length === 0) {
      return
    }

    onStart({
      playerName: trimmedName,
      selectedTables,
      timeoutSeconds,
      masteryTarget,
      delayMode,
    })
  }

  return (
    <main className="setup-screen">

      <form className="setup-form" onSubmit={handleStart}>
        <div className="form-section name-section">
          <label className="field-label" htmlFor="player-name">
            {t('playerName')}
          </label>
          <input
            id="player-name"
            className="text-input"
            type="text"
            value={name}
            maxLength={20}
            autoComplete="nickname"
            placeholder={t('namePlaceholder')}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="form-section">
          <div className="section-heading">
            <span className="field-label">{t('tables')}</span>
            <span className="selection-count">{t('selected', { count: selectedTables.length })}</span>
          </div>
          <div className="table-actions">
            <button type="button" className="text-action" onClick={() => setSelectedTables([...TABLES])}>
              <Check size={15} />
              {t('selectAll')}
            </button>
            <button type="button" className="text-action muted-action" onClick={() => setSelectedTables([])}>
              {t('clearAll')}
            </button>
          </div>
          <div className="table-grid" role="group" aria-label={t('tables')}>
            {TABLES.map((table) => {
              const selected = selectedTables.includes(table)
              return (
                <button
                  key={table}
                  type="button"
                  className={`table-choice${selected ? ' selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => toggleTable(table)}
                >
                  <span>{table}</span>
                  <small>×</small>
                </button>
              )
            })}
          </div>
        </div>

        <div className="settings-row">
          <div className="form-section range-section">
            <div className="section-heading">
              <label className="field-label" htmlFor="timeout-range">{t('answerTime')}</label>
              <div className="number-control">
                <input
                  className="number-input"
                  type="number"
                  min={MIN_TIMEOUT}
                  max={MAX_TIMEOUT}
                  value={timeoutText}
                  aria-label={t('answerTime')}
                  onChange={(event) => {
                    const rawValue = event.target.value
                    setTimeoutText(rawValue)
                    if (/^\d+$/.test(rawValue)) {
                      setTimeoutSeconds(clamp(Number(rawValue), MIN_TIMEOUT, MAX_TIMEOUT))
                    }
                  }}
                  onBlur={() => updateTimeout(Number(timeoutText) || timeoutSeconds)}
                />
                <span>{t('secondsShort')}</span>
              </div>
            </div>
            <input
              id="timeout-range"
              className="range-input"
              type="range"
              min={MIN_TIMEOUT}
              max={MAX_TIMEOUT}
              value={timeoutSeconds}
              onChange={(event) => updateTimeout(Number(event.target.value))}
            />
            <div className="range-ends"><span>{MIN_TIMEOUT}{t('secondsShort')}</span><span>{MAX_TIMEOUT}{t('secondsShort')}</span></div>
          </div>

          <div className="form-section range-section mastery-section">
            <div className="section-heading">
              <label className="field-label" htmlFor="mastery-range">{t('masteryTarget')}</label>
              <div className="number-control">
                <input
                  className="number-input"
                  type="number"
                  min={MIN_MASTERY}
                  max={MAX_MASTERY}
                  value={masteryText}
                  aria-label={t('masteryTarget')}
                  onChange={(event) => {
                    const rawValue = event.target.value
                    setMasteryText(rawValue)
                    if (/^\d+$/.test(rawValue)) {
                      setMasteryTarget(clamp(Number(rawValue), MIN_MASTERY, MAX_MASTERY))
                    }
                  }}
                  onBlur={() => updateMastery(Number(masteryText) || masteryTarget)}
                />
              </div>
            </div>
            <input
              id="mastery-range"
              className="range-input mastery-range"
              type="range"
              min={MIN_MASTERY}
              max={MAX_MASTERY}
              value={masteryTarget}
              onChange={(event) => updateMastery(Number(event.target.value))}
            />
            <div className="range-ends"><span>{MIN_MASTERY}×</span><span>{MAX_MASTERY}×</span></div>
          </div>
        </div>

        <div className="form-section">
          <label className="field-label" htmlFor="delay-mode">{t('feedbackDelay')}</label>
          <select
            id="delay-mode"
            className="text-input"
            value={delayMode}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'slow' || value === 'normal' || value === 'fast') {
                setDelayMode(value)
              }
            }}
          >
            <option value="slow">{t('slow')}</option>
            <option value="normal">{t('normal')}</option>
            <option value="fast">{t('fast')}</option>
          </select>
        </div>

        <button className="primary-button start-button" type="submit" disabled={!name.trim() || selectedTables.length === 0}>
          <span>{t('start')}</span>
          <ArrowRight size={21} strokeWidth={2.5} />
        </button>
      </form>
    </main>
  )
}
