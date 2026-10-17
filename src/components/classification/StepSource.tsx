import clsx from 'clsx'
import type { SourceId } from '../../types/communication'
import { sources } from '../../data/sources'
import { divisions } from '../../data/divisions'
import { fieldClass, labelClass } from '../ui/styles'
import StepHeading from './StepHeading'

interface SourceFields {
  sourceId: SourceId | null
  initiatorName: string
  directorate: string
}

interface StepSourceProps extends SourceFields {
  onChange: (patch: Partial<SourceFields>) => void
}

const directorates = ['Генеральный директор', 'Администрация', ...divisions.map((d) => d.name)]

export default function StepSource({ sourceId, initiatorName, directorate, onChange }: StepSourceProps) {
  return (
    <div>
      <StepHeading
        className="mb-4"
        title="Инициатор и площадка смыслообразования"
        description="Информация для каскадирования формируется на площадках смыслообразования: там принимаются решения и формулируются ключевые сообщения (п. 5.1 Положения). Откуда она пришла?"
      />

      <div className="mb-5 grid max-w-2xl grid-cols-1 gap-3 @xl:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="initiator">
            ФИО инициатора
          </label>
          <input
            id="initiator"
            value={initiatorName}
            onChange={(e) => onChange({ initiatorName: e.target.value })}
            placeholder="Фамилия И.О."
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="directorate">
            Дирекция
          </label>
          <select
            id="directorate"
            value={directorate}
            onChange={(e) => onChange({ directorate: e.target.value })}
            className={fieldClass}
          >
            {directorates.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @5xl:grid-cols-3 @[100rem]:grid-cols-4">
        {sources.map((s) => {
          const Icon = s.icon
          const selected = sourceId === s.id
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange({ sourceId: s.id })}
              className={clsx(
                'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                selected
                  ? 'border-brand-red bg-brand-red-light/50 shadow-xs'
                  : 'border-transparent bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift',
              )}
            >
              <div
                className={clsx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  selected ? 'bg-brand-red text-white' : 'bg-tint-sun text-accent-sun',
                )}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-sm leading-snug font-medium text-ink">{s.name}</div>
                <div className="mt-0.5 text-xs text-ink-soft">{s.produces}</div>
                <div className="mt-1 text-[11px] text-ink-muted">{s.frequency}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
