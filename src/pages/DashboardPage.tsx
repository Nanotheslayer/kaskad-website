import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCheck,
  FileSignature,
  GalleryHorizontal,
  Radio,
  Send,
  Siren,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { Communication, CommunicationTypeId } from '../types/communication'
import { useAllCommunications, useCommunicationsStore } from '../store/communicationsStore'
import { communicationTypes, typeById } from '../data/communicationTypes'
import { surveyAverage, surveyQuestions, surveyResults } from '../data/surveyResults'
import { useNow } from '../hooks/useNow'
import { alpha, palette } from '../theme/colors'
import { tintClasses, type Tint } from '../theme/tints'
import { deliveryDeadline } from '../utils/cascadeEngine'
import { getScoreBand } from '../utils/score'
import { fmt, pluralComm } from '../utils/format'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button, { LinkButton } from '../components/ui/Button'

const DAY_MS = 86_400_000
/** Окно для плитки «За 30 дней» — в обе стороны от сегодняшнего дня */
const RECENT_WINDOW_MS = 30 * DAY_MS
const DELIVERY_LIST_SIZE = 5
const TYPE_STATS_SIZE = 6
const LOWEST_SCORES_SIZE = 4
/** Вопрос опроса вовлечённости, ближе всего связанный с каскадированием, — п. 8.2 */
const INFORM_METRIC = 'directorsInform'
const informAverage = surveyAverage(INFORM_METRIC)
const deadlineOf = (c: Communication) => deliveryDeadline(c.typeId, c.createdAt)

interface StatTile {
  label: string
  value: string | number
  icon: LucideIcon
  tint: Tint
}

