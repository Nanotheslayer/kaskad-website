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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        !color && 'bg-gray-100 text-gray-700',
        className
      )}
      style={color ? { backgroundColor: color + '20', color } : undefined}
    >
      {children}
    </span>
  )
}
