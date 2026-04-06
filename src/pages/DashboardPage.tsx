import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCommunicationsStore } from '../store/communicationsStore'
import { communicationTypes } from '../data/communicationTypes'
import { surveyResults } from '../data/surveyResults'
import { getAwarenessColor } from '../utils/colorScale'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Layers,
  BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { getIcon } from '../utils/icons'

const urgencyColors = { crisis: '#dc2626', urgent: '#d97706', planned: '#16a34a' }
const urgencyLabels = { crisis: 'Кризис', urgent: 'Срочно', planned: 'Планово' }

export default function DashboardPage() {
  const communications = useCommunicationsStore((s) => s.communications)

  const stats = useMemo(() => {
    const active = communications.filter((c) => c.status === 'active')
    const mandatory = communications.filter((c) => c.isMandatoryCascade && c.status === 'active')
    const crisis = communications.filter((c) => c.classification.urgency === 'crisis' && c.status === 'active')
    const avgAwareness = Math.round(
      surveyResults.reduce((sum, s) => sum + s.awarenessScore, 0) / surveyResults.length
    )
    return { total: communications.length, active: active.length, mandatory: mandatory.length, crisis: crisis.length, avgAwareness }
  }, [communications])

  const recentCommunications = useMemo(
    () => [...communications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [communications]
  )

  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {}
    communications.forEach((c) => { counts[c.typeId] = (counts[c.typeId] || 0) + 1 })
    return communicationTypes
      .map((t) => ({ ...t, count: counts[t.id] || 0 }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [communications])

  return (
    <div>
      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark">{stats.total}</div>
              <div className="text-xs text-gray-500">Всего</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark">{stats.active}</div>
              <div className="text-xs text-gray-500">Активные</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark">{stats.mandatory}</div>
              <div className="text-xs text-gray-500">Обязательных</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark">{stats.crisis}</div>
              <div className="text-xs text-gray-500">Кризисных</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: getAwarenessColor(stats.avgAwareness) }}>
                {stats.avgAwareness}%
              </div>
              <div className="text-xs text-gray-500">Осведомлённость</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Последние коммуникации */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-brand-dark">Последние коммуникации</h2>
              <Link to="/timeline" className="text-xs text-brand-red hover:underline flex items-center gap-1">
                Все <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentCommunications.map((comm) => {
                const commType = communicationTypes.find((t) => t.id === comm.typeId)
                const TypeIcon = commType ? getIcon(commType.icon) : null
                return (
                  <div key={comm.id} className="flex items-center gap-3 rounded-lg border border-gray-50 p-3 hover:bg-gray-50 transition-colors">
                    {commType && (
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: commType.color }}
                      >
                        {TypeIcon && <TypeIcon size={14} />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-brand-dark truncate">{comm.title}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(comm.createdAt), 'd MMM, HH:mm', { locale: ru })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge color={urgencyColors[comm.classification.urgency]}>
                        {urgencyLabels[comm.classification.urgency]}
                      </Badge>
                      {comm.isMandatoryCascade && (
                        <AlertTriangle size={14} className="text-amber-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-4">
          {/* Быстрые действия */}
          <Card>
            <h2 className="font-semibold text-brand-dark mb-3">Быстрые действия</h2>
            <div className="space-y-2">
              <Link to="/classify">
                <Button className="w-full justify-start">
                  <ClipboardList size={16} />
                  Новая коммуникация
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="secondary" className="w-full justify-start">
                  <BarChart3 size={16} />
                  Карта осведомлённости
                </Button>
              </Link>
            </div>
          </Card>

          {/* По типам */}
          <Card>
            <h2 className="font-semibold text-brand-dark mb-3">По типам</h2>
            <div className="space-y-2">
              {typeStats.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-xs text-gray-600">{t.name}</span>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">{t.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Осведомлённость — топ/аутсайдеры */}
          <Card>
            <h2 className="font-semibold text-brand-dark mb-3">Осведомлённость</h2>
            <div className="space-y-2">
              {surveyResults
                .sort((a, b) => a.awarenessScore - b.awarenessScore)
                .slice(0, 4)
                .map((s) => (
                  <div key={s.divisionId} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{s.divisionName}</span>
                    <span className="text-xs font-bold" style={{ color: getAwarenessColor(s.awarenessScore) }}>
                      {s.awarenessScore}%
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
