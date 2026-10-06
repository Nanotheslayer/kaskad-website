import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, CalendarCheck2 } from 'lucide-react'
import clsx from 'clsx'
import { divisions } from '../data/divisions'
import { surveyResults, surveyTargets, type MetricId } from '../data/surveyResults'
import { getScoreColor, getScoreLabel } from '../utils/colorScale'
import { fmt } from '../utils/format'
import Card from '../components/common/Card'
import Segmented from '../components/ui/Segmented'

const metricOptions = (Object.keys(surveyTargets) as MetricId[]).map((id) => ({ value: id, label: surveyTargets[id].label }))

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
/** Ритм опросов — п. 8.2 и 8.4 Положения */
const engagementMonths = [3, 9] // апрель, октябрь — опрос вовлечённости (3 недели)
const interactionMonths = [5, 11] // июнь, декабрь — опрос взаимодействия

export default function CompanyMapPage() {
  const [metric, setMetric] = useState<MetricId>('awareness')
  const [selectedId, setSelectedId] = useState<string>('ufo')
  const target = surveyTargets[metric].target
  const currentMonth = new Date().getMonth()

  const sorted = useMemo(
    () => [...surveyResults].sort((a, b) => a[metric] - b[metric]),
    [metric],
  )
  const selectedSurvey = surveyResults.find((s) => s.divisionId === selectedId)!
  const selectedDivision = divisions.find((d) => d.id === selectedId)!
  const avg = Math.round(surveyResults.reduce((s, r) => s + r[metric], 0) / surveyResults.length)

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="max-w-full overflow-x-auto">
          <Segmented options={metricOptions} value={metric} onChange={setMetric} />
        </div>
        <div className="min-w-0 flex-1 basis-64 text-sm text-ink-soft">
          <span className="font-medium text-ink">{surveyTargets[metric].question}</span> — {surveyTargets[metric].hint}
        </div>
        <div className="rounded-xl bg-tint-lilac px-3 py-2 text-sm font-medium text-accent-lilac">
          Цель: не менее {target}% · в среднем {avg}%
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-3">
        <div className="space-y-4 @4xl:col-span-2">
          <div className="grid grid-cols-2 gap-3 @lg:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-3 @6xl:grid-cols-4">
            {divisions.map((div) => {
              const survey = surveyResults.find((s) => s.divisionId === div.id)!
              const score = survey[metric]
              const color = getScoreColor(score, target)
              const selected = selectedId === div.id
              return (
                <motion.button
                  key={div.id}
                  onClick={() => setSelectedId(div.id)}
                  whileHover={{ y: -2 }}
                  className={clsx(
                    'relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl p-4 text-left shadow-card transition-shadow',
                    selected ? 'ring-2 ring-brand-red shadow-lift' : 'hover:shadow-lift',
                  )}
                  style={{ backgroundColor: color + '1c' }}
                >
                  <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: color }} />
                  <div className="pl-1">
                    <div className="font-display text-base font-semibold text-ink">{div.shortName}</div>
                    <div className="text-[11px] text-ink-muted">{div.employeeCount} чел.</div>
                  </div>
                  <div className="pl-1">
                    <div className="font-display text-3xl font-semibold leading-none" style={{ color }}>
                      {score}%
                    </div>
                    <div className="mt-1 text-[11px] text-ink-soft">{getScoreLabel(score, target)}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-ink-soft">
            <span>Относительно цели {target}%:</span>
            {[
              ['#2fa84f', 'достигнута'],
              ['#f5a300', 'до 12 п.п. ниже'],
              ['#e5484d', 'более 12 п.п. ниже'],
            ].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                {l}
              </span>
            ))}
          </div>

          {/* Ритм опросов */}
          <Card>
            <h3 className="mb-3 font-display text-base font-semibold text-ink">Ритм опросов в году</h3>
            <div className="grid grid-cols-6 gap-2 @3xl:grid-cols-12">
              {MONTHS.map((m, i) => (
                <div
                  key={m}
                  className={clsx(
                    'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs',
                    i === currentMonth ? 'bg-brand-yellow-light ring-1 ring-brand-yellow' : 'bg-gray-50',
                  )}
                >
                  <span className={clsx('font-medium', i === currentMonth ? 'text-ink' : 'text-ink-soft')}>{m}</span>
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#3b9ae8]" title="Пульс-опрос" />
                    {engagementMonths.includes(i) && <span className="h-2 w-2 rounded-full bg-[#e255a1]" title="Опрос вовлечённости" />}
                    {interactionMonths.includes(i) && <span className="h-2 w-2 rounded-full bg-[#f5a300]" title="Опрос взаимодействия" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3b9ae8]" /> Пульс-опрос — ежемесячно, 2–3 вопроса</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#e255a1]" /> Вовлечённость — апрель и октябрь, 3 недели</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f5a300]" /> Взаимодействие — июнь и декабрь</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 content-start gap-4 @2xl:grid-cols-2 @4xl:grid-cols-1">
          <Card>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedDivision.color }} />
              <h3 className="font-display text-base font-semibold text-ink">{selectedDivision.name}</h3>
            </div>
            <div className="mb-4 text-xs text-ink-muted">
              {selectedDivision.kind === 'directorate' ? 'Дирекция' : selectedDivision.kind === 'division' ? 'Дивизион' : 'Служба'}
            </div>

            <div className="space-y-3">
              {(Object.keys(surveyTargets) as MetricId[]).map((id) => {
                const value = selectedSurvey[id]
                const t = surveyTargets[id].target
                const color = getScoreColor(value, t)
                return (
                  <div key={id}>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                      <span className={clsx(id === metric ? 'font-medium text-ink' : 'text-ink-soft')}>{surveyTargets[id].label}</span>
                      <span className="font-medium tabular-nums" style={{ color }}>
                        {value}% <span className="text-xs font-normal text-ink-muted">/ цель {t}%</span>
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
                      <span className="absolute inset-y-0 w-0.5 bg-ink/60" style={{ left: `${t}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-gray-50 p-2.5">
                <Users size={13} className="mb-1 text-ink-muted" />
                <div className="text-base font-bold text-ink">{selectedDivision.employeeCount}</div>
                <div className="text-[10px] text-ink-muted">сотрудников</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-2.5">
                <TrendingUp size={13} className="mb-1 text-ink-muted" />
                <div className="text-base font-bold text-ink">{selectedSurvey.responseRate}%</div>
                <div className="text-[10px] text-ink-muted">отклик</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-2.5">
                <CalendarCheck2 size={13} className="mb-1 text-ink-muted" />
                <div className="text-base font-bold text-ink">{fmt(selectedSurvey.lastSurveyDate, 'd MMM')}</div>
                <div className="text-[10px] text-ink-muted">опрос</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-base font-semibold text-ink">Рейтинг: {surveyTargets[metric].label.toLowerCase()}</h3>
            <div className="space-y-2">
              {sorted.map((s) => (
                <button key={s.divisionId} onClick={() => setSelectedId(s.divisionId)} className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-0.5 hover:bg-gray-50">
                  <span className={clsx('w-12 text-left text-xs', s.divisionId === selectedId ? 'font-bold text-ink' : 'text-ink-soft')}>{s.divisionName}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${s[metric]}%`, backgroundColor: getScoreColor(s[metric], target) }} />
                  </div>
                  <span className="w-9 text-right text-xs font-medium tabular-nums" style={{ color: getScoreColor(s[metric], target) }}>
                    {s[metric]}%
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
