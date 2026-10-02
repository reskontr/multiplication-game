import { Check } from 'lucide-react'
import type { Fact, FactId, Table } from '../game/types'
import type { Language } from '../game/types'
import { useTranslation } from '../i18n/useTranslation'

interface CategoryMasteryProps {
  language: Language
  tables: Table[]
  facts: Fact[]
  mastery: Record<FactId, number>
  masteryTarget: number
}

export function CategoryMastery({ language, tables, facts, mastery, masteryTarget }: CategoryMasteryProps) {
  const { t } = useTranslation(language)

  const categories = tables.map((table) => {
    const tableFacts = facts.filter((fact) => fact.table === table)
    const masteredCount = tableFacts.filter((fact) => mastery[fact.id] >= masteryTarget).length
    const total = tableFacts.length
    return { table, masteredCount, total, isMastered: total > 0 && masteredCount === total }
  })

  return (
    <div className="category-mastery">
      <div className="category-grid">
        {categories.map(({ table, masteredCount, total, isMastered }) => (
          <div
            key={table}
            className={`category-chip${isMastered ? ' mastered' : ''}`}
            aria-label={t('categoryAria', { table, done: masteredCount, total })}
          >
            <span className="category-number">{table}</span>
            <span className="category-status">
              {isMastered ? <Check size={15} strokeWidth={3} /> : `${masteredCount}/${total}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
