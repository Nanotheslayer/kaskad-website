import clsx from 'clsx'
import { Plus, Check } from 'lucide-react'
import type { ChannelId } from '../../types/channel'
import { channelCategories, channelById, channels } from '../../data/channels'
import { getIcon } from '../../utils/icons'

interface Props {
  required: string[]
  extra?: string[]
  /** Если передан — можно добавлять дополнительные каналы (п. 6.4) */
  onToggleExtra?: (id: ChannelId) => void
}

/** Каналы, сгруппированные по направлениям п. 6.2. Обязательные нельзя убрать, дополнительные — можно добавить */
export default function ChannelList({ required, extra = [], onToggleExtra }: Props) {
  const groups = channelCategories
    .map((cat) => ({
      cat,
      items: channels.filter((c) => c.category === cat.id && (required.includes(c.id) || extra.includes(c.id) || onToggleExtra)),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {groups.map(({ cat, items }) => (
        <div key={cat.id}>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.name}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((ch) => {
              const Icon = getIcon(ch.icon)
              const isRequired = required.includes(ch.id)
              const isExtra = extra.includes(ch.id)
              const content = (
                <>
                  {Icon && <Icon size={14} />}
                  {ch.name}
                  {isRequired && <Check size={12} />}
                  {!isRequired && onToggleExtra && !isExtra && <Plus size={12} />}
                </>
              )
              const base = 'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium'
              if (isRequired) {
                return (
                  <span key={ch.id} className={clsx(base)} style={{ backgroundColor: cat.color + '22', color: cat.color }} title="Обязательный канал">
                    {content}
                  </span>
                )
              }
              if (onToggleExtra) {
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => onToggleExtra(ch.id)}
                    className={clsx(base, 'border transition-colors', isExtra ? 'border-transparent' : 'border-dashed border-gray-300 text-ink-muted hover:border-gray-400 hover:text-ink')}
                    style={isExtra ? { backgroundColor: cat.color + '22', color: cat.color } : undefined}
                    title={isExtra ? 'Убрать дополнительный канал' : 'Добавить дополнительный канал'}
                  >
                    {content}
                  </button>
                )
              }
              return (
                <span key={ch.id} className={clsx(base, 'border border-dashed')} style={{ borderColor: cat.color, color: cat.color }} title="Дополнительный канал">
                  {content}
                </span>
              )
            })}
          </div>
        </div>
      ))}
      {required.map((id) => channelById(id)).filter(Boolean).length === 0 && (
        <div className="text-sm text-ink-muted">Каналы не определены</div>
      )}
    </div>
  )
}
