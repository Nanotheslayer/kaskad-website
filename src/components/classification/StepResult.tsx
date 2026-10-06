import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { CascadeLevel, Communication, CommunicationTypeId } from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { typeById } from '../../data/communicationTypes'
import { levelById } from '../../data/levels'
import { getIcon } from '../../utils/icons'
import DepthLadder from '../communication/DepthLadder'
import ChannelList from '../communication/ChannelList'
import Badge from '../common/Badge'
import { urgencyColors, urgencyLabels, scaleLabels } from '../../data/classificationOptions'
import { fmt } from '../../utils/format'

interface Props {
  typeId: CommunicationTypeId
  draft: Pick<Communication, 'title' | 'keyMessage' | 'classification' | 'deadline'>
  depth: CascadeLevel
  depthReason: string
  extended: boolean
  required: ChannelId[]
  extra: ChannelId[]
  onToggleExtra: (id: ChannelId) => void
}

export default function StepResult({ typeId, draft, depth, depthReason, extended, required, extra, onToggleExtra }: Props) {
  const type = typeById(typeId)!
  const Icon = getIcon(type.icon)
  const lvl = levelById(depth)
  const isCrisis = typeId === 'crisis'

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Маршрут каскада</h2>
      <p className="mb-5 mt-1 text-sm text-ink-soft">Система определила глубину и обязательные каналы. Проверьте и отправьте.</p>

      <div className="mb-5 flex items-center gap-3 rounded-2xl p-4" style={{ backgroundColor: type.color + '14' }}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: type.color }}>
          {Icon && <Icon size={22} />}
        </div>
        <div className="min-w-0">
          <div className="font-medium leading-snug text-ink">{draft.title}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge color={type.color}>{type.name}</Badge>
            <Badge color={urgencyColors[draft.classification.urgency]}>{urgencyLabels[draft.classification.urgency]}</Badge>
            <Badge>{scaleLabels[draft.classification.impactScale]}</Badge>
            <Badge>довести до {fmt(draft.deadline, 'd MMM yyyy')}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="mb-1 font-display text-sm font-semibold text-ink">
            Глубина каскадирования — до {lvl.short}
          </h3>
          <p className="mb-4 flex items-start gap-1.5 text-xs text-ink-soft">
            <Info size={13} className="mt-0.5 shrink-0 text-ink-muted" />
            {depthReason}
          </p>
          <DepthLadder depth={depth} />
          {extended && <div className="mt-3 text-xs font-medium text-accent-mint">Глубина расширена до У.06 «при необходимости»</div>}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="mb-1 font-display text-sm font-semibold text-ink">Обязательные каналы</h3>
            <p className="mb-4 text-xs text-ink-soft">
              Минимальный набор по п. 6.3. Руководитель вправе добавить свои каналы, но не может исключить обязательные (п. 6.4).
            </p>
            <ChannelList required={required} extra={extra} onToggleExtra={onToggleExtra} />
          </div>

          {isCrisis ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-brand-red" />
              <div>
                <div className="text-sm font-medium text-red-800">Первым источником — руководитель</div>
                <div className="text-xs text-red-700">Для кризисных коммуникаций сначала устное доведение (или сообщение от генерального директора), а не цифровой канал.</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-tint-mint/70 p-4">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-mint" />
              <div>
                <div className="text-sm font-medium text-ink">Переводите, а не пересылайте</div>
                <div className="text-xs text-ink-soft">Руководитель каждого уровня объясняет команде, что это значит лично для них, и отвечает на вопросы.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
