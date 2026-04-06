import { useState } from 'react'
import { divisions } from '../data/divisions'
import { surveyResults } from '../data/surveyResults'
import { getAwarenessColor, getAwarenessLabel, getAwarenessBg } from '../utils/colorScale'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { motion } from 'framer-motion'
import { Users, TrendingUp, BarChart3 } from 'lucide-react'
import clsx from 'clsx'

export default function CompanyMapPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedSurvey = selectedId ? surveyResults.find((s) => s.divisionId === selectedId) : null
  const selectedDivision = selectedId ? divisions.find((d) => d.id === selectedId) : null

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Карта подразделений компании с уровнем информированности по пульс-опросам
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Карта-пазл */}
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-3 gap-2">
              {divisions.map((div) => {
                const survey = surveyResults.find((s) => s.divisionId === div.id)
                const score = survey?.awarenessScore ?? 0
                const color = getAwarenessColor(score)
                const isHovered = hoveredId === div.id
                const isSelected = selectedId === div.id

                return (
                  <motion.button
                    key={div.id}
                    onMouseEnter={() => setHoveredId(div.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(selectedId === div.id ? null : div.id)}
                    whileHover={{ scale: 1.03 }}
                    className={clsx(
                      'relative rounded-2xl p-4 text-left transition-all h-32 flex flex-col justify-between',
                      isSelected ? 'ring-2 ring-brand-red shadow-lg' : 'hover:shadow-md'
                    )}
                    style={{
                      backgroundColor: color + '18',
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm text-brand-dark">{div.shortName}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{div.employeeCount} чел.</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color }}>
                        {score}%
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {getAwarenessLabel(score)}
                      </div>
                    </div>

                    {/* Пульсация при наведении */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        className="absolute inset-0 rounded-2xl"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </Card>

          {/* Легенда */}
          <div className="mt-4 flex items-center gap-6">
            <span className="text-xs text-gray-500">Уровень осведомлённости:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-500">&lt; 55%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-500">55–74%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">&ge; 75%</span>
            </div>
          </div>
        </div>

        {/* Детали */}
        <div>
          {selectedDivision && selectedSurvey ? (
            <Card>
              <h3 className="font-semibold text-brand-dark mb-4">{selectedDivision.name}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Осведомлённость</span>
                  <Badge className={getAwarenessBg(selectedSurvey.awarenessScore)}>
                    {selectedSurvey.awarenessScore}%
                  </Badge>
                </div>

                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSurvey.awarenessScore}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getAwarenessColor(selectedSurvey.awarenessScore) }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Users size={12} />
                      Сотрудники
                    </div>
                    <div className="text-lg font-bold text-brand-dark">{selectedDivision.employeeCount}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <TrendingUp size={12} />
                      Отклик
                    </div>
                    <div className="text-lg font-bold text-brand-dark">{selectedSurvey.responseRate}%</div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <BarChart3 size={12} />
                    Последний опрос
                  </div>
                  <div className="text-sm font-medium text-brand-dark">{selectedSurvey.lastSurveyDate}</div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center h-64 text-center">
              <BarChart3 size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Выберите подразделение<br />для просмотра деталей</p>
            </Card>
          )}

          {/* Сводка */}
          <Card className="mt-4">
            <h3 className="font-semibold text-sm text-brand-dark mb-3">Сводка</h3>
            <div className="space-y-2">
              {surveyResults
                .sort((a, b) => a.awarenessScore - b.awarenessScore)
                .map((s) => (
                  <div key={s.divisionId} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{s.divisionName}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.awarenessScore}%`,
                            backgroundColor: getAwarenessColor(s.awarenessScore),
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right" style={{ color: getAwarenessColor(s.awarenessScore) }}>
                        {s.awarenessScore}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
