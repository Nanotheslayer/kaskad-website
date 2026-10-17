import clsx from 'clsx'
import type { ReactNode } from 'react'
import { alpha } from '../../theme/colors'

interface ChipProps {
  active: boolean
  color: string
  onClick: () => void
  children: ReactNode
  count?: number
}

/** Переключаемая «пастельная» плашка — как в легенде календаря «Петлокала» */
export default function Chip({ active, color, onClick, children, count }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-all',
        active ? 'font-medium text-ink' : 'border-transparent bg-gray-100 text-ink-muted hover:bg-gray-200',
      )}
      style={active ? { backgroundColor: alpha(color, 0.14), borderColor: alpha(color, 0.5) } : undefined}
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
