import clsx from 'clsx'
import type { Binding, ThreeQuestions } from '../../types/communication'
import { foundationOptions, strategyOptions, valueOptions } from '../../data/classificationOptions'
import type { BindingOption } from '../../data/classificationOptions'

interface Props {
  title: string
  essence: string
  keyMessage: string
  questions: ThreeQuestions
  binding: Binding
  onChange: (patch: { title?: string; essence?: string; keyMessage?: string; questions?: ThreeQuestions; binding?: Binding }) => void
}

const input =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red'

const questionMeta: { key: keyof ThreeQuestions; badge: string; label: string; hint: string; color: string }[] = [
  {
    key: 'q1',
    badge: 'Фундамент',
    label: 'Что именно произошло / какое решение принято и какой приоритет компании это затрагивает?',
    hint: 'Сервис, CJM, IT или люди',
    color: '#4f6bed',
  },
  {
    key: 'q2',
    badge: 'Стратегия',
    label: 'К какой стратегической цели это ведёт?',
    hint: 'Основной бизнес, расширение географии, расширение ассортимента, стройка и ремонт «от и до»',
    color: '#f26b21',
  },
  {
    key: 'q3',
    badge: 'Ценности',
    label: 'Что это значит для нашей команды и через какую ценность мы это проживаем?',
    hint: '«Человек в приоритете», «Развитие», «Преодоление»',
    color: '#e255a1',
  },
]

function toggle<T extends string>(list: T[], id: T): T[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function BindingGroup<T extends string>({
  label,
  options,
  value,
  onToggle,
}: {
  label: string
  options: BindingOption<T>[]
  value: T[]
  onToggle: (id: T) => void
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.id)
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              title={o.description}
              onClick={() => onToggle(o.id)}
              className={clsx(
                'rounded-full border px-3 py-1.5 text-sm transition-all',
                active ? 'font-medium' : 'border-transparent bg-gray-100 text-ink-soft hover:bg-gray-200',
              )}
              style={active ? { borderColor: o.color, backgroundColor: o.color + '2e', color: o.color } : undefined}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function StepPassport({ title, essence, keyMessage, questions, binding, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Суть и осмысление</h2>
        <p className="mt-1 text-sm text-ink-soft">Коротко и своими словами — так, чтобы руководитель мог «перевести», а не переслать.</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="p-title">Заголовок *</label>
          <input id="p-title" className={input} value={title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Например: Новый порядок согласования командировок" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="p-essence">Суть * <span className="font-normal text-ink-muted">— что произошло или предлагается, 2–3 предложения</span></label>
          <textarea id="p-essence" className={clsx(input, 'resize-none')} rows={3} value={essence} onChange={(e) => onChange({ essence: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="p-key">Ключевое сообщение * <span className="font-normal text-ink-muted">— одна фраза</span></label>
          <input id="p-key" className={input} value={keyMessage} onChange={(e) => onChange({ keyMessage: e.target.value })} placeholder="Что сотрудник должен запомнить" />
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Правило трёх вопросов</h3>
        <p className="mb-3 text-xs text-ink-muted">п. 5.7 Положения: вопросы построены на фундаменте, стратегии и ценностях компании</p>
        <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {questionMeta.map((q, i) => (
            <div key={q.key} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: q.color }}>
                  {i + 1}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: q.color }}>{q.badge}</span>
              </div>
              <label className="block text-[13px] font-medium leading-snug text-ink" htmlFor={`q-${q.key}`}>{q.label}</label>
              <div className="mb-2 mt-0.5 text-[11px] leading-snug text-ink-muted">{q.hint}</div>
              <textarea
                id={`q-${q.key}`}
                rows={3}
                className={clsx(input, 'resize-none')}
                value={questions[q.key]}
                onChange={(e) => onChange({ questions: { ...questions, [q.key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Привязка к приоритетам компании</h3>
        <p className="mb-3 text-xs text-ink-muted">Приложение 2: можно выбрать несколько блоков фундамента, стратегии и ценностей</p>
        <div className="space-y-4">
          <BindingGroup label="Фундамент" options={foundationOptions} value={binding.foundation} onToggle={(id) => onChange({ binding: { ...binding, foundation: toggle(binding.foundation, id) } })} />
          <BindingGroup label="Стратегия" options={strategyOptions} value={binding.strategy} onToggle={(id) => onChange({ binding: { ...binding, strategy: toggle(binding.strategy, id) } })} />
          <BindingGroup label="Ценности" options={valueOptions} value={binding.values} onToggle={(id) => onChange({ binding: { ...binding, values: toggle(binding.values, id) } })} />
        </div>
      </div>
    </div>
  )
}
