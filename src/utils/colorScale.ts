export function getAwarenessColor(score: number): string {
  if (score >= 75) return '#22c55e'  // green
  if (score >= 55) return '#f59e0b'  // amber
  return '#ef4444'                    // red
}

export function getAwarenessLabel(score: number): string {
  if (score >= 75) return 'Высокий'
  if (score >= 55) return 'Средний'
  return 'Низкий'
}

export function getAwarenessBg(score: number): string {
  if (score >= 75) return 'bg-green-100 text-green-800'
  if (score >= 55) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}
