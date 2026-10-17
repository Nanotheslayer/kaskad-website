import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck2, TrendingUp, Users, type LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { divisionKindLabels, divisions } from '../data/divisions'
import { surveyByDivision, surveyResults, surveyTargets, type MetricId } from '../data/surveyResults'
import { useNow } from '../hooks/useNow'
import { alpha, palette } from '../theme/colors'
import { getScoreBand, scoreBands } from '../utils/score'
import { fmt } from '../utils/format'
import Card from '../components/ui/Card'
import Segmented from '../components/ui/Segmented'

const metricIds = Object.keys(surveyTargets) as MetricId[]
const metricOptions = metricIds.map((id) => ({ value: id, label: surveyTargets[id].label }))

const DEFAULT_DIVISION_ID = 'ufo'
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

/** Ритм опросов — п. 8.2 и 8.4 Положения. Месяцы — индексы 0…11 */
const surveyKinds = [
  {
    id: 'pulse',
    title: 'Пульс-опрос',
    legend: 'Пульс-опрос — ежемесячно, 2–3 вопроса',
    color: palette.azure,
    months: null,
  },
  {
    id: 'engagement',
    title: 'Опрос вовлечённости',
    legend: 'Вовлечённость — апрель и октябрь, 3 недели',
    color: palette.pink,
    months: [3, 9],
  },
  {
    id: 'interaction',
    title: 'Опрос взаимодействия',
    legend: 'Взаимодействие — июнь и декабрь',
    color: palette.amber,
    months: [5, 11],
  },
]

const getSurvey = (divisionId: string) => {
  const survey = surveyByDivision.get(divisionId)
  if (!survey) throw new Error(`Нет результатов опроса для подразделения ${divisionId}`)
  return survey
}

