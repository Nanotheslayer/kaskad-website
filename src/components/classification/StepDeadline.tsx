import { useState } from 'react'
import clsx from 'clsx'
import { Paperclip, Plus, ShieldAlert, X } from 'lucide-react'
import type { Confidentiality } from '../../types/communication'
import { confidentialityOptions } from '../../data/classificationOptions'
import { fieldClass, labelClass } from '../ui/styles'
import StepHeading from './StepHeading'

interface StepDeadlineProps {
  deadline: string
  confidentiality: Confidentiality
  materials: string[]
  onChange: (patch: { deadline?: string; confidentiality?: Confidentiality; materials?: string[] }) => void
}

export default function StepDeadline({ deadline, confidentiality, materials, onChange }: StepDeadlineProps) {
  const [draft, setDraft] = useState('')

  const addMaterial = () => {
    const name = draft.trim()
    if (name && !materials.includes(name)) onChange({ materials: [...materials, name] })
    setDraft('')
  }

  return (
    <div className="space-y-6">
      <StepHeading
        title="Сроки, конфиденциальность и материалы"
        description="Дата доведения — крайний срок, к которому все узлы каскада подтверждают доведение."
      />

      <div className="max-w-xs">
        <label className={labelClass} htmlFor="deadline">
          Дата доведения *
        </label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          className={fieldClass}
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-ink">Метка конфиденциальности</div>
        <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-3">
          {confidentialityOptions.map((o) => {
            const selected = confidentiality === o.value
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ confidentiality: o.value })}
                className={clsx(
                  'rounded-2xl border-2 p-4 text-left transition-all',
                  selected
                    ? 'border-brand-red bg-brand-red-light/50'
                    : 'border-transparent bg-white shadow-card hover:shadow-lift',
                )}
              >
                <div className="text-sm font-medium text-ink">{o.label}</div>
                <div className="mt-0.5 text-xs text-ink-soft">{o.description}</div>
              </button>
            )
          })}
        </div>
        {confidentiality === 'restricted' && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-accent-rose">
            <ShieldAlert size={14} className="mt-0.5 shrink-0" />
            Каналы широкого охвата (ВК, ТВ, плакаты, журнал, лента «Петлокал») будут исключены из маршрута.
          </div>
        )}
      </div>

      <div className="max-w-xl">
        <div className="mb-2 text-sm font-medium text-ink">Материалы</div>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              e.preventDefault()
              addMaterial()
            }}
            placeholder="Презентация, приказ, документ…"
            aria-label="Название материала"
            className={fieldClass}
          />
          <button
            type="button"
            onClick={addMaterial}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-100 px-3 text-sm font-medium text-ink hover:bg-gray-200"
          >
            <Plus size={16} /> Добавить
          </button>
        </div>
        {materials.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {materials.map((m) => (
              <li
                key={m}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-ink shadow-card"
              >
                <Paperclip size={14} className="text-ink-muted" />
                <span className="flex-1">{m}</span>
                <button
                  type="button"
                  onClick={() => onChange({ materials: materials.filter((x) => x !== m) })}
                  className="text-ink-muted hover:text-brand-red"
                  aria-label={`Убрать «${m}»`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
