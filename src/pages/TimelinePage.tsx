import { useState, useMemo } from 'react'
import { useCommunicationsStore } from '../store/communicationsStore'
import { communicationTypes } from '../data/communicationTypes'
import { channels } from '../data/channels'
import { sources } from '../data/sources'
import { getLevelLabel } from '../utils/cascadeEngine'
import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import { getIcon } from '../utils/icons'
import { Filter, AlertTriangle, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import clsx from 'clsx'

const urgencyLabels = { crisis: 'Кризис', urgent: 'Срочно', planned: 'Планово' }
const urgencyColors = { crisis: '#dc2626', urgent: '#d97706', planned: '#16a34a' }
const statusLabels = { draft: 'Черновик', active: 'Активна', completed: 'Завершена' }
const statusColors = { draft: '#6b7280', active: '#3b82f6', completed: '#16a34a' }

export default function TimelinePage() {
  const communications = useCommunicationsStore((s) => s.communications)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterUrgency, setFilterUrgency] = useState<string>('all')

  const filtered = useMemo(() => {
    let items = [...communications]
    if (filterType !== 'all') items = items.filter((c) => c.typeId === filterType)
    if (filterUrgency !== 'all') items = items.filter((c) => c.classification.urgency === filterUrgency)
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [communications, filterType, filterUrgency])

  return (
    <div className="max-w-3xl">
      {/* Фильтры */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter size={14} />
            Фильтры:
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-red focus:outline-none"
          >
            <option value="all">Все типы</option>
            {communicationTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-red focus:outline-none"
          >
            <option value="all">Любая срочность</option>
            <option value="crisis">Кризис</option>
            <option value="urgent">Срочно</option>
            <option value="planned">Планово</option>
          </select>
          <span className="text-xs text-gray-400">Найдено: {filtered.length}</span>
        </div>
      </Card>

      {/* Таймлайн */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

        {filtered.map((comm) => {
          const commType = communicationTypes.find((t) => t.id === comm.typeId)
          const source = sources.find((s) => s.id === comm.sourceId)
          const TypeIcon = commType ? getIcon(commType.icon) : null

          return (
            <div key={comm.id} className="relative mb-4 pl-12">
              {/* Точка на таймлайне */}
              <div
                className="absolute left-3 top-5 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ backgroundColor: commType?.color || '#6b7280' }}
              >
                {comm.isMandatoryCascade && (
                  <AlertTriangle size={10} className="text-white" />
                )}
              </div>

              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {commType && (
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: commType.color }}
                      >
                        {TypeIcon && <TypeIcon size={14} />}
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-brand-dark">{comm.title}</h3>
                  </div>
                  <Badge color={statusColors[comm.status]}>{statusLabels[comm.status]}</Badge>
                </div>

                {comm.description && (
                  <p className="text-sm text-gray-600 mb-3">{comm.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge color={commType?.color}>{commType?.name}</Badge>
                  <Badge color={urgencyColors[comm.classification.urgency]}>
                    {urgencyLabels[comm.classification.urgency]}
                  </Badge>
                  <Badge>{comm.cascadeDepth} — {getLevelLabel(comm.cascadeDepth)}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(comm.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                  </span>
                  {source && <span>Источник: {source.name}</span>}
                </div>

                {comm.requiredChannels.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="text-xs text-gray-400 mb-1.5">Каналы:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {comm.requiredChannels.map((chId) => {
                        const ch = channels.find((c) => c.id === chId)
                        return ch ? (
                          <span key={chId} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                            {ch.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {comm.isMandatoryCascade && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                    <AlertTriangle size={12} className="text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">Обязательное каскадирование через регулярные собрания</span>
                  </div>
                )}
              </Card>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="pl-12 py-10 text-center text-gray-400 text-sm">
            Нет коммуникаций по выбранным фильтрам
          </div>
        )}
      </div>
    </div>
  )
}
