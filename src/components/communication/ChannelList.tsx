import clsx from 'clsx'
import { Check, Plus } from 'lucide-react'
import type { Channel, ChannelId } from '../../types/channel'
import { channelCategories, channels } from '../../data/channels'
import { alpha } from '../../theme/colors'
import { eyebrowClass } from '../ui/styles'

interface ChannelListProps {
  required: ChannelId[]
  extra?: ChannelId[]
  /** Если передан — можно добавлять дополнительные каналы (п. 6.4) */
  onToggleExtra?: (id: ChannelId) => void
}

const chipClass = 'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium'

/** Каналы, сгруппированные по направлениям п. 6.2. Обязательные нельзя убрать, дополнительные — можно добавить */
export default function ChannelList({ required, extra = [], onToggleExtra }: ChannelListProps) {
  const editable = Boolean(onToggleExtra)
  // В режиме редактирования показываем все каналы, иначе — только выбранные
  const groups = channelCategories
    .map((category) => ({
      category,
      items: channels.filter(
        (c) => c.category === category.id && (editable || required.includes(c.id) || extra.includes(c.id)),
      ),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {groups.map(({ category, items }) => (
        <div key={category.id}>
          <div className={clsx('mb-1.5 flex items-center gap-2', eyebrowClass)}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
            {category.name}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((channel) => (
              <ChannelChip
                key={channel.id}
                channel={channel}
                color={category.color}
                isRequired={required.includes(channel.id)}
                isExtra={extra.includes(channel.id)}
                onToggle={onToggleExtra}
              />
            ))}
          </div>
        </div>
      ))}
      {required.length === 0 && <div className="text-sm text-ink-muted">Каналы не определены</div>}
    </div>
  )
}

interface ChannelChipProps {
  channel: Channel
  color: string
  isRequired: boolean
  isExtra: boolean
  onToggle?: (id: ChannelId) => void
}

function ChannelChip({ channel, color, isRequired, isExtra, onToggle }: ChannelChipProps) {
  const Icon = channel.icon
  const filled = { backgroundColor: alpha(color, 0.13), color }
  const content = (
    <>
      <Icon size={14} />
      {channel.name}
      {isRequired && <Check size={12} />}
      {!isRequired && onToggle && !isExtra && <Plus size={12} />}
    </>
  )

  if (isRequired) {
    return (
      <span className={chipClass} style={filled} title="Обязательный канал">
        {content}
      </span>
    )
  }

  if (onToggle) {
    return (
      <button
        type="button"
        onClick={() => onToggle(channel.id)}
        className={clsx(
          chipClass,
          'border transition-colors',
          isExtra
            ? 'border-transparent'
            : 'border-dashed border-gray-300 text-ink-muted hover:border-gray-400 hover:text-ink',
        )}
        style={isExtra ? filled : undefined}
        title={isExtra ? 'Убрать дополнительный канал' : 'Добавить дополнительный канал'}
      >
        {content}
      </button>
    )
  }

  return (
    <span
      className={clsx(chipClass, 'border border-dashed')}
      style={{ borderColor: color, color }}
      title="Дополнительный канал"
    >
      {content}
    </span>
  )
}
