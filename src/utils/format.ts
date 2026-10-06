import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CommunicationStatus } from '../types/communication'

export const fmt = (date: Date | string | number, pattern: string) => format(new Date(date), pattern, { locale: ru })

export const statusLabels: Record<CommunicationStatus, string> = {
  planned: 'Запланирована',
  active: 'Идёт каскад',
  completed: 'Доведено',
}

export const statusColors: Record<CommunicationStatus, string> = {
  planned: '#3b9ae8',
  active: '#f28b3c',
  completed: '#2fa84f',
}

/** Склонение: 1 коммуникация, 2 коммуникации, 5 коммуникаций */
export function plural(n: number, forms: [string, string, string]): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1]
  return forms[2]
}

export const pluralComm = (n: number) => `${n} ${plural(n, ['коммуникация', 'коммуникации', 'коммуникаций'])}`
