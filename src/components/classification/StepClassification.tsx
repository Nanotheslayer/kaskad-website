import clsx from 'clsx'
import type { ClassificationParams, CommunicationTypeId } from '../../types/communication'
import {
  impactScaleOptions,
  impactTypeOptions,
  toneOptions,
  urgencyOptions,
  type Option,
} from '../../data/classificationOptions'
import { typeById } from '../../data/communicationTypes'
import { alpha, palette } from '../../theme/colors'
import StepHeading from './StepHeading'

interface StepClassificationProps {
  typeId: CommunicationTypeId | null
  params: Partial<ClassificationParams>
  onChange: <K extends keyof ClassificationParams>(key: K, value: ClassificationParams[K]) => void
}

export default function StepClassification({ typeId, params, onChange }: StepClassificationProps) {
  const type = typeId ? typeById(typeId) : null
  return (
    <div>
      <StepHeading
        className="mb-5"
        title="Классификация"
        description="Четыре свойства «паспорта» инфоповода (п. 5.3 Положения). Они уточняют глубину и тон сообщения."
      />
      <div className="space-y-6">
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
          label="Ожидаемый тип воздействия"
          description="Что должно произойти в результате?"
          options={impactTypeOptions}
          value={params.impactType}
          onChange={(v) => onChange('impactType', v)}
        />
        <PropertyGroup
          label="Тональность"
          description={
            type ? `Базовая тональность типа «${type.name}»: ${type.tone.toLowerCase()}` : 'В каком тоне подаём?'
          }
          options={toneOptions}
          value={params.tone}
          onChange={(v) => onChange('tone', v)}
        />
      </div>
    </div>
  )
}

interface PropertyGroupProps<T extends string> {
  label: string
  description: string
  options: Option<T>[]
  value: T | undefined
  onChange: (value: T) => void
}

function PropertyGroup<T extends string>({ label, description, options, value, onChange }: PropertyGroupProps<T>) {
  return (
    <div>
      <div className="mb-2">
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-ink-muted">{description}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value
          const color = opt.color ?? palette.brandRed
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              title={opt.description}
              className={clsx(
                'rounded-xl border-2 px-4 py-2 text-left text-sm transition-all',
                selected ? 'font-medium' : 'border-transparent bg-white text-ink-soft shadow-card hover:shadow-lift',
              )}
              style={selected ? { borderColor: color, backgroundColor: alpha(color, 0.08), color } : undefined}
            >
              <div>{opt.label}</div>
              <div className={clsx('text-[11px] font-normal', selected ? 'opacity-80' : 'text-ink-muted')}>
                {opt.description}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
