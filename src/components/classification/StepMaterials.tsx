import { useState } from 'react'
import { Paperclip, Plus, X } from 'lucide-react'
import { fieldClass } from '../ui/styles'
import StepHeading from './StepHeading'

interface StepMaterialsProps {
  materials: string[]
  onChange: (materials: string[]) => void
}

export default function StepMaterials({ materials, onChange }: StepMaterialsProps) {
  const [draft, setDraft] = useState('')

  const addMaterial = () => {
    const name = draft.trim()
    if (name && !materials.includes(name)) onChange([...materials, name])
    setDraft('')
  }

  return (
    <div>
      <StepHeading
        className="mb-5"
        title="Материалы"
        description="Протокол площадки, презентация, приказ — исходные материалы, по которым руководители готовят сообщение для команды (п. 5.2 Положения). Шаг можно пропустить."
      />

      <div className="max-w-xl">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              e.preventDefault()
              addMaterial()
            }}
            placeholder="Презентация, протокол, приказ…"
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
                  onClick={() => onChange(materials.filter((x) => x !== m))}
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
