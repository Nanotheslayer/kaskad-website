import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  active: boolean
  color: string
  onClick: () => void
  children: ReactNode
  count?: number
}

/** Переключаемая «пастельная» плашка — как в легенде календаря «Петлокала» */
export default function Chip({ active, color, onClick, children, count }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all',
        active ? 'font-medium text-ink' : 'border-transparent bg-gray-100 text-ink-muted hover:bg-gray-200',
      )}
      style={active ? { backgroundColor: color + '24', borderColor: color + '80' } : undefined}
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
