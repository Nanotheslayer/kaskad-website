import { sources } from '../../data/sources'
import type { SourceId } from '../../types/communication'
import { getIcon } from '../../utils/icons'
import clsx from 'clsx'

interface Props {
  selected: SourceId | null
  onSelect: (id: SourceId) => void
}

export default function StepPlatform({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-dark mb-1">Шаг 1: Источник информации</h2>
      <p className="text-sm text-gray-500 mb-5">Откуда поступает коммуникация?</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sources.map((source) => {
          const Icon = getIcon(source.icon)
          const isSelected = selected === source.id
          return (
            <button
              key={source.id}
              onClick={() => onSelect(source.id)}
              className={clsx(
                'flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
                isSelected
                  ? 'border-brand-red bg-red-50'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              )}
            >
              <div className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                isSelected ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600'
              )}>
                {Icon && <Icon size={20} />}
              </div>
              <div>
                <div className="font-medium text-sm text-brand-dark">{source.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{source.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
