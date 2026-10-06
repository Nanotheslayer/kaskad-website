import { useState } from 'react'
import clsx from 'clsx'
import { Paperclip, Plus, X, ShieldAlert } from 'lucide-react'
import type { Confidentiality } from '../../types/communication'
import { confidentialityOptions } from '../../data/classificationOptions'

interface Props {
  deadline: string
  onDeadline: (v: string) => void
  confidentiality: Confidentiality
  onConfidentiality: (v: Confidentiality) => void
  materials: string[]
  onMaterials: (v: string[]) => void
}

export default function StepDeadline({ deadline, onDeadline, confidentiality, onConfidentiality, materials, onMaterials }: Props) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (v && !materials.includes(v)) onMaterials([...materials, v])
    setDraft('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Сроки, конфиденциальность и материалы</h2>
        <p className="mt-1 text-sm text-ink-soft">Дата доведения — крайний срок, к которому все узлы каскада подтверждают доведение.</p>
      </div>

      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="deadline">Дата доведения *</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => onDeadline(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-red focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-ink">Метка конфиденциальности</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {confidentialityOptions.map((o) => {
            const selected = confidentiality === o.value
            return (
              <button
                key={o.value}
                onClick={() => onConfidentiality(o.value as Confidentiality)}
                className={clsx(
                  'rounded-2xl border-2 p-4 text-left transition-all',
                  selected ? 'border-brand-red bg-brand-red-light/50' : 'border-transparent bg-white shadow-card hover:shadow-lift',
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
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
            placeholder="Презентация, приказ, документ…"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-red focus:outline-none"
          />
          <button onClick={add} className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-100 px-3 text-sm font-medium text-ink hover:bg-gray-200">
            <Plus size={16} /> Добавить
          </button>
        </div>
        {materials.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {materials.map((m) => (
              <li key={m} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-ink shadow-card">
                <Paperclip size={14} className="text-ink-muted" />
                <span className="flex-1">{m}</span>
                <button onClick={() => onMaterials(materials.filter((x) => x !== m))} className="text-ink-muted hover:text-brand-red" aria-label="Убрать">
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
