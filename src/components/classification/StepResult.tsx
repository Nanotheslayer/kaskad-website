import type { CascadeLevel, ClassificationParams, CommunicationTypeId } from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { channels } from '../../data/channels'
import { communicationTypes } from '../../data/communicationTypes'
import { getLevelLabel, LEVEL_ORDER } from '../../utils/cascadeEngine'
import { getIcon } from '../../utils/icons'
import { ArrowDown, AlertTriangle, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  typeId: CommunicationTypeId
  classification: ClassificationParams
  cascadeDepth: CascadeLevel
  requiredChannels: ChannelId[]
  isMandatory: boolean
}

export default function StepResult({ typeId, cascadeDepth, requiredChannels, isMandatory }: Props) {
  const commType = communicationTypes.find((t) => t.id === typeId)
  const depthIndex = LEVEL_ORDER.indexOf(cascadeDepth)

  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-dark mb-1">Шаг 4: Результат классификации</h2>
      <p className="text-sm text-gray-500 mb-5">Система определила параметры каскадирования</p>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Глубина каскадирования */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-sm text-brand-dark mb-4">Глубина каскадирования</h3>
          <div className="space-y-2">
            {LEVEL_ORDER.map((level, i) => {
              const isReached = i <= depthIndex
              return (
                <div key={level} className="flex items-center gap-3">
                  <div
                    className={clsx(
                      'flex h-8 w-12 items-center justify-center rounded-lg text-xs font-bold',
                      isReached ? 'bg-brand-red text-white' : 'bg-gray-50 text-gray-300'
                    )}
                  >
                    {level}
                  </div>
                  <span className={clsx('text-sm', isReached ? 'text-brand-dark font-medium' : 'text-gray-300')}>
                    {getLevelLabel(level)}
                  </span>
                  {i === depthIndex && <ArrowDown size={14} className="text-brand-red" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Каналы */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-semibold text-sm text-brand-dark mb-3">Обязательные каналы</h3>
            <div className="space-y-2">
              {requiredChannels.map((chId) => {
                const ch = channels.find((c) => c.id === chId)
                if (!ch) return null
                const Icon = getIcon(ch.icon)
                return (
                  <div key={chId} className="flex items-center gap-3 rounded-lg bg-green-50 px-3 py-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-green-100 text-green-700">
                      {Icon && <Icon size={14} />}
                    </div>
                    <span className="text-sm font-medium text-green-800">{ch.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Статус */}
          <div className={clsx(
            'rounded-xl p-4 flex items-center gap-3',
            isMandatory ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'
          )}>
            {isMandatory ? (
              <>
                <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                <div>
                  <div className="font-medium text-sm text-amber-800">Обязательное каскадирование</div>
                  <div className="text-xs text-amber-600">Должно быть освещено на собраниях по регулярному менеджменту</div>
                </div>
              </>
            ) : (
              <>
                <CheckCircle size={20} className="text-green-600 shrink-0" />
                <div>
                  <div className="font-medium text-sm text-green-800">Стандартное каскадирование</div>
                  <div className="text-xs text-green-600">Через указанные каналы</div>
                </div>
              </>
            )}
          </div>

          {/* Тип */}
          {commType && (
            <div className="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg text-white flex items-center justify-center" style={{ backgroundColor: commType.color }}>
                {(() => {
                  const I = getIcon(commType.icon)
                  return I ? <I size={16} /> : null
                })()}
              </div>
              <div>
                <div className="text-sm font-medium text-brand-dark">{commType.name}</div>
                <div className="text-xs text-gray-500">{commType.purpose}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
