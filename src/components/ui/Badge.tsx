import clsx from 'clsx'
import type { ReactNode } from 'react'
import { alpha } from '../../theme/colors'

interface BadgeProps {
  children: ReactNode
  /** Цвет текста; фон — тот же цвет с прозрачностью. Без цвета — нейтральная серая плашка */
  color?: string
  className?: string
}

export default function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        !color && 'bg-gray-100 text-ink-soft',
        className,
      )}
      style={color ? { backgroundColor: alpha(color, 0.12), color } : undefined}
    >
      {children}
    </span>
  )
}
