import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  getQuarter,
} from 'date-fns'
import { ChevronLeft, ChevronRight, CalendarDays, Search, X } from 'lucide-react'
import clsx from 'clsx'
import { useAllCommunications } from '../store/communicationsStore'
import { communicationTypes, typeById } from '../data/communicationTypes'
import { urgencyOptions } from '../data/classificationOptions'
import type { Communication, CommunicationTypeId } from '../types/communication'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Segmented from '../components/ui/Segmented'
import Chip from '../components/ui/Chip'
import CommunicationCard from '../components/communication/CommunicationCard'
import PassportDrawer from '../components/communication/PassportDrawer'
import { fmt, plural, pluralComm } from '../utils/format'

type Scale = 'week' | 'month' | 'quarter' | 'year'

const scaleOptions: { value: Scale; label: string }[] = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
]

interface Bucket {
  key: string
  start: Date
  end: Date
  top: string
  bottom: string
  weekend: boolean
  hasToday: boolean
}

interface ScaleConfig {
  /** Комфортная ширина колонки */
  minWidth: number
  /** Минимальная ширина в компактном режиме; если не помещается и так — включается прокрутка */
  compactWidth: number
  bead: number
  /** Диаметр узла со счётчиком на линии */
  node: number
}

const scaleConfig: Record<Scale, ScaleConfig> = {
  week: { minWidth: 110, compactWidth: 44, bead: 26, node: 36 },
  month: { minWidth: 34, compactWidth: 22, bead: 14, node: 28 },
  quarter: { minWidth: 72, compactWidth: 40, bead: 20, node: 32 },
  year: { minWidth: 76, compactWidth: 36, bead: 20, node: 32 },
}

/** Внутренние отступы области прокрутки (px-4 слева и справа) */
const TRACK_PADDING = 32

const MAX_ZONE = 200
const MIN_ZONE = 84

function getRange(scale: Scale, anchor: Date): { start: Date; end: Date } {
  switch (scale) {
    case 'week':
      return { start: startOfWeek(anchor, { weekStartsOn: 1 }), end: endOfWeek(anchor, { weekStartsOn: 1 }) }
    case 'month':
      return { start: startOfMonth(anchor), end: endOfMonth(anchor) }
    case 'quarter':
      return { start: startOfQuarter(anchor), end: endOfQuarter(anchor) }
    case 'year':
      return { start: startOfYear(anchor), end: endOfYear(anchor) }
  }
}

