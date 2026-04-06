import type { ClassificationParams } from '../../types/communication'
import {
  impactScaleOptions,
  urgencyOptions,
  impactTypeOptions,
  complexityOptions,
  sensitivityOptions,
} from '../../data/classificationOptions'
import type { ClassificationOption } from '../../data/classificationOptions'
import clsx from 'clsx'

interface Props {
  params: Partial<ClassificationParams>
  onChange: (key: keyof ClassificationParams, value: string) => void
}

interface PropertyGroupProps {
  label: string
  description: string
  options: ClassificationOption[]
  value: string | undefined
  onChange: (value: string) => void
}

function PropertyGroup({ label, description, options, value, onChange }: PropertyGroupProps) {
  return (
    <div>
      <div className="mb-2">
        <div className="font-medium text-sm text-brand-dark">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all',
              value === opt.value
                ? 'border-brand-red bg-red-50 text-brand-red'
                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
            )}
            style={
              value === opt.value && opt.color
                ? { borderColor: opt.color, backgroundColor: opt.color + '15', color: opt.color }
                : undefined
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StepProperties({ params, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-dark mb-1">Шаг 3: Свойства информации</h2>
      <p className="text-sm text-gray-500 mb-5">Классифицируйте информационное сообщение</p>
      <div className="space-y-5">
        <PropertyGroup
          label="Масштаб влияния"
          description="Кого затрагивает информация?"
          options={impactScaleOptions}
          value={params.impactScale}
          onChange={(v) => onChange('impactScale', v)}
        />
        <PropertyGroup
          label="Срочность"
          description="Как быстро нужно донести?"
          options={urgencyOptions}
          value={params.urgency}
          onChange={(v) => onChange('urgency', v)}
        />
        <PropertyGroup
          label="Тип воздействия"
          description="Что должно произойти в результате?"
          options={impactTypeOptions}
          value={params.impactType}
          onChange={(v) => onChange('impactType', v)}
        />
        <PropertyGroup
          label="Сложность"
          description="Насколько сложно для восприятия?"
          options={complexityOptions}
          value={params.complexity}
          onChange={(v) => onChange('complexity', v)}
        />
        <PropertyGroup
          label="Чувствительность"
          description="Уровень конфиденциальности"
          options={sensitivityOptions}
          value={params.sensitivity}
          onChange={(v) => onChange('sensitivity', v)}
        />
      </div>
    </div>
  )
}
