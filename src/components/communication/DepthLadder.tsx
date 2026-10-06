import clsx from 'clsx'
import { ArrowDown } from 'lucide-react'
import type { CascadeLevel } from '../../types/communication'
import { levels, levelIndex } from '../../data/levels'

interface Props {
  depth: CascadeLevel
}

/** Вертикальная «лестница» уровней с точками входа информации (п. 4 Положения) */
export default function DepthLadder({ depth }: Props) {
  const reachedIdx = levelIndex(depth)
  return (
    <div className="space-y-2">
      {levels.map((l, i) => {
        const reached = i <= reachedIdx
        return (
          <div key={l.id} className={clsx('flex items-start gap-3 rounded-xl p-2 transition-colors', reached ? 'bg-gray-50' : 'opacity-40')}>
            <div
              className={clsx('flex h-8 w-12 shrink-0 items-center justify-center rounded-lg text-xs font-bold', reached ? 'text-white' : 'bg-gray-200 text-gray-400')}
              style={reached ? { backgroundColor: l.color } : undefined}
            >
              {l.short}
            </div>
            <div className="min-w-0 flex-1">
              <div className={clsx('text-sm leading-tight', reached ? 'font-medium text-ink' : 'text-ink-muted')}>{l.title}</div>
              <div className="mt-0.5 text-xs leading-snug text-ink-muted">{l.entryPoint}</div>
            </div>
            {i === reachedIdx && <ArrowDown size={16} className="mt-2 shrink-0 text-brand-red" />}
          </div>
        )
      })}
    </div>
  )
}
