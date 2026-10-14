import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import clsx from 'clsx'
import type { Communication, CommunicationTypeId, Urgency } from '../types/communication'
import { useAllCommunications } from '../store/communicationsStore'
import { communicationTypes, typeById } from '../data/communicationTypes'
import { urgencyOptions } from '../data/classificationOptions'
import { useNow } from '../hooks/useNow'
import { toggleInSet } from '../utils/collections'
import { fmt, pluralComm, pluralCommWord } from '../utils/format'
import {
  getBuckets,
  getRange,
  getRangeLabel,
  scaleOptions,
  shiftAnchor,
  type Bucket,
  type Scale,
} from '../utils/timelineScale'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Segmented from '../components/ui/Segmented'
import Chip from '../components/ui/Chip'
import CommunicationCard from '../components/communication/CommunicationCard'
import PassportDrawer from '../components/communication/PassportDrawer'

type UrgencyFilter = Urgency | 'all'

const urgencyFilterOptions: { value: UrgencyFilter; label: string }[] = [
  { value: 'all', label: 'Любая' },
  ...urgencyOptions.map((o) => ({ value: o.value, label: o.label })),
]

const allTypeIds = () => new Set(communicationTypes.map((t) => t.id))

const byCreatedAt = (a: Communication, b: Communication) => +new Date(a.createdAt) - +new Date(b.createdAt)

interface ScaleSizes {
  /** Комфортная ширина колонки */
  minWidth: number
  /** Минимальная ширина в компактном режиме; если не помещается и так — включается прокрутка */
  compactWidth: number
  /** Диаметр точки-коммуникации */
  bead: number
  /** Диаметр узла со счётчиком на линии */
  node: number
}

const scaleSizes: Record<Scale, ScaleSizes> = {
  week: { minWidth: 110, compactWidth: 44, bead: 26, node: 36 },
  month: { minWidth: 34, compactWidth: 22, bead: 14, node: 28 },
  quarter: { minWidth: 72, compactWidth: 40, bead: 20, node: 32 },
  year: { minWidth: 76, compactWidth: 36, bead: 20, node: 32 },
}

/** Внутренние отступы области прокрутки (px-4 слева и справа) */
const TRACK_PADDING = 32
/** Границы высоты зоны с точками над линией */
const MIN_ZONE = 84
const MAX_ZONE = 200
const BEAD_GAP = 4

interface TrackLayout {
  compact: boolean
  colWidth: number
  nodeSize: number
  beadSize: number
  zoneHeight: number
  /** Сколько точек помещается в колонку; остальные сворачиваются в «+N» */
  maxBeads: number
}

/**
 * Размеры колонок: комфортные, компактные или (если и так не влезает) с прокруткой.
 * Высота зоны с точками подстраивается под самый «загруженный» интервал.
 */
function getTrackLayout(scale: Scale, trackWidth: number, bucketCount: number, busiest: number): TrackLayout {
  const sizes = scaleSizes[scale]
  const fitWidth = trackWidth > 0 ? trackWidth / bucketCount : sizes.minWidth
  const compact = fitWidth < sizes.minWidth
  const colWidth = compact ? Math.max(sizes.compactWidth, Math.floor(fitWidth)) : sizes.minWidth
  const nodeSize = compact ? Math.min(sizes.node, Math.max(20, colWidth - 6)) : sizes.node
  const beadSize = compact ? Math.min(sizes.bead, Math.max(10, colWidth - 14)) : sizes.bead
  const zoneHeight = Math.min(MAX_ZONE, Math.max(MIN_ZONE, busiest * (beadSize + BEAD_GAP) + 28))
  const maxBeads = Math.floor(zoneHeight / (beadSize + BEAD_GAP))
  return { compact, colWidth, nodeSize, beadSize, zoneHeight, maxBeads }
}

