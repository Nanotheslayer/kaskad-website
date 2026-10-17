import clsx from 'clsx'
import type { CommunicationTypeId } from '../../types/communication'
import { communicationTypes } from '../../data/communicationTypes'
import { alpha } from '../../theme/colors'
import { describeDepthRule } from '../../utils/cascadeEngine'
import StepHeading from './StepHeading'

interface StepTypeProps {
  selected: CommunicationTypeId | null
  onSelect: (id: CommunicationTypeId) => void
}

export default function StepType({ selected, onSelect }: StepTypeProps) {
  return (
    <div>
      <StepHeading
        className="mb-4"
        title="Тип коммуникации"
        description="Тип определяет глубину каскадирования, обязательные каналы и базовую тональность (п. 5.8 Положения)."
      />
      <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @5xl:grid-cols-3 @[100rem]:grid-cols-4">
        {communicationTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selected === type.id
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(type.id)}
              className={clsx(
                'flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all',
                isSelected
                  ? 'shadow-sm'
                  : 'border-transparent bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift',
              )}
              style={isSelected ? { borderColor: type.color, backgroundColor: alpha(type.color, 0.07) } : undefined}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: type.color }}
                >
                  <Icon size={20} />
                </div>
                <div className="text-sm font-medium leading-tight text-ink">{type.name}</div>
              </div>
              <div className="text-xs leading-snug text-ink-soft">{type.includes}</div>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                <span
                  className="rounded-md px-1.5 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: alpha(type.color, 0.13), color: type.color }}
                >
                  {describeDepthRule(type.id)}
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