export default function DashboardPage() {
  const communications = useAllCommunications()
  const updateStatus = useCommunicationsStore((s) => s.updateStatus)
  const now = useNow()

  const tiles = useMemo<StatTile[]>(() => {
    const count = (predicate: (c: Communication) => boolean) => communications.filter(predicate).length
    const recent = count((c) => Math.abs(new Date(c.createdAt).getTime() - now.getTime()) <= RECENT_WINDOW_MS)
    const active = count((c) => c.status === 'active')
    const planned = count((c) => c.status === 'planned')
    const crisis = count((c) => c.status === 'active' && c.typeId === 'crisis')
    return [
      { label: 'За 30 дней', value: recent, icon: GalleryHorizontal, tint: 'sky' },
      { label: 'Идёт каскад', value: active, icon: Radio, tint: 'peach' },
      { label: 'Запланировано', value: planned, icon: CalendarClock, tint: 'lilac' },
      { label: 'Антикризисных сейчас', value: crisis, icon: Siren, tint: 'rose' },
      // Мягкий перенос: длинное слово не вылезает из узкой плитки
      { label: 'Информи\u00adрование', value: `${informAverage}%`, icon: TrendingUp, tint: 'mint' },
    ]
  }, [communications, now])

  const toDeliver = useMemo(
    () =>
      communications
        .filter((c) => c.status === 'active')
        .sort((a, b) => +deadlineOf(a) - +deadlineOf(b))
        .slice(0, DELIVERY_LIST_SIZE),
    [communications],
  )

  const typeStats = useMemo(() => {
    const counts = new Map<CommunicationTypeId, number>()
    for (const c of communications) counts.set(c.typeId, (counts.get(c.typeId) ?? 0) + 1)
    return communicationTypes
      .map((type) => ({ type, count: counts.get(type.id) ?? 0 }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [communications])
  const maxTypeCount = Math.max(1, ...typeStats.map((t) => t.count))

  const lowestScores = useMemo(
    () => [...surveyResults].sort((a, b) => a[INFORM_METRIC] - b[INFORM_METRIC]).slice(0, LOWEST_SCORES_SIZE),
    [],
  )

  return (
    <div className="space-y-5">
      <HeroBanner />

      {/* 2 колонки на узком экране, 5 — когда хватает места. Внутри плашки
          иконка встаёт сбоку от цифры, только если сама плашка достаточно широкая */}
      <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-5 @4xl:gap-4">
        {tiles.map((t, i) => (
          <Card
            key={t.label}
            className={clsx('!p-4 @container', i === tiles.length - 1 && 'col-span-2 @2xl:col-span-1')}
          >
            <div className="flex flex-col gap-2.5 @[12rem]:flex-row @[12rem]:items-center @[12rem]:gap-3">
              <div
                className={clsx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl @[12rem]:h-11 @[12rem]:w-11',
                  tintClasses[t.tint],
                )}
              >
                <t.icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-xl font-semibold leading-none text-ink @[12rem]:text-2xl">
                  {t.value}
                </div>
                <div className="mt-1 text-xs leading-tight text-ink-muted [overflow-wrap:anywhere]">{t.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-3">
        <Card className="@4xl:col-span-2" padding={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-3 pt-5">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Донести команде</h2>
              <p className="text-xs text-ink-muted">
                Ближайшие сроки доведения. Подтвердите, когда информация доведена
              </p>
            </div>
            <Link to="/timeline" className="flex items-center gap-1 text-sm font-medium text-brand-red hover:underline">
              Таймлайн <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {toDeliver.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-ink-muted">Всё доведено — отличная работа!</div>
            )}
            {toDeliver.map((c) => (
              <DeliveryRow
                key={c.id}
                comm={c}
                overdue={deadlineOf(c) < now}
                onConfirm={() => updateStatus(c.id, 'completed')}
              />
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 content-start gap-5 @xl:grid-cols-2 @4xl:grid-cols-1">
          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Быстрые действия</h2>
            <div className="grid gap-2">
              <LinkButton to="/classify" className="w-full justify-start">
                <Send size={16} /> Новый инфоповод
              </LinkButton>
              <LinkButton to="/map" variant="secondary" className="w-full justify-start">
                <BadgeCheck size={16} /> Оценка эффективности
              </LinkButton>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">По типам</h2>
            <div className="space-y-2.5">
              {typeStats.slice(0, TYPE_STATS_SIZE).map(({ type, count }) => (
                <div key={type.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-ink-soft">{type.name}</span>
                    <span className="font-medium tabular-nums text-ink">{count}</span>
                  </div>
                  <ProgressBar percent={(count / maxTypeCount) * 100} color={type.color} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-lg font-semibold text-ink">Где информирование ниже среднего</h2>
          <span className="text-xs text-ink-muted">Опрос вовлечённости, п. 8.2 · в среднем {informAverage}%</span>
        </div>
        <p className="-mt-1 mb-3 text-xs text-ink-soft">{surveyQuestions[INFORM_METRIC].question}</p>
        <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
          {lowestScores.map((r) => {
            const score = r[INFORM_METRIC]
            const { color } = getScoreBand(score, informAverage)
            return (
              <div key={r.divisionId} className="rounded-2xl p-3" style={{ backgroundColor: alpha(color, 0.08) }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink">{r.divisionName}</span>
                  <span className="font-display text-xl font-semibold" style={{ color }}>
                    {score}%
                  </span>
                </div>
                <ProgressBar percent={score} color={color} track="bg-white/80" className="mt-2" />
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-xs text-ink-muted">
          <Badge>{pluralComm(communications.length)} в системе</Badge>
        </div>
      </Card>
    </div>
  )
}

function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow-light via-[#fff7dd] to-tint-mint shadow-card">
      {/* Холмы — фон по всей ширине, масштабируются вместе с баннером */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full @3xl:h-24"
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 70 Q 150 20 300 55 T 600 35 V100 H0Z" fill="#9ccf6a" opacity="0.55" />
        <path d="M0 88 Q 180 50 340 80 T 600 62 V100 H0Z" fill="#6bb54a" opacity="0.7" />
      </svg>

      <div className="relative grid grid-cols-1 items-center gap-4 p-6 pb-20 @xl:p-8 @xl:pb-24 @2xl:grid-cols-[minmax(0,1fr)_minmax(150px,30%)] @2xl:pb-10 @4xl:grid-cols-[minmax(0,1fr)_minmax(220px,38%)] @5xl:px-10">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft">
            Положение о каскадировании
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink @xl:text-3xl @6xl:text-4xl">
            Будь первым <span className="text-brand-red">источником</span>
          </h2>
          <p className="mt-3 text-sm text-ink-soft @6xl:text-base">
            Информация идёт от генерального директора к каждому сотруднику. На каждом уровне руководитель узнаёт её
            раньше команды, объясняет, что она значит для работы, и отвечает на вопросы.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton to="/classify">
              <FileSignature size={16} /> Новый инфоповод
            </LinkButton>
            <LinkButton to="/cascade" variant="secondary">
              Смотреть каскад ДП
            </LinkButton>
          </div>
        </div>

        {/* Иллюстрация в собственной колонке: не наезжает на текст и не растягивается */}
        <svg
          className="hidden w-full max-w-[340px] justify-self-end @2xl:block"
          viewBox="0 0 300 190"
          aria-hidden="true"
        >
          <circle cx="232" cy="58" r="58" fill={palette.brandYellow} opacity="0.25" />
          <circle cx="232" cy="58" r="42" fill={palette.brandYellow} />
          {/* Ступени каскада: каждая следующая уже и ниже */}
          {[palette.brandRed, palette.orange, palette.amber, palette.green].map((fill, i) => (
            <g key={fill}>
              <rect x={20 + i * 40} y={22 + i * 36} width={190 - i * 40} height="26" rx="13" fill={fill} />
              <circle cx="190" cy={35 + i * 36} r="6" fill="#fff" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

interface DeliveryRowProps {
  comm: Communication
  overdue: boolean
  onConfirm: () => void
}

function DeliveryRow({ comm, overdue, onConfirm }: DeliveryRowProps) {
  const type = typeById(comm.typeId)
  const TypeIcon = type.icon
  return (
    <div className="flex items-center gap-3 px-5 py-3 @container">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: type.color }}
      >
        <TypeIcon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{comm.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
          <span style={{ color: type.color }}>{type.name}</span>
          <span>·</span>
          <span className={clsx(overdue && 'font-medium text-brand-red')}>срок {fmt(deadlineOf(comm), 'd MMM')}</span>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onConfirm}>
        <CheckCheck size={14} /> <span className="hidden @xl:inline">Подтвердить доведение</span>
        <span className="@xl:hidden">Готово</span>
      </Button>
    </div>
  )
}

interface ProgressBarProps {
  percent: number
  color: string
  /** Класс фона дорожки */
  track?: string
  className?: string
}

function ProgressBar({ percent, color, track = 'bg-gray-100', className }: ProgressBarProps) {
  return (
    <div className={clsx('h-1.5 overflow-hidden rounded-full', track, className)}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  )
}
