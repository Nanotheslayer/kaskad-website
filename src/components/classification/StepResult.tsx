import { AlertTriangle, CalendarCheck2, ChevronRight, ListChecks } from 'lucide-react'
import type { CommunicationTypeId } from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { typeById } from '../../data/communicationTypes'
import { levels } from '../../data/levels'
import { managerRules } from '../../data/managerRules'
import { crisisChannelsNote } from '../../data/crisis'
import { deliveryDeadline, describeDeliveryRule } from '../../utils/cascadeEngine'
import { fmt } from '../../utils/format'
import ChannelList from '../communication/ChannelList'
import Badge from '../ui/Badge'
import LevelPill from '../ui/LevelPill'
import StepHeading from './StepHeading'

interface StepResultProps {
  typeId: CommunicationTypeId
  title: string
  /** Момент запуска каскада — от него считается срок доведения */
  launchAt: Date
  /** Сколько руководителей получат задание о каскадировании */
  managers: number
  required: ChannelId[]
  extra: ChannelId[]
  onToggleExtra: (id: ChannelId) => void
}

export default function StepResult({
  typeId,
  title,
  launchAt,
  managers,
  required,
  extra,
  onToggleExtra,
}: StepResultProps) {
  const type = typeById(typeId)
  const TypeIcon = type.icon
  const deadline = deliveryDeadline(typeId, launchAt)
  const isCrisis = typeId === 'crisis'

  return (
    <div>
      <StepHeading
        className="mb-5"
        title="Маршрут каскада"
        description="Тип определил тональность и обязательные каналы. Проверьте, добавьте свои каналы и запустите каскад."
      />

      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: type.color }}
        >
          <TypeIcon size={22} />
        </div>
        <div className="min-w-0">
          <div className="leading-snug font-medium text-ink">{title}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge color={type.color}>{type.name}</Badge>
            <Badge>Тональность: {type.tone.toLowerCase()}</Badge>
            <Badge>довести до {fmt(deadline, isCrisis ? 'd MMM, HH:mm' : 'd MMM yyyy')}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 @4xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="mb-1 font-display text-sm font-semibold text-ink">Обязательные каналы</h3>
          <p className="mb-4 text-xs text-ink-soft">
            Минимум по таблице п. 5.4: дополнительные каналы можно добавить, обязательные не исключаются. Публикацию в
            корпоративных каналах обеспечивает инициатор вместе с ведущим менеджером по корпоративным коммуникациям,
            встречи с командой — руководители (п. 6.2).
          </p>
          <ChannelList required={required} extra={extra} onToggleExtra={onToggleExtra} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-ink">
              <CalendarCheck2 size={16} className="text-ink-muted" />
              Доведение
            </h3>
            <p className="mb-2 text-sm text-ink">
              Задание о каскадировании получат руководителей: <span className="font-semibold">{managers}</span> — оно
              появится в их личной повестке.
            </p>
            <p className="text-sm text-ink">
              Руководители доводят сообщение {describeDeliveryRule(typeId)} — для запуска сегодня{' '}
              <span className="font-semibold">не позднее {fmt(deadline, isCrisis ? 'd MMM, HH:mm' : 'd MMMM')}</span>.
            </p>
            <p className="mt-3 text-xs text-ink-soft">
              Каскад идёт сверху вниз: на каждом уровне руководитель получает информацию раньше своей команды (п. 3.2,
              4.1). Конечный адресат — сотрудники уровня У6.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              {levels.map((l, i) => (
                <span key={l.id} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={12} className="text-ink-muted" />}
                  <LevelPill level={l.id} />
                </span>
              ))}
            </div>
          </div>

          {isCrisis ? (
            <div className="flex items-start gap-3 rounded-2xl border border-brand-red/25 bg-brand-red-light p-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-brand-red" />
              <div>
                <div className="text-sm font-medium text-brand-red-dark">Антикризисная коммуникация (раздел 9)</div>
                <div className="text-xs text-ink-soft">{crisisChannelsNote}.</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-brand-yellow-light p-4">
              <ListChecks size={20} className="mt-0.5 shrink-0 text-brand-black" />
              <div>
                <div className="text-sm font-medium text-ink">Правила доведения (п. 7.6)</div>
                <ul className="mt-1 space-y-0.5 text-xs text-ink-soft">
                  {managerRules.map((r) => (
                    <li key={r.title}>{r.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
