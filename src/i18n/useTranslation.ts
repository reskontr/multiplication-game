import type { Language } from '../game/types'
import { translate, type TranslationKey } from './translations'

export function useTranslation(language: Language) {
  return {
    t: (key: TranslationKey, values?: Record<string, number | string>) =>
      translate(language, key, values),
  }
}
