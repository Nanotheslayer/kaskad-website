import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
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
      style={color ? { backgroundColor: color + '1f', color } : undefined}
    >
      {children}
    </span>
  )
}
