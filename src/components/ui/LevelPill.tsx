import clsx from 'clsx'
import type { CascadeLevel } from '../../types/communication'
import { levelById } from '../../data/levels'

interface Props {
  level: CascadeLevel
  muted?: boolean
  className?: string
}

export default function LevelPill({ level, muted, className }: Props) {
  const info = levelById(level)
  return (
    <span
      className={clsx(
        'inline-flex h-6 min-w-[2.75rem] shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tracking-wide',
        muted ? 'bg-gray-200 text-gray-400' : 'text-white',
        className,
      )}
      style={muted ? undefined : { backgroundColor: info.color }}
    >
      {info.short}
    </span>
  )
}
