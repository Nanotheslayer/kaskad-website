import { palette } from '../theme/colors'

/** Отставание от цели (п.п.), в пределах которого показатель считается «близким к цели» */
const NEAR_TARGET_GAP = 12

export interface ScoreBand {
  color: string
  label: string
  /** Подпись для легенды карты */
  legend: string
}

/** Оценка показателя относительно целевого значения (п. 8.3 Положения) */
export const scoreBands = {
  met: { color: palette.green, label: 'Цель достигнута', legend: 'достигнута' },
  near: { color: palette.amber, label: 'Близко к цели', legend: `до ${NEAR_TARGET_GAP} п.п. ниже` },
  below: { color: palette.coral, label: 'Ниже цели', legend: `более ${NEAR_TARGET_GAP} п.п. ниже` },
} satisfies Record<string, ScoreBand>

export function getScoreBand(score: number, target: number): ScoreBand {
  if (score >= target) return scoreBands.met
  if (score >= target - NEAR_TARGET_GAP) return scoreBands.near
  return scoreBands.below
}
