import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  getQuarter,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  type Interval,
} from 'date-fns'
import { fmt } from './format'

/** Масштаб таймлайна: какой период показываем и на какие интервалы (колонки) его делим */
export type Scale = 'week' | 'month' | 'quarter' | 'year'

export const scaleOptions: { value: Scale; label: string }[] = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
]

/** Колонка таймлайна: день (неделя, месяц), неделя (квартал) или месяц (год) */
export interface Bucket {
  key: string
  start: Date
  end: Date
  /** Верхняя и нижняя строка подписи под линией */
  top: string
  bottom: string
  weekend: boolean
  hasToday: boolean
}

const WEEK = { weekStartsOn: 1 } as const

export function getRange(scale: Scale, anchor: Date): { start: Date; end: Date } {
  switch (scale) {
    case 'week':
      return { start: startOfWeek(anchor, WEEK), end: endOfWeek(anchor, WEEK) }
    case 'month':
      return { start: startOfMonth(anchor), end: endOfMonth(anchor) }
    case 'quarter':
      return { start: startOfQuarter(anchor), end: endOfQuarter(anchor) }
    case 'year':
      return { start: startOfYear(anchor), end: endOfYear(anchor) }
  }
}

export function getRangeLabel(scale: Scale, anchor: Date): string {
  const { start, end } = getRange(scale, anchor)
  switch (scale) {
    case 'week':
      return start.getMonth() === end.getMonth()
        ? `${fmt(start, 'd')} – ${fmt(end, 'd MMMM yyyy')}`
        : `${fmt(start, 'd MMM')} – ${fmt(end, 'd MMM yyyy')}`
    case 'month': {
      const label = fmt(anchor, 'LLLL yyyy')
      return label.charAt(0).toUpperCase() + label.slice(1)
    }
    case 'quarter':
      return `${getQuarter(anchor)} квартал ${fmt(anchor, 'yyyy')}`
    case 'year':
      return fmt(anchor, 'yyyy')
  }
}

/** Соседний период: dir = -1 — назад, 1 — вперёд */
export function shiftAnchor(scale: Scale, anchor: Date, dir: 1 | -1): Date {
  switch (scale) {
    case 'week':
      return addDays(anchor, 7 * dir)
    case 'month':
      return addMonths(anchor, dir)
    case 'quarter':
      return addMonths(anchor, 3 * dir)
    case 'year':
      return addYears(anchor, dir)
  }
}

export function getBuckets(scale: Scale, anchor: Date, now: Date): Bucket[] {
  const range = getRange(scale, anchor)
  const containsNow = (interval: Interval) => isWithinInterval(now, interval)

  if (scale === 'week' || scale === 'month') {
    return eachDayOfInterval(range).map((day) => ({
      key: day.toISOString(),
      start: startOfDay(day),
      end: endOfDay(day),
      top: scale === 'week' ? fmt(day, 'EEEEEE') : fmt(day, 'd'),
      bottom: scale === 'week' ? fmt(day, 'd MMM') : fmt(day, 'EEEEEE'),
      weekend: day.getDay() === 0 || day.getDay() === 6,
      hasToday: isSameDay(day, now),
    }))
  }

  if (scale === 'quarter') {
    // Крайние недели квартала обрезаем по его границам
    return eachWeekOfInterval(range, WEEK).map((weekStart) => {
      const start = weekStart < range.start ? range.start : weekStart
      const weekEnd = endOfWeek(weekStart, WEEK)
      const end = weekEnd > range.end ? range.end : weekEnd
      return {
        key: start.toISOString(),
        start,
        end,
        top: `${fmt(start, 'd')}–${fmt(end, 'd')}`,
        bottom: fmt(end, 'LLL'),
        weekend: false,
        hasToday: containsNow({ start, end }),
      }
    })
  }

  return eachMonthOfInterval(range).map((month) => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    return {
      key: month.toISOString(),
      start,
      end,
      top: fmt(month, 'LLL'),
      bottom: fmt(month, 'yyyy'),
      weekend: false,
      hasToday: containsNow({ start, end }),
    }
  })
}
