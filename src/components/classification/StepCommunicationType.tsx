import { communicationTypes } from '../../data/communicationTypes'
import type { CommunicationTypeId } from '../../types/communication'
import { getIcon } from '../../utils/icons'
import clsx from 'clsx'

interface Props {
  selected: CommunicationTypeId | null
  onSelect: (id: CommunicationTypeId) => void
}

export default function StepCommunicationType({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-dark mb-1">Шаг 2: Тип коммуникации</h2>
      <p className="text-sm text-gray-500 mb-5">Выберите тип передаваемой информации</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {communicationTypes.map((type) => {
          const Icon = getIcon(type.icon)
          const isSelected = selected === type.id
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={clsx(
                'flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
                isSelected
                  ? 'border-brand-red bg-red-50'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              )}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: type.color }}
              >
                {Icon && <Icon size={18} />}
              </div>
              <div>
                <div className="font-medium text-sm text-brand-dark">{type.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{type.purpose}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
