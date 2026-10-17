import clsx from 'clsx'
import type { CascadeLevel } from '../../types/communication'
import { isWithinDepth, levels } from '../../data/levels'

interface DepthScaleProps {
  depth: CascadeLevel
  extended?: boolean
}

/** Компактная шкала У.01–У.06: уровни до нижней границы каскада закрашены */
export default function DepthScale({ depth, extended }: DepthScaleProps) {
  return (
    <div>
      <div className="flex gap-1">
        {levels.map((l) => {
          const reached = isWithinDepth(l.id, depth)
          return (
            <div
              key={l.id}
              title={`${l.short} — ${l.title}`}
              className={clsx(
                'flex h-8 flex-1 items-center justify-center rounded-lg text-[11px] font-bold transition-colors',
                reached ? 'text-white' : 'bg-gray-100 text-gray-300',
              )}
              style={reached ? { backgroundColor: l.color } : undefined}
            >
              {l.short}
            </div>
          )
        })}
      </div>
      {extended && <div className="mt-1.5 text-xs text-ink-muted">Глубина расширена «при необходимости» (п. 5.8)</div>}
    </div>
  )
}
