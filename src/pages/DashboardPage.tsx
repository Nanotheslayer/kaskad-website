import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CalendarClock, CheckCheck, FileSignature, GalleryHorizontal, Radio, Send, Siren, TrendingUp } from 'lucide-react'
import { useAllCommunications, useCommunicationsStore } from '../store/communicationsStore'
import { communicationTypes, typeById } from '../data/communicationTypes'
import { surveyResults, surveyTargets } from '../data/surveyResults'
import { getScoreColor } from '../utils/colorScale'
import { fmt, pluralComm } from '../utils/format'
import { getIcon } from '../utils/icons'
import { levelById } from '../data/levels'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'

function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow-light via-[#fff7dd] to-tint-mint shadow-card">
      {/* Холмы — фон по всей ширине, масштабируются вместе с баннером */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full @3xl:h-24" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70 Q 150 20 300 55 T 600 35 V100 H0Z" fill="#9ccf6a" opacity="0.55" />
        <path d="M0 88 Q 180 50 340 80 T 600 62 V100 H0Z" fill="#6bb54a" opacity="0.7" />
      </svg>

      <div className="relative grid grid-cols-1 items-center gap-4 p-6 pb-20 @xl:p-8 @xl:pb-24 @2xl:grid-cols-[minmax(0,1fr)_minmax(150px,30%)] @2xl:pb-10 @4xl:grid-cols-[minmax(0,1fr)_minmax(220px,38%)] @5xl:px-10">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft">Положение о каскадировании</div>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink @xl:text-3xl @6xl:text-4xl">
            Переводи, <span className="text-brand-red">а не пересылай</span>
          </h2>
          <p className="mt-3 text-sm text-ink-soft @6xl:text-base">
            Информация идёт от генерального директора к каждому сотруднику. На каждом уровне руководитель объясняет, что она значит для его команды.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/classify">
              <Button>
                <FileSignature size={16} /> Новый инфоповод
              </Button>
            </Link>
            <Link to="/cascade">
              <Button variant="secondary">Смотреть каскад ДП</Button>
            </Link>
          </div>
        </div>

        {/* Иллюстрация в собственной колонке: не наезжает на текст и не растягивается */}
        <svg className="hidden w-full max-w-[340px] justify-self-end @2xl:block" viewBox="0 0 300 190" aria-hidden="true">
          <circle cx="232" cy="58" r="58" fill="#ffcb05" opacity="0.25" />
          <circle cx="232" cy="58" r="42" fill="#ffcb05" />
          <rect x="20" y="22" width="190" height="26" rx="13" fill="#ed1b24" />
          <rect x="60" y="58" width="150" height="26" rx="13" fill="#f26b21" />
          <rect x="100" y="94" width="110" height="26" rx="13" fill="#f5a300" />
          <rect x="140" y="130" width="70" height="26" rx="13" fill="#2fa84f" />
          <circle cx="190" cy="35" r="6" fill="#fff" />
          <circle cx="190" cy="71" r="6" fill="#fff" />
          <circle cx="190" cy="107" r="6" fill="#fff" />
          <circle cx="190" cy="143" r="6" fill="#fff" />
        </svg>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const communications = useAllCommunications()
  const updateStatus = useCommunicationsStore((s) => s.updateStatus)

  const stats = useMemo(() => {
    const now = Date.now()
    const month = 30 * 86_400_000
    const recent = communications.filter((c) => Math.abs(new Date(c.createdAt).getTime() - now) <= month)
    const active = communications.filter((c) => c.status === 'active')
    const planned = communications.filter((c) => c.status === 'planned')
    const crisis = communications.filter((c) => c.classification.urgency === 'crisis' && c.status === 'active')
    const avg = Math.round(surveyResults.reduce((s, r) => s + r.awareness, 0) / surveyResults.length)
    return { recent: recent.length, active: active.length, planned: planned.length, crisis: crisis.length, avg }
  }, [communications])

  const toDeliver = useMemo(
    () =>
      communications
        .filter((c) => c.status === 'active')
        .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline))
        .slice(0, 5),
    [communications],
  )

  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {}
    communications.forEach((c) => (counts[c.typeId] = (counts[c.typeId] || 0) + 1))
    const max = Math.max(...Object.values(counts), 1)
    return communicationTypes
      .map((t) => ({ ...t, count: counts[t.id] || 0, max }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [communications])

  const lowest = useMemo(
    () => [...surveyResults].sort((a, b) => a.awareness - b.awareness).slice(0, 4),
    [],
  )

  const tiles = [
    { label: 'За 30 дней', value: stats.recent, icon: GalleryHorizontal, bg: 'bg-tint-sky', fg: 'text-accent-sky' },
    { label: 'Идёт каскад', value: stats.active, icon: Radio, bg: 'bg-tint-peach', fg: 'text-accent-peach' },
    { label: 'Запланировано', value: stats.planned, icon: CalendarClock, bg: 'bg-tint-lilac', fg: 'text-accent-lilac' },
    { label: 'Кризисных сейчас', value: stats.crisis, icon: Siren, bg: 'bg-tint-rose', fg: 'text-accent-rose' },
    { label: 'Информи\u00adрованность', value: `${stats.avg}%`, icon: TrendingUp, bg: 'bg-tint-mint', fg: 'text-accent-mint' },
  ]

  return (
    <div className="space-y-5">
      <HeroBanner />

      {/* 2 колонки на узком экране, 5 — когда хватает места. Внутри плашки
          иконка встаёт сбоку от цифры, только если сама плашка достаточно широкая */}
      <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-5 @4xl:gap-4">
        {tiles.map((t, i) => (
          <Card key={t.label} className={`@container !p-4 ${i === tiles.length - 1 ? 'col-span-2 @2xl:col-span-1' : ''}`}>
            <div className="flex flex-col gap-2.5 @[12rem]:flex-row @[12rem]:items-center @[12rem]:gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl @[12rem]:h-11 @[12rem]:w-11 ${t.bg} ${t.fg}`}>
                <t.icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-xl font-semibold leading-none text-ink @[12rem]:text-2xl">{t.value}</div>
                <div className="mt-1 text-xs leading-tight text-ink-muted [overflow-wrap:anywhere]">{t.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-3">
        {/* Донести команде */}
        <Card className="@4xl:col-span-2" padding={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-3 pt-5">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Донести команде</h2>
              <p className="text-xs text-ink-muted">Ближайшие сроки доведения. Подтвердите, когда информация доведена</p>
            </div>
            <Link to="/timeline" className="flex items-center gap-1 text-sm font-medium text-brand-red hover:underline">
              Таймлайн <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {toDeliver.length === 0 && <div className="px-5 py-10 text-center text-sm text-ink-muted">Всё доведено — отличная работа!</div>}
            {toDeliver.map((c) => {
              const t = typeById(c.typeId)
              const Icon = t ? getIcon(t.icon) : null
              const overdue = new Date(c.deadline).getTime() < Date.now()
              return (
                <div key={c.id} className="@container flex items-center gap-3 px-5 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: t?.color }}>
                    {Icon && <Icon size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{c.title}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
                      <span style={{ color: t?.color }}>{t?.name}</span>
                      <span>·</span>
                      <span>до {levelById(c.cascadeDepth).short}</span>
                      <span>·</span>
                      <span className={overdue ? 'font-medium text-brand-red' : ''}>срок {fmt(c.deadline, 'd MMM')}</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => updateStatus(c.id, 'completed')}>
                    <CheckCheck size={14} /> <span className="hidden @xl:inline">Подтвердить доведение</span>
                    <span className="@xl:hidden">Готово</span>
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 content-start gap-5 @xl:grid-cols-2 @4xl:grid-cols-1">
          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Быстрые действия</h2>
            <div className="space-y-2">
              <Link to="/classify" className="block">
                <Button className="w-full justify-start">
                  <Send size={16} /> Новый инфоповод
                </Button>
              </Link>
              <Link to="/map" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <BadgeCheck size={16} /> Карта осведомлённости
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">По типам</h2>
            <div className="space-y-2.5">
              {typeStats.slice(0, 6).map((t) => (
                <div key={t.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-ink-soft">{t.name}</span>
                    <span className="font-medium tabular-nums text-ink">{t.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${(t.count / t.max) * 100}%`, backgroundColor: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-lg font-semibold text-ink">Где информированность ниже цели</h2>
          <span className="text-xs text-ink-muted">Цель — не менее {surveyTargets.awareness.target}% (п. 8.3)</span>
        </div>
        <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
          {lowest.map((r) => {
            const color = getScoreColor(r.awareness, surveyTargets.awareness.target)
            return (
              <div key={r.divisionId} className="rounded-2xl p-3" style={{ backgroundColor: color + '14' }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink">{r.divisionName}</span>
                  <span className="font-display text-xl font-semibold" style={{ color }}>
                    {r.awareness}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
                  <div className="h-full rounded-full" style={{ width: `${r.awareness}%`, backgroundColor: color }} />
                </div>
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
