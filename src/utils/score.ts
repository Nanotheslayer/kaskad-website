import { palette } from '../theme/colors'

/**
 * Отставание от среднего по компании (п.п.), в пределах которого показатель считается «около среднего».
 * Правило портала: целевых значений в п. 8 Положения нет, поэтому сравниваем со средним.
 */
const NEAR_AVERAGE_GAP = 5

export interface ScoreBand {
  color: string
  label: string
  /** Подпись для легенды карты */
  legend: string
}

/** Оценка показателя подразделения относительно среднего по компании */
export const scoreBands = {
  above: { color: palette.green, label: 'Не ниже среднего', legend: 'не ниже среднего' },
  near: { color: palette.ochre, label: 'Чуть ниже среднего', legend: `до ${NEAR_AVERAGE_GAP} п.п. ниже` },
  below: { color: palette.brandRed, label: 'Ниже среднего', legend: `более ${NEAR_AVERAGE_GAP} п.п. ниже` },
} satisfies Record<string, ScoreBand>

export function getScoreBand(score: number, average: number): ScoreBand {
  if (score >= average) return scoreBands.above
  if (score >= average - NEAR_AVERAGE_GAP) return scoreBands.near
  return scoreBands.below
}
