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
      <svg className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[55%] sm:block" viewBox="0 0 600 260" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <circle cx="470" cy="70" r="46" fill="#ffcb05" />
        <circle cx="470" cy="70" r="62" fill="#ffcb05" opacity="0.25" />
        <path d="M0 220 Q 150 150 300 200 T 600 170 V260 H0Z" fill="#9ccf6a" />
        <path d="M0 245 Q 180 190 340 232 T 600 215 V260 H0Z" fill="#6bb54a" />
        {/* ступени каскада */}
        <rect x="250" y="40" width="190" height="26" rx="13" fill="#ed1b24" />
        <rect x="290" y="76" width="150" height="26" rx="13" fill="#f26b21" />
        <rect x="330" y="112" width="110" height="26" rx="13" fill="#f5a300" />
        <rect x="370" y="148" width="70" height="26" rx="13" fill="#2fa84f" />
        <circle cx="415" cy="53" r="6" fill="#fff" />
        <circle cx="415" cy="89" r="6" fill="#fff" />
        <circle cx="415" cy="125" r="6" fill="#fff" />
        <circle cx="415" cy="161" r="6" fill="#fff" />
      </svg>
      <div className="relative max-w-lg p-7 sm:p-9">
        <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft">Положение о каскадировании</div>
        <h2 className="font-display text-3xl font-bold leading-tight text-ink">
          Переводи, <span className="text-brand-red">а не пересылай</span>
        </h2>
        <p className="mt-3 text-sm text-ink-soft">
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
    { label: 'Информированность', value: `${stats.avg}%`, icon: TrendingUp, bg: 'bg-tint-mint', fg: 'text-accent-mint' },
  ]

  return (
    <div className="space-y-5">
      <HeroBanner />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label}>
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.bg} ${t.fg}`}>
                <t.icon size={22} />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold leading-none text-ink">{t.value}</div>
                <div className="mt-1 text-xs text-ink-muted">{t.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Донести команде */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
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
                <div key={c.id} className="flex items-center gap-3 px-5 py-3">
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
                    <CheckCheck size={14} /> <span className="hidden sm:inline">Подтвердить доведение</span>
                    <span className="sm:hidden">Готово</span>
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-5">
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Где информированность ниже цели</h2>
          <span className="text-xs text-ink-muted">Цель — не менее {surveyTargets.awareness.target}% (п. 8.3)</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
