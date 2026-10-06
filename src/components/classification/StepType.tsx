import clsx from 'clsx'
import { communicationTypes } from '../../data/communicationTypes'
import type { CommunicationTypeId } from '../../types/communication'
import { getIcon } from '../../utils/icons'

interface Props {
  selected: CommunicationTypeId | null
  onSelect: (id: CommunicationTypeId) => void
}

export default function StepType({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Тип коммуникации</h2>
      <p className="mb-4 mt-1 text-sm text-ink-soft">
        Тип определяет глубину каскадирования, обязательные каналы и базовую тональность (п. 5.8 Положения).
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {communicationTypes.map((type) => {
          const Icon = getIcon(type.icon)
          const isSelected = selected === type.id
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={clsx(
                'flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all',
                isSelected ? 'shadow-sm' : 'border-transparent bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift',
              )}
              style={isSelected ? { borderColor: type.color, backgroundColor: type.color + '12' } : undefined}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: type.color }}>
                  {Icon && <Icon size={20} />}
                </div>
                <div className="text-sm font-medium leading-tight text-ink">{type.name}</div>
              </div>
              <div className="text-xs leading-snug text-ink-soft">{type.includes}</div>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                <span className="rounded-md px-1.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: type.color + '22', color: type.color }}>
                  {type.depthLabel}
                </span>
                <span className="text-[11px] text-ink-muted">{type.tone}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
