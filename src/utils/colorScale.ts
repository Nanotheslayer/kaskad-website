/** Цвет показателя относительно целевого значения (п. 8.3 Положения) */
export function getScoreColor(score: number, target: number): string {
  if (score >= target) return '#2fa84f'
  if (score >= target - 12) return '#f5a300'
  return '#e5484d'
}

export function getScoreLabel(score: number, target: number): string {
  if (score >= target) return 'Цель достигнута'
  if (score >= target - 12) return 'Близко к цели'
  return 'Ниже цели'
}
