import { useState } from 'react'

/** Момент первого рендера. Фиксируем его, чтобы рендер оставался чистым и не «плыл» между перерисовками */
export function useNow(): Date {
  const [now] = useState(() => new Date())
  return now
}