export default function TimelinePage() {
  const communications = useAllCommunications()
  const [searchParams, setSearchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') ?? ''
  const query = rawQuery.trim().toLowerCase()

  const now = useNow()
  const [scale, setScale] = useState<Scale>('month')
  const [anchor, setAnchor] = useState(now)
  const [activeTypes, setActiveTypes] = useState<Set<CommunicationTypeId>>(allTypeIds)
  const [urgency, setUrgency] = useState<UrgencyFilter>('all')
  const [selectedBucketKey, setSelectedBucketKey] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const closePassport = useCallback(() => setOpenId(null), [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [edges, setEdges] = useState({ left: false, right: false })

  const allTypesActive = activeTypes.size === communicationTypes.length
  const range = useMemo(() => getRange(scale, anchor), [scale, anchor])
  const buckets = useMemo(() => getBuckets(scale, anchor, now), [scale, anchor, now])
  const isCurrentPeriod = isWithinInterval(now, range)

  // Коммуникации периода без фильтра по типам — для счётчиков на плашках типов
  const inRange = useMemo(
    () =>
      communications.filter((c) => {
        const created = new Date(c.createdAt)
        if (created < range.start || created > range.end) return false
        if (urgency !== 'all' && c.classification.urgency !== urgency) return false
        if (query && !`${c.title} ${c.essence} ${c.keyMessage}`.toLowerCase().includes(query)) return false
        return true
      }),
    [communications, range, urgency, query],
  )

  const typeCounts = useMemo(() => {
    const counts = new Map<CommunicationTypeId, number>()
    for (const c of inRange) counts.set(c.typeId, (counts.get(c.typeId) ?? 0) + 1)
    return counts
  }, [inRange])

  const visible = useMemo(() => inRange.filter((c) => activeTypes.has(c.typeId)), [inRange, activeTypes])

  const byBucket = useMemo(() => {
    const map = new Map<string, Communication[]>(buckets.map((b) => [b.key, []]))
    for (const c of visible) {
      const created = new Date(c.createdAt)
      const bucket = buckets.find((b) => created >= b.start && created <= b.end)
      if (bucket) map.get(bucket.key)!.push(c)
    }
    map.forEach((list) => list.sort(byCreatedAt))
    return map
  }, [buckets, visible])

  const selectedBucket = buckets.find((b) => b.key === selectedBucketKey)
  const listItems = useMemo(
    () => (selectedBucket ? (byBucket.get(selectedBucket.key) ?? []) : [...visible].sort(byCreatedAt)),
    [selectedBucket, byBucket, visible],
  )

  // Список под линией группируется по дням
  const dayGroups = useMemo(() => {
    const groups: { day: Date; items: Communication[] }[] = []
    for (const c of listItems) {
      const day = startOfDay(new Date(c.createdAt))
      const last = groups[groups.length - 1]
      if (last && isSameDay(last.day, day)) last.items.push(c)
      else groups.push({ day, items: [c] })
    }
    return groups
  }, [listItems])

  const openComm = communications.find((c) => c.id === openId) ?? null

  // Следим за шириной дорожки, чтобы подобрать размер колонок под окно
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const observer = new ResizeObserver(() => setTrackWidth(box.clientWidth - TRACK_PADDING))
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  // Затемнения по краям показываем, только если в ту сторону есть что прокручивать
  const updateEdges = useCallback(() => {
    const box = scrollRef.current
    if (!box) return
    setEdges({ left: box.scrollLeft > 4, right: box.scrollLeft + box.clientWidth < box.scrollWidth - 4 })
  }, [])

  // При смене периода или ширины прокручиваем к выбранному интервалу или к «сегодня»
  useEffect(() => {
    const box = scrollRef.current
    if (!box) return
    const target =
      box.querySelector<HTMLElement>('[data-selected="true"]') ?? box.querySelector<HTMLElement>('[data-today="true"]')
    box.scrollLeft = target ? target.offsetLeft - box.clientWidth / 2 + target.clientWidth / 2 : 0
    updateEdges()
  }, [scale, anchor, trackWidth, updateEdges])

  const changeScale = (next: Scale) => {
    setScale(next)
    setSelectedBucketKey(null)
  }

  const goTo = (next: Date) => {
    setAnchor(next)
    setSelectedBucketKey(null)
  }

  const changeUrgency = (next: UrgencyFilter) => {
    setUrgency(next)
    setSelectedBucketKey(null)
  }

  // Клик по типу, когда выбраны все, оставляет только его; снятие последнего типа возвращает все
  const toggleType = (id: CommunicationTypeId) => {
    setActiveTypes((prev) => {
      if (prev.size === communicationTypes.length) return new Set([id])
      const next = toggleInSet(prev, id)
      return next.size === 0 ? allTypeIds() : next
    })
    setSelectedBucketKey(null)
  }

  const toggleBucket = (key: string) => setSelectedBucketKey((prev) => (prev === key ? null : key))

  const busiest = Math.max(0, ...Array.from(byBucket.values(), (list) => list.length))
  const layout = getTrackLayout(scale, trackWidth, buckets.length, busiest)

  return (
    <div className="space-y-5">
      {/* Управление */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={scaleOptions} value={scale} onChange={changeScale} />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-white p-2 text-ink-soft hover:bg-gray-50"
              onClick={() => goTo(shiftAnchor(scale, anchor, -1))}
              aria-label="Назад"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center justify-center gap-2 whitespace-nowrap px-1 text-[15px] font-medium text-ink @md:min-w-44 @md:px-2">
              <CalendarDays size={16} className="hidden text-ink-muted @md:block" />
              {getRangeLabel(scale, anchor)}
            </div>
            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-white p-2 text-ink-soft hover:bg-gray-50"
              onClick={() => goTo(shiftAnchor(scale, anchor, 1))}
              aria-label="Вперёд"
            >
              <ChevronRight size={18} />
            </button>
            <Button variant="secondary" size="sm" onClick={() => goTo(now)} disabled={isCurrentPeriod}>
              Сегодня
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-xl bg-tint-sky px-3 py-2 text-sm font-medium text-accent-sky">
            <span className="text-lg font-bold tabular-nums">{visible.length}</span>
            {pluralCommWord(visible.length)} за период
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">Типы коммуникаций</div>
            {!allTypesActive && (
              <button
                type="button"
                onClick={() => setActiveTypes(allTypeIds())}
                className="text-xs font-medium text-brand-red hover:underline"
              >
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
                count={typeCounts.get(t.id) ?? 0}
              >
                {t.name}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Срочность</span>
            <Segmented options={urgencyFilterOptions} value={urgency} onChange={changeUrgency} />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-2 rounded-full bg-tint-sun px-3 py-1.5 text-sm text-ink"
              aria-label={`Сбросить поиск «${rawQuery}»`}
            >
              <Search size={14} /> «{rawQuery}» <X size={14} />
            </button>
          )}
        </div>
      </Card>

      {/* Горизонтальная линия времени */}
      <Card padding={false} className="relative overflow-hidden">
        <ScrollShade side="left" visible={edges.left} />
        <ScrollShade side="right" visible={edges.right} />
        <div ref={scrollRef} onScroll={updateEdges} className="overflow-x-auto px-4 pb-4 pt-5">
          <div className="relative flex" style={{ minWidth: buckets.length * layout.colWidth }}>
            {/* Линия */}
            <div
              className="pointer-events-none absolute left-0 right-0 z-[1] h-[4px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              style={{ top: layout.zoneHeight + 16 - 2 }}
            />
            {buckets.map((b) => (
              <BucketColumn
                key={b.key}
                bucket={b}
                items={byBucket.get(b.key) ?? []}
                selected={selectedBucketKey === b.key}
                layout={layout}
                onToggle={() => toggleBucket(b.key)}
                onOpen={setOpenId}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-5 py-2.5 text-xs text-ink-muted">
          <span>
            Цифра на линии — количество коммуникаций. Цветные точки — отдельные коммуникации по типам. Нажмите на цифру,
            чтобы выбрать интервал.
          </span>
          {!isCurrentPeriod && <span>Сегодня — {fmt(now, 'd MMMM')}</span>}
        </div>
      </Card>

      {/* Список */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            {selectedBucket ? bucketTitle(scale, selectedBucket) : 'Коммуникации периода'}
            <span className="ml-2 text-sm font-normal text-ink-muted">{pluralComm(listItems.length)}</span>
          </h2>
          {selectedBucket && (
            <Button variant="secondary" size="sm" onClick={() => setSelectedBucketKey(null)}>
              <X size={14} /> Показать весь период
            </Button>
          )}
        </div>

        {dayGroups.length === 0 ? (
          <Card className="py-12 text-center text-sm text-ink-muted">
            В выбранном периоде нет коммуникаций с такими фильтрами
          </Card>
        ) : (
          <div className="space-y-5">
            {dayGroups.map(({ day, items }) => (
              <div key={day.toISOString()}>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-soft">
                  {fmt(day, 'EEEE, d MMMM')}
                  {isSameDay(day, now) && (
                    <span className="rounded-full bg-brand-red px-2 py-0.5 text-[11px] font-medium text-white">
                      сегодня
                    </span>
                  )}
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

      <PassportDrawer comm={openComm} onClose={closePassport} />
    </div>
  )
}

/** Заголовок списка для выбранного интервала: день — полной датой, неделя или месяц — подписью колонки */
function bucketTitle(scale: Scale, bucket: Bucket): string {
  return scale === 'week' || scale === 'month' ? fmt(bucket.start, 'd MMMM, EEEE') : `${bucket.top} ${bucket.bottom}`
}

/** Затемнение у края линии: подсказывает, что её можно прокрутить */
function ScrollShade({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute bottom-10 top-0 z-20 w-10 from-white to-transparent transition-opacity',
        side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}

interface BucketColumnProps {
  bucket: Bucket
  items: Communication[]
  selected: boolean
  layout: TrackLayout
  onToggle: () => void
  onOpen: (id: string) => void
}

function BucketColumn({ bucket, items, selected, layout, onToggle, onOpen }: BucketColumnProps) {
  const { compact, colWidth, nodeSize, beadSize, zoneHeight, maxBeads } = layout
  const count = items.length
  // Если точки не помещаются, последнее место занимает «+N»
  const shown = count > maxBeads ? items.slice(0, maxBeads - 1) : items
  const hidden = count - shown.length

  return (
    <div
      data-today={bucket.hasToday}
      data-selected={selected}
      className={clsx(
        'relative flex min-w-0 flex-1 flex-col items-center rounded-2xl transition-colors',
        selected ? 'bg-tint-sky/60' : bucket.hasToday ? 'bg-brand-red-light/50' : bucket.weekend && 'bg-gray-50',
      )}
      style={{ minWidth: colWidth }}
    >
      {/* Точки-коммуникации */}
      <div
        className="flex w-full flex-col-reverse items-center justify-start gap-1 pb-1"
        style={{ height: zoneHeight }}
      >
        {shown.map((c) => {
          const type = typeById(c.typeId)
          return (
            <button
              key={c.id}
              type="button"
              title={`${type.name}: ${c.title}`}
              aria-label={c.title}
              onClick={() => onOpen(c.id)}
              className="shrink-0 rounded-full border-2 border-white shadow transition-transform hover:z-10 hover:scale-125"
              style={{ width: beadSize, height: beadSize, backgroundColor: type.color }}
            />
          )
        })}
        {hidden > 0 && <span className="text-[11px] font-medium text-ink-muted">+{hidden}</span>}
      </div>

      {/* Узел на линии со счётчиком */}
      <div className="flex h-8 items-center justify-center">
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${bucket.top} ${bucket.bottom}: ${pluralComm(count)}`}
          aria-pressed={selected}
          style={{ width: nodeSize, height: nodeSize }}
          className={clsx(
            'relative z-10 flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums transition-all',
            nodeSize < 26 ? 'border-2 text-[10px]' : 'border-[3px] text-xs',
            count === 0 && 'border-gray-300 bg-white text-transparent hover:border-gray-400',
            count > 0 && !selected && 'border-ink bg-white text-ink hover:bg-gray-50',
            selected && 'scale-110 border-brand-red bg-brand-red text-white',
          )}
        >
          {count}
        </button>
      </div>

      {/* Подписи */}
      <button
        type="button"
        onClick={onToggle}
        className={clsx('mt-2 flex flex-col items-center gap-0.5 pb-2 text-center', compact ? 'px-0' : 'px-1')}
      >
        <span
          className={clsx(
            'rounded-md font-medium leading-5',
            compact ? 'px-1 text-xs' : 'px-1.5 text-sm',
            bucket.hasToday ? 'bg-brand-red text-white' : bucket.weekend ? 'text-accent-rose' : 'text-ink',
          )}
        >
          {bucket.top}
        </span>
        <span className={clsx('leading-4 text-ink-muted', compact ? 'text-[10px]' : 'text-[11px]')}>
          {bucket.bottom}
        </span>
      </button>
    </div>
  )
}
