import clsx from 'clsx'
import type { ReactNode } from 'react'

interface ChipProps {
  active: boolean
  color: string
  onClick: () => void
  children: ReactNode
  count?: number
}

/** Переключаемая плашка фильтра: цвет категории — только у точки, сама плашка нейтральная */
export default function Chip({ active, color, onClick, children, count }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-all',
        active
          ? 'border-gray-300 bg-white font-medium text-ink shadow-xs'
          : 'border-transparent bg-gray-100 text-ink-muted hover:bg-gray-200',
      )}
    >
      <span
        className="h-2.5 w-2.5 rounded-full transition-opacity"
        style={{ backgroundColor: color, opacity: active ? 1 : 0.35 }}
      />
      {children}
      {count !== undefined && (
        <span className={clsx('text-xs tabular-nums', active ? 'text-ink-soft' : 'text-ink-muted')}>{count}</span>
      )}
    </button>
  )
}
