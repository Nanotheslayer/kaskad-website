import { CalendarCheck2, Clock3, UsersRound } from 'lucide-react'
import clsx from 'clsx'
import type { TrackedCommunication } from '../../types/communication'
import { typeById } from '../../data/communicationTypes'
import { statusColors, statusLabels } from '../../data/statuses'
import { fmt } from '../../utils/format'
import Badge from '../ui/Badge'

interface CommunicationCardProps {
  comm: TrackedCommunication
  selected?: boolean
  onClick: () => void
}

export default function CommunicationCard({ comm, selected, onClick }: CommunicationCardProps) {
  const type = typeById(comm.typeId)
  const TypeIcon = type.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group flex w-full gap-3 rounded-2xl bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift',
        selected && 'ring-2 ring-brand-red',
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: type.color }}
      >
        <TypeIcon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-medium leading-snug text-ink">{comm.title}</h3>
          <Badge color={statusColors[comm.status]} className="shrink-0">
            {statusLabels[comm.status]}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{comm.essence}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Badge color={type.color}>{type.name}</Badge>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {fmt(comm.createdAt, 'd MMM, HH:mm')}
          </span>
          <span className="flex items-center gap-1">
            <CalendarCheck2 size={12} />
            довести до {fmt(comm.deadline, 'd MMM')}
          </span>
          {comm.status !== 'planned' && comm.progress.total > 0 && (
            <span className="flex items-center gap-1">
              <UsersRound size={12} />
              довели {comm.progress.done} из {comm.progress.total}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