function getRangeLabel(scale: Scale, anchor: Date): string {
  const { start, end } = getRange(scale, anchor)
  switch (scale) {
    case 'week':
      return start.getMonth() === end.getMonth()
        ? `${fmt(start, 'd')} – ${fmt(end, 'd MMMM yyyy')}`
        : `${fmt(start, 'd MMM')} – ${fmt(end, 'd MMM yyyy')}`
    case 'month': {
      const s = fmt(anchor, 'LLLL yyyy')
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
    case 'quarter':
      return `${getQuarter(anchor)} квартал ${fmt(anchor, 'yyyy')}`
    case 'year':
      return fmt(anchor, 'yyyy')
  }
}

function shift(scale: Scale, anchor: Date, dir: 1 | -1): Date {
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

function getBuckets(scale: Scale, anchor: Date, now: Date): Bucket[] {
  const { start, end } = getRange(scale, anchor)
  const contains = (s: Date, e: Date) => isWithinInterval(now, { start: s, end: e })

  if (scale === 'week' || scale === 'month') {
    return eachDayOfInterval({ start, end }).map((d) => ({
      key: d.toISOString(),
      start: startOfDay(d),
      end: new Date(startOfDay(d).getTime() + 86_400_000 - 1),
      top: scale === 'week' ? fmt(d, 'EEEEEE') : fmt(d, 'd'),
      bottom: scale === 'week' ? fmt(d, 'd MMM') : fmt(d, 'EEEEEE'),
      weekend: d.getDay() === 0 || d.getDay() === 6,
      hasToday: isSameDay(d, now),
    }))
  }

  if (scale === 'quarter') {
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((w) => {
      const s = w < start ? start : w
      const eRaw = endOfWeek(w, { weekStartsOn: 1 })
      const e = eRaw > end ? end : eRaw
      return {
        key: s.toISOString(),
        start: s,
        end: e,
        top: `${fmt(s, 'd')}–${fmt(e, 'd')}`,
        bottom: fmt(e, 'LLL'),
        weekend: false,
        hasToday: contains(s, e),
      }
    })
  }

  return eachMonthOfInterval({ start, end }).map((m) => ({
    key: m.toISOString(),
    start: startOfMonth(m),
    end: endOfMonth(m),
    top: fmt(m, 'LLL'),
    bottom: fmt(m, 'yyyy'),
    weekend: false,
    hasToday: contains(startOfMonth(m), endOfMonth(m)),
  }))
}

export default function TimelinePage() {
  const communications = useAllCommunications()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()

  const now = useMemo(() => new Date(), [])
  const [scale, setScale] = useState<Scale>('month')
  const [anchor, setAnchor] = useState<Date>(now)
  const [activeTypes, setActiveTypes] = useState<Set<CommunicationTypeId>>(
    () => new Set(communicationTypes.map((t) => t.id)),
  )
  const [urgency, setUrgency] = useState<string>('all')
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [edges, setEdges] = useState({ left: false, right: false })

  const allTypesActive = activeTypes.size === communicationTypes.length
  const range = useMemo(() => getRange(scale, anchor), [scale, anchor])
  const buckets = useMemo(() => getBuckets(scale, anchor, now), [scale, anchor, now])
  const cfg = scaleConfig[scale]

  // Коммуникации периода (без фильтра по типам — для счётчиков на плашках)
  const inRange = useMemo(
    () =>
      communications.filter((c) => {
        const d = new Date(c.createdAt)
        if (d < range.start || d > range.end) return false
        if (urgency !== 'all' && c.classification.urgency !== urgency) return false
        if (query && !`${c.title} ${c.essence} ${c.keyMessage}`.toLowerCase().includes(query)) return false
        return true
      }),
    [communications, range, urgency, query],
  )

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<CommunicationTypeId, number>> = {}
    inRange.forEach((c) => (counts[c.typeId] = (counts[c.typeId] ?? 0) + 1))
    return counts
  }, [inRange])

  const visible = useMemo(() => inRange.filter((c) => activeTypes.has(c.typeId)), [inRange, activeTypes])

  const byBucket = useMemo(() => {
    const map = new Map<string, Communication[]>()
    buckets.forEach((b) => map.set(b.key, []))
    visible.forEach((c) => {
      const d = new Date(c.createdAt)
      const b = buckets.find((x) => d >= x.start && d <= x.end)
      if (b) map.get(b.key)!.push(c)
    })
    map.forEach((list) => list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)))
    return map
  }, [buckets, visible])

  const listItems = useMemo(() => {
    const items = selectedBucket ? (byBucket.get(selectedBucket) ?? []) : visible
    return [...items].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
  }, [selectedBucket, byBucket, visible])

  const grouped = useMemo(() => {
    const groups: { day: Date; items: Communication[] }[] = []
    listItems.forEach((c) => {
      const d = startOfDay(new Date(c.createdAt))
      const last = groups[groups.length - 1]
      if (last && isSameDay(last.day, d)) last.items.push(c)
      else groups.push({ day: d, items: [c] })
    })
    return groups
  }, [listItems])

  const openComm = communications.find((c) => c.id === openId) ?? null
  const selectedLabel = buckets.find((b) => b.key === selectedBucket)

  // Следим за шириной дорожки, чтобы подобрать размер колонок под окно
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const ro = new ResizeObserver(() => setTrackWidth(box.clientWidth - TRACK_PADDING))
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const updateEdges = () => {
    const box = scrollRef.current
    if (!box) return
    setEdges({ left: box.scrollLeft > 4, right: box.scrollLeft + box.clientWidth < box.scrollWidth - 4 })
  }

  // Прокрутка к «сегодня» или выбранному интервалу
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const target =
      box.querySelector<HTMLElement>('[data-selected="true"]') ?? box.querySelector<HTMLElement>('[data-today="true"]')
    if (target) box.scrollLeft = target.offsetLeft - box.clientWidth / 2 + target.clientWidth / 2
    else box.scrollLeft = 0
    updateEdges()
  }, [scale, anchor, trackWidth])

  const changeScale = (s: Scale) => {
    setScale(s)
    setSelectedBucket(null)
  }

  const go = (next: Date) => {
    setAnchor(next)
    setSelectedBucket(null)
  }

  const toggleType = (id: CommunicationTypeId) => {
    setActiveTypes((prev) => {
      if (prev.size === communicationTypes.length) return new Set([id])
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next.size === 0 ? new Set(communicationTypes.map((t) => t.id)) : next
    })
    setSelectedBucket(null)
  }

  const resetTypes = () => setActiveTypes(new Set(communicationTypes.map((t) => t.id)))

  // Высота зоны с точками подстраивается под самый «загруженный» интервал
  const busiest = Math.max(0, ...Array.from(byBucket.values()).map((l) => l.length))
  // Размеры колонок: комфортные, компактные или (если и так не влезает) с прокруткой
  const fitWidth = trackWidth > 0 ? trackWidth / buckets.length : cfg.minWidth
  const compact = fitWidth < cfg.minWidth
  const colWidth = compact ? Math.max(cfg.compactWidth, Math.floor(fitWidth)) : cfg.minWidth
  const nodeSize = compact ? Math.min(cfg.node, Math.max(20, colWidth - 6)) : cfg.node
  const beadSize = compact ? Math.min(cfg.bead, Math.max(10, colWidth - 14)) : cfg.bead

  const zoneHeight = Math.min(MAX_ZONE, Math.max(MIN_ZONE, busiest * (beadSize + 4) + 28))
  const maxBeads = Math.floor(zoneHeight / (beadSize + 4))
  const isCurrentPeriod = isWithinInterval(now, range)

  return (
    <div className="space-y-5">
      {/* Управление */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={scaleOptions} value={scale} onChange={changeScale} />

          <div className="flex items-center gap-1.5">
            <button
              className="rounded-xl border border-gray-200 bg-white p-2 text-ink-soft hover:bg-gray-50"
              onClick={() => go(shift(scale, anchor, -1))}
              aria-label="Назад"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center justify-center gap-2 whitespace-nowrap px-1 text-[15px] font-medium text-ink @md:min-w-44 @md:px-2">
              <CalendarDays size={16} className="hidden text-ink-muted @md:block" />
              {getRangeLabel(scale, anchor)}
            </div>
            <button
              className="rounded-xl border border-gray-200 bg-white p-2 text-ink-soft hover:bg-gray-50"
              onClick={() => go(shift(scale, anchor, 1))}
              aria-label="Вперёд"
            >
              <ChevronRight size={18} />
            </button>
            <Button variant="secondary" size="sm" onClick={() => go(now)} disabled={isCurrentPeriod}>
              Сегодня
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-xl bg-tint-sky px-3 py-2 text-sm font-medium text-accent-sky">
            <span className="text-lg font-bold tabular-nums">{visible.length}</span>
            {plural(visible.length, ['коммуникация', 'коммуникации', 'коммуникаций'])} за период
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">Типы коммуникаций</div>
            {!allTypesActive && (
              <button onClick={resetTypes} className="text-xs font-medium text-brand-red hover:underline">
                Показать все типы
              </button>
            )}
          </div>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 @2xl:mx-0 @2xl:flex-wrap @2xl:overflow-visible @2xl:px-0 @2xl:pb-0">
            {communicationTypes.map((t) => (
              <Chip
                key={t.id}
                color={t.color}
                active={allTypesActive || activeTypes.has(t.id)}
                onClick={() => toggleType(t.id)}
                count={typeCounts[t.id] ?? 0}
              >
                {t.name}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Срочность</span>
            <Segmented
              options={[{ value: 'all', label: 'Любая' }, ...urgencyOptions.map((o) => ({ value: o.value, label: o.label }))]}
              value={urgency}
              onChange={(v) => {
                setUrgency(v)
                setSelectedBucket(null)
              }}
            />
          </div>
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-2 rounded-full bg-tint-sun px-3 py-1.5 text-sm text-ink"
            >
              <Search size={14} /> «{searchParams.get('q')}» <X size={14} />
            </button>
          )}
        </div>
      </Card>

      {/* Горизонтальная линия времени */}
      <Card padding={false} className="relative overflow-hidden">
        {/* Затемнения по краям подсказывают, что линию можно прокрутить */}
        <div
          className={clsx(
            'pointer-events-none absolute bottom-10 left-0 top-0 z-20 w-10 bg-gradient-to-r from-white to-transparent transition-opacity',
            edges.left ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={clsx(
            'pointer-events-none absolute bottom-10 right-0 top-0 z-20 w-10 bg-gradient-to-l from-white to-transparent transition-opacity',
            edges.right ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div ref={scrollRef} onScroll={updateEdges} className="overflow-x-auto px-4 pb-4 pt-5">
          <div className="relative flex" style={{ minWidth: buckets.length * colWidth }}>
            {/* Линия */}
            <div
              className="pointer-events-none absolute left-0 right-0 z-[1] h-[4px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              style={{ top: zoneHeight + 16 - 2 }}
            />
            {buckets.map((b) => {
              const items = byBucket.get(b.key) ?? []
              const count = items.length
              const isSelected = selectedBucket === b.key
              const shown = count > maxBeads ? items.slice(0, maxBeads - 1) : items
              const hidden = count - shown.length
              return (
                <div
                  key={b.key}
                  data-today={b.hasToday}
                  data-selected={isSelected}
                  className={clsx(
                    'relative flex min-w-0 flex-1 flex-col items-center rounded-2xl transition-colors',
                    isSelected ? 'bg-tint-sky/60' : b.hasToday ? 'bg-brand-red-light/50' : b.weekend ? 'bg-gray-50' : '',
                  )}
                  style={{ minWidth: colWidth }}
                >
                  {/* Бусины-коммуникации */}
                  <div className="flex w-full flex-col-reverse items-center justify-start gap-1 pb-1" style={{ height: zoneHeight }}>
                    {shown.map((c) => {
                      const t = typeById(c.typeId)
                      return (
                        <button
                          key={c.id}
                          title={`${t?.name}: ${c.title}`}
                          aria-label={c.title}
                          onClick={() => setOpenId(c.id)}
                          className="shrink-0 rounded-full border-2 border-white shadow transition-transform hover:z-10 hover:scale-125"
                          style={{ width: beadSize, height: beadSize, backgroundColor: t?.color }}
                        />
                      )
                    })}
                    {hidden > 0 && <span className="text-[11px] font-medium text-ink-muted">+{hidden}</span>}
                  </div>

                  {/* Узел на линии со счётчиком */}
                  <div className="flex h-8 items-center justify-center">
                    <button
                      onClick={() => setSelectedBucket(isSelected ? null : b.key)}
                      aria-label={`${b.top} ${b.bottom}: ${pluralComm(count)}`}
                      aria-pressed={isSelected}
                      style={{ width: nodeSize, height: nodeSize }}
                      className={clsx(
                        'relative z-10 flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums transition-all',
                        nodeSize < 26 ? 'border-2 text-[10px]' : 'border-[3px] text-xs',
                        count === 0 && 'border-gray-300 bg-white text-transparent hover:border-gray-400',
                        count > 0 && !isSelected && 'border-ink bg-white text-ink hover:bg-gray-50',
                        isSelected && 'scale-110 border-brand-red bg-brand-red text-white',
                      )}
                    >
                      {count > 0 ? count : '0'}
                    </button>
                  </div>

                  {/* Подписи */}
                  <button
                    onClick={() => setSelectedBucket(isSelected ? null : b.key)}
                    className={clsx('mt-2 flex flex-col items-center gap-0.5 pb-2 text-center', compact ? 'px-0' : 'px-1')}
                  >
                    <span
                      className={clsx(
                        'rounded-md font-medium leading-5',
                        compact ? 'px-1 text-xs' : 'px-1.5 text-sm',
                        b.hasToday ? 'bg-brand-red text-white' : b.weekend ? 'text-accent-rose' : 'text-ink',
                      )}
                    >
                      {b.top}
                    </span>
                    <span className={clsx('leading-4 text-ink-muted', compact ? 'text-[10px]' : 'text-[11px]')}>{b.bottom}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-5 py-2.5 text-xs text-ink-muted">
          <span>Цифра на линии — количество коммуникаций. Цветные точки — отдельные коммуникации по типам. Нажмите на цифру, чтобы выбрать интервал.</span>
          {!isCurrentPeriod && <span>Сегодня — {fmt(now, 'd MMMM')}</span>}
        </div>
      </Card>

      {/* Список */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            {selectedLabel
              ? scale === 'week' || scale === 'month'
                ? fmt(selectedLabel.start, 'd MMMM, EEEE')
                : `${selectedLabel.top} ${selectedLabel.bottom}`
              : 'Коммуникации периода'}
            <span className="ml-2 text-sm font-normal text-ink-muted">{pluralComm(listItems.length)}</span>
          </h2>
          {selectedBucket && (
            <Button variant="secondary" size="sm" onClick={() => setSelectedBucket(null)}>
              <X size={14} /> Показать весь период
            </Button>
          )}
        </div>

        {grouped.length === 0 ? (
          <Card className="py-12 text-center text-sm text-ink-muted">
            В выбранном периоде нет коммуникаций с такими фильтрами
          </Card>
        ) : (
          <div className="space-y-5">
            {grouped.map(({ day, items }) => (
              <div key={day.toISOString()}>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-soft">
                  {fmt(day, 'EEEE, d MMMM')}
                  {isSameDay(day, now) && <span className="rounded-full bg-brand-red px-2 py-0.5 text-[11px] font-medium text-white">сегодня</span>}
                </div>
                <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-2 @[110rem]:grid-cols-3">
                  {items.map((c) => (
                    <CommunicationCard key={c.id} comm={c} selected={openId === c.id} onClick={() => setOpenId(c.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PassportDrawer comm={openComm} onClose={() => setOpenId(null)} />
    </div>
  )
}
