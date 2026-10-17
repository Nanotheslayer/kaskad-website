import { useState } from 'react'
import clsx from 'clsx'
import { Paperclip, Plus, UsersRound, X } from 'lucide-react'
import { ORG_ROOT_ID, PILOT_ID } from '../../data/orgStructure'
import { assigneesOf, toggleAudience } from '../../utils/assignments'
import { getNode } from '../../utils/orgTree'
import { fieldClass } from '../ui/styles'
import StepHeading from './StepHeading'

interface AudienceFields {
  audience: string[]
  materials: string[]
}

interface StepAudienceProps extends AudienceFields {
  onChange: (patch: Partial<AudienceFields>) => void
}

/** Что можно выбрать в пилоте: всю компанию, Дирекцию по персоналу или её подразделения */
const audienceOptions = [
  { id: ORG_ROOT_ID, label: 'Вся компания' },
  { id: PILOT_ID, label: getNode(PILOT_ID).title },
  ...getNode(PILOT_ID)
    .children.map(getNode)
    .filter((n) => n.kind === 'unit')
    .map((n) => ({ id: n.id, label: n.title })),
].map((o) => ({ ...o, managers: assigneesOf([o.id]).length }))

export default function StepAudience({ audience, materials, onChange }: StepAudienceProps) {
  const [draft, setDraft] = useState('')
  const managers = assigneesOf(audience).length

  const addMaterial = () => {
    const name = draft.trim()
    if (name && !materials.includes(name)) onChange({ materials: [...materials, name] })
    setDraft('')
  }

  return (
    <div className="space-y-8">
      <div>
        <StepHeading
          className="mb-4"
          title="Кому доводить"
          description="Задание о каскадировании получат руководители выбранных подразделений — у каждого оно появится в личной повестке. В пилоте задания получают руководители Дирекции по персоналу."
        />
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((o) => {
            const selected = audience.includes(o.id)
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ audience: toggleAudience(audience, o.id) })}
                className={clsx(
                  'max-w-full rounded-xl border-2 px-3 py-2 text-left text-sm transition-all',
                  selected
                    ? 'border-brand-red bg-brand-red-light/50 font-medium text-ink'
                    : 'border-transparent bg-white text-ink-soft shadow-card hover:shadow-lift',
                )}
              >
                <div className="leading-snug">{o.label}</div>
                <div className={clsx('text-[11px] font-normal', selected ? 'text-ink-soft' : 'text-ink-muted')}>
                  руководителей: {o.managers}
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-tint-sky/70 px-3 py-2 text-sm text-ink">
          <UsersRound size={16} className="shrink-0 text-accent-sky" />
          Задание получат руководителей: <span className="font-semibold">{managers}</span>
        </div>
      </div>

      <div className="max-w-xl">
        <StepHeading
          className="mb-3"
          title="Материалы"
          description="Протокол площадки, презентация, приказ — исходные материалы, по которым руководители готовят сообщение для команды (п. 5.2 Положения). Можно не добавлять."
        />
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