export default function CompanyMapPage() {
  const [metric, setMetric] = useState<MetricId>('awareness')
  const [selectedId, setSelectedId] = useState(DEFAULT_DIVISION_ID)
  const currentMonth = useNow().getMonth()
  const { target, label, question, hint } = surveyTargets[metric]

  const ranking = useMemo(() => [...surveyResults].sort((a, b) => a[metric] - b[metric]), [metric])
  const average = Math.round(surveyResults.reduce((sum, r) => sum + r[metric], 0) / surveyResults.length)
  const selectedDivision = divisions.find((d) => d.id === selectedId) ?? divisions[0]
  const selectedSurvey = getSurvey(selectedDivision.id)

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="max-w-full overflow-x-auto">
          <Segmented options={metricOptions} value={metric} onChange={setMetric} />
        </div>
        <div className="min-w-0 flex-1 basis-64 text-sm text-ink-soft">
          <span className="font-medium text-ink">{question}</span> — {hint}
        </div>
        <div className="rounded-xl bg-tint-lilac px-3 py-2 text-sm font-medium text-accent-lilac">
          Цель: не менее {target}% · в среднем {average}%
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-3">
        <div className="space-y-4 @4xl:col-span-2">
          <div className="grid grid-cols-2 gap-3 @lg:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-3 @6xl:grid-cols-4">
            {divisions.map((div) => {
              const score = getSurvey(div.id)[metric]
              const band = getScoreBand(score, target)
              return (
                <motion.button
                  key={div.id}
                  type="button"
                  aria-pressed={selectedId === div.id}
                  onClick={() => setSelectedId(div.id)}
                  whileHover={{ y: -2 }}
                  className={clsx(
                    'relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-left shadow-card transition-shadow',
                    selectedId === div.id ? 'shadow-lift ring-2 ring-brand-red' : 'hover:shadow-lift',
                  )}
                  style={{ backgroundColor: alpha(band.color, 0.11) }}
                >
                  <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: band.color }} />
                  <div className="pl-1">
                    <div className="font-display text-base font-semibold text-ink">{div.shortName}</div>
                    <div className="text-[11px] text-ink-muted">{div.employeeCount} чел.</div>
                  </div>
                  <div className="pl-1">
                    <div className="font-display text-3xl font-semibold leading-none" style={{ color: band.color }}>
                      {score}%
                    </div>
                    <div className="mt-1 text-[11px] text-ink-soft">{band.label}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-ink-soft">
            <span>Относительно цели {target}%:</span>
            {Object.values(scoreBands).map((band) => (
              <span key={band.legend} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: band.color }} />
                {band.legend}
              </span>
            ))}
          </div>

          <Card>
            <h3 className="mb-3 font-display text-base font-semibold text-ink">Ритм опросов в году</h3>
            <div className="grid grid-cols-6 gap-2 @3xl:grid-cols-12">
              {MONTHS.map((month, i) => (
                <div
                  key={month}
                  className={clsx(
                    'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs',
                    i === currentMonth ? 'bg-brand-yellow-light ring-1 ring-brand-yellow' : 'bg-gray-50',
                  )}
                >
                  <span className={clsx('font-medium', i === currentMonth ? 'text-ink' : 'text-ink-soft')}>
                    {month}
                  </span>
                  <div className="flex gap-1">
                    {surveyKinds
                      .filter((kind) => kind.months === null || kind.months.includes(i))
                      .map((kind) => (
                        <Dot key={kind.id} color={kind.color} title={kind.title} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
              {surveyKinds.map((kind) => (
                <span key={kind.id} className="flex items-center gap-1.5">
                  <Dot color={kind.color} /> {kind.legend}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 content-start gap-4 @2xl:grid-cols-2 @4xl:grid-cols-1">
          <Card>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedDivision.color }} />
              <h3 className="font-display text-base font-semibold text-ink">{selectedDivision.name}</h3>
            </div>
            <div className="mb-4 text-xs text-ink-muted">{divisionKindLabels[selectedDivision.kind]}</div>

            <div className="space-y-3">
              {metricIds.map((id) => {
                const value = selectedSurvey[id]
                const metricTarget = surveyTargets[id].target
                const { color } = getScoreBand(value, metricTarget)
                return (
                  <div key={id}>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                      <span className={clsx(id === metric ? 'font-medium text-ink' : 'text-ink-soft')}>
                        {surveyTargets[id].label}
                      </span>
                      <span className="font-medium tabular-nums" style={{ color }}>
                        {value}% <span className="text-xs font-normal text-ink-muted">/ цель {metricTarget}%</span>
                      </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        key={`${selectedId}-${id}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="absolute inset-y-0 w-0.5 bg-ink/60" style={{ left: `${metricTarget}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat icon={Users} value={selectedDivision.employeeCount} label="сотрудников" />
              <MiniStat icon={TrendingUp} value={`${selectedSurvey.responseRate}%`} label="отклик" />
              <MiniStat icon={CalendarCheck2} value={fmt(selectedSurvey.lastSurveyDate, 'd MMM')} label="опрос" />
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-base font-semibold text-ink">Рейтинг: {label.toLowerCase()}</h3>
            <div className="space-y-2">
              {ranking.map((s) => {
                const { color } = getScoreBand(s[metric], target)
                return (
                  <button
                    key={s.divisionId}
                    type="button"
                    onClick={() => setSelectedId(s.divisionId)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-0.5 hover:bg-gray-50"
                  >
                    <span
                      className={clsx(
                        'w-12 text-left text-xs',
                        s.divisionId === selectedId ? 'font-bold text-ink' : 'text-ink-soft',
                      )}
                    >
                      {s.divisionName}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full" style={{ width: `${s[metric]}%`, backgroundColor: color }} />
                    </div>
                    <span className="w-9 text-right text-xs font-medium tabular-nums" style={{ color }}>
                      {s[metric]}%
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Dot({ color, title }: { color: string; title?: string }) {
  return <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} title={title} />
}

function MiniStat({ icon: Icon, value, label }: { icon: LucideIcon; value: ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2.5">
      <Icon size={13} className="mb-1 text-ink-muted" />
      <div className="text-base font-bold text-ink">{value}</div>
      <div className="text-[10px] text-ink-muted">{label}</div>
    </div>
  )
}
