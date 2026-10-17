import clsx from 'clsx'
import type { Binding, ThreeQuestions } from '../../types/communication'
import { foundationOptions, strategyOptions, valueOptions, type Priority } from '../../data/priorities'
import { threeQuestions } from '../../data/threeQuestions'
import { alpha } from '../../theme/colors'
import { toggleItem } from '../../utils/collections'
import { eyebrowClass, fieldClass, labelClass } from '../ui/styles'
import StepHeading from './StepHeading'

interface PassportFields {
  title: string
  essence: string
  keyMessage: string
  questions: ThreeQuestions
  binding: Binding
}

interface StepPassportProps extends PassportFields {
  onChange: (patch: Partial<PassportFields>) => void
}

const textField = clsx(fieldClass, 'focus:ring-1 focus:ring-brand-red')

export default function StepPassport({ title, essence, keyMessage, questions, binding, onChange }: StepPassportProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Суть и осмысление"
        description="Коротко и своими словами — так руководителям будет проще адаптировать сообщение для своих команд."
      />

      <div className="max-w-2xl space-y-4">
        <div>
          <label className={labelClass} htmlFor="p-title">
            Заголовок *
          </label>
          <input
            id="p-title"
            className={textField}
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Например: Новый порядок согласования командировок"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="p-essence">
            Суть * <span className="font-normal text-ink-muted">— что произошло или предлагается, 2–3 предложения</span>
          </label>
          <textarea
            id="p-essence"
            className={clsx(textField, 'resize-none')}
            rows={3}
            value={essence}
            onChange={(e) => onChange({ essence: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="p-key">
            Ключевое сообщение * <span className="font-normal text-ink-muted">— одна фраза</span>
          </label>
          <input
            id="p-key"
            className={textField}
            value={keyMessage}
            onChange={(e) => onChange({ keyMessage: e.target.value })}
            placeholder="Что сотрудник должен запомнить"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Правило трёх вопросов</h3>
        <p className="mb-3 text-xs text-ink-muted">
          п. 7.5 Положения: вопросы построены на фундаменте, стратегии и ценностях Компании
        </p>
        <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {threeQuestions.map((q, i) => (
            <div key={q.key} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: q.color }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-medium tracking-wide uppercase" style={{ color: q.color }}>
                  {q.basis}
                </span>
              </div>
              <label className="block text-[13px] leading-snug font-medium text-ink" htmlFor={`q-${q.key}`}>
                {q.question}
              </label>
              <div className="mt-0.5 mb-2 text-[11px] leading-snug text-ink-muted">{q.hint}</div>
              <textarea
                id={`q-${q.key}`}
                rows={3}
                className={clsx(textField, 'resize-none')}
                value={questions[q.key]}
                onChange={(e) => onChange({ questions: { ...questions, [q.key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Привязка к приоритетам компании</h3>
        <p className="mb-3 text-xs text-ink-muted">
          п. 7.2–7.3 и приложение Положения: можно выбрать несколько блоков фундамента, стратегии и ценностей
        </p>
        <div className="space-y-4">
          <BindingGroup
            label="Фундамент"
            options={foundationOptions}
            value={binding.foundation}
            onToggle={(id) => onChange({ binding: { ...binding, foundation: toggleItem(binding.foundation, id) } })}
          />
          <BindingGroup
            label="Стратегия"
            options={strategyOptions}
            value={binding.strategy}
            onToggle={(id) => onChange({ binding: { ...binding, strategy: toggleItem(binding.strategy, id) } })}
          />
          <BindingGroup
            label="Ценности"
            options={valueOptions}
            value={binding.values}
            onToggle={(id) => onChange({ binding: { ...binding, values: toggleItem(binding.values, id) } })}
          />
        </div>
      </div>
    </div>
  )
}

interface BindingGroupProps<T extends string> {
  label: string
  options: Priority<T>[]
  value: T[]
  onToggle: (id: T) => void
}

function BindingGroup<T extends string>({ label, options, value, onToggle }: BindingGroupProps<T>) {
  return (
    <div>
      <div className={clsx('mb-1.5', eyebrowClass)}>{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              title={o.description}
              onClick={() => onToggle(o.value)}
              className={clsx(
                'rounded-full border px-3 py-1.5 text-sm transition-all',
                active ? 'font-medium' : 'border-transparent bg-gray-100 text-ink-soft hover:bg-gray-200',
              )}
              style={
                active ? { borderColor: o.color, backgroundColor: alpha(o.color, 0.18), color: o.color } : undefined
              }
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
