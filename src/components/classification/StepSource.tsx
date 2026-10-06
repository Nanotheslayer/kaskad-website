import clsx from 'clsx'
import { sources } from '../../data/sources'
import { divisions } from '../../data/divisions'
import type { SourceId } from '../../types/communication'
import { getIcon } from '../../utils/icons'

interface Props {
  sourceId: SourceId | null
  onSource: (id: SourceId) => void
  initiatorName: string
  onInitiatorName: (v: string) => void
  directorate: string
  onDirectorate: (v: string) => void
}

const directorates = ['Генеральный директор', 'Администрация', ...divisions.map((d) => d.name)]

export default function StepSource({ sourceId, onSource, initiatorName, onInitiatorName, directorate, onDirectorate }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Инициатор и площадка смыслообразования</h2>
        <p className="mb-4 mt-1 text-sm text-ink-soft">
          Информация попадает в систему только через площадки смыслообразования (п. 5.2 Положения). Откуда она пришла?
        </p>

        <div className="mb-5 grid max-w-2xl gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="initiator">ФИО инициатора</label>
            <input
              id="initiator"
              value={initiatorName}
              onChange={(e) => onInitiatorName(e.target.value)}
              placeholder="Фамилия И.О."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="directorate">Дирекция</label>
            <select
              id="directorate"
              value={directorate}
              onChange={(e) => onDirectorate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-red focus:outline-none"
            >
              {directorates.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sources.map((s) => {
            const Icon = getIcon(s.icon)
            const selected = sourceId === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSource(s.id)}
                className={clsx(
                  'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                  selected ? 'border-brand-red bg-brand-red-light/50 shadow-sm' : 'border-transparent bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift',
                )}
              >
                <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', selected ? 'bg-brand-red text-white' : 'bg-tint-sun text-accent-sun')}>
                  {Icon && <Icon size={20} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-snug text-ink">{s.name}</div>
                  <div className="mt-0.5 text-xs text-ink-soft">{s.produces}</div>
                  <div className="mt-1 text-[11px] text-ink-muted">{s.frequency}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
