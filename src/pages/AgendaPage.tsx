import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { differenceInCalendarDays } from 'date-fns'
import clsx from 'clsx'
import {
  AlertTriangle,
  CalendarClock,
  CheckCheck,
  ChevronDown,
  ClipboardCopy,
  FileText,
  Paperclip,
  PartyPopper,
  Quote,
  RotateCcw,
} from 'lucide-react'
import type { OrgNode } from '../types/organization'
import { currentUser } from '../data/currentUser'
import { typeById } from '../data/communicationTypes'
import { levelById, levels } from '../data/levels'
import { threeQuestions } from '../data/threeQuestions'
import { useAllCommunications, useCommunicationsStore, useConfirmations } from '../store/communicationsStore'
import { useNow } from '../hooks/useNow'
import { alpha, palette } from '../theme/colors'
import { CRISIS_DELIVERY_HOURS, DELIVERY_DAYS } from '../utils/cascadeEngine'
import { agendaFor, allAssignees, type AgendaItem } from '../utils/assignments'
import { getNode } from '../utils/orgTree'
import { fmt, pluralComm, pluralDays } from '../utils/format'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LevelPill from '../components/ui/LevelPill'
import PassportDrawer from '../components/communication/PassportDrawer'
import { eyebrowClass, fieldClass } from '../components/ui/styles'

/** Через сколько дней срок считается близким */
const SOON_DAYS = 3

type CopyState = 'idle' | 'copied' | 'failed'

export default function AgendaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedId = searchParams.get('person')
  const manager = allAssignees.find((a) => a.id === requestedId) ?? getNode(currentUser.nodeId)
  const isMe = manager.id === currentUser.nodeId

  const communications = useAllCommunications()
  const confirmations = useConfirmations()
  const userConfirmations = useCommunicationsStore((s) => s.confirmations)
  const confirmDelivery = useCommunicationsStore((s) => s.confirmDelivery)
  const undoConfirmation = useCommunicationsStore((s) => s.undoConfirmation)
  const now = useNow()

  const agenda = useMemo(
    () => agendaFor(manager.id, communications, confirmations, now),
    [manager.id, communications, confirmations, now],
  )
  const overdueCount = agenda.pending.filter((i) => i.overdue).length

  const [openId, setOpenId] = useState<string | null>(null)
  const closePassport = useCallback(() => setOpenId(null), [])
  const openComm = communications.find((c) => c.id === openId) ?? null
  const [showDone, setShowDone] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const selectPerson = (id: string) => {
    setSearchParams(id === currentUser.nodeId ? {} : { person: id })
    setCopyState('idle')
  }

  const copyAgenda = async () => {
    try {
      await navigator.clipboard.writeText(agendaText(manager, agenda.pending, now))
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1 basis-72">
            <label className={clsx('mb-1.5 block', eyebrowClass)} htmlFor="agenda-person">
              Повестка руководителя
            </label>
            <select
              id="agenda-person"
              value={manager.id}
              onChange={(e) => selectPerson(e.target.value)}
              className={clsx(fieldClass, 'max-w-xl')}
            >
              {levels.map((level) => {
                const people = allAssignees.filter((a) => a.level === level.id)
                if (people.length === 0) return null
                return (
                  <optgroup key={level.id} label={`${level.short} — ${level.title}`}>
                    {people.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.title}
                        {a.id === currentUser.nodeId ? ' (вы)' : ''}
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <LevelPill level={manager.level} />
              <span>
                {manager.position} · {manager.title}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat value={agenda.pending.length} label="к доведению" />
            <Stat value={overdueCount} label="просрочено" alert={overdueCount > 0} />
            <Stat value={agenda.done.length} label="доведено" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-tint-sun/70 px-4 py-3">
          <CalendarClock size={18} className="shrink-0 text-accent-sun" />
          <p className="min-w-0 flex-1 basis-64 text-sm text-ink">
            Доводите на ближайшей встрече с командой, но не позднее {DELIVERY_DAYS} дней после получения задания;
            антикризисные — в первые {CRISIS_DELIVERY_HOURS} часа и по возможности лично (п. 7.6, 9.7).
          </p>
          <Button variant="secondary" size="sm" onClick={copyAgenda} disabled={agenda.pending.length === 0}>
            <ClipboardCopy size={14} />
            {copyState === 'copied' ? 'Скопировано' : 'Скопировать повестку встречи'}
          </Button>
          {copyState === 'failed' && (
            <span className="text-xs text-brand-red">Браузер не дал доступ к буферу обмена</span>
          )}
        </div>
      </Card>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          К ближайшей встрече с командой
          {agenda.pending.length > 0 && (
            <span className="ml-2 text-sm font-normal text-ink-muted">{pluralComm(agenda.pending.length)}</span>
          )}
        </h2>
        {agenda.pending.length === 0 ? (
          <Card className="flex items-center gap-3 text-sm text-ink-soft">
            <PartyPopper size={20} className="shrink-0 text-accent-mint" />
            Всё доведено — новых заданий о каскадировании нет.
          </Card>
        ) : (
          <div className="space-y-3">
            {agenda.pending.map((item) => (
              <PendingCard
                key={item.comm.id}
                item={item}
                now={now}
                canConfirm={isMe}
                onConfirm={() => confirmDelivery(item.comm.id, manager.id)}
                onOpen={() => setOpenId(item.comm.id)}
              />
            ))}
          </div>
        )}
        {!isMe && agenda.pending.length > 0 && (
          <p className="mt-2 text-xs text-ink-muted">Отметить доведение может только сам руководитель.</p>
        )}
      </section>

      {agenda.upcoming.length > 0 && (
        <section>
          <h2 className="mb-1 font-display text-lg font-semibold text-ink">Скоро</h2>
          <p className="mb-3 text-xs text-ink-muted">Каскад ещё не запущен — задание придёт в день запуска</p>
          <Card padding={false} className="divide-y divide-gray-100">
            {agenda.upcoming.map(({ comm }) => (
              <CompactRow
                key={comm.id}
                item={comm}
                meta={`запуск ${fmt(comm.createdAt, 'd MMM')} · довести до ${fmt(comm.deadline, 'd MMM')}`}
                onOpen={() => setOpenId(comm.id)}
              />
            ))}
          </Card>
        </section>
      )}

      {agenda.done.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowDone((v) => !v)}
            aria-expanded={showDone}
            className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink"
          >
            Доведено <span className="text-sm font-normal text-ink-muted">{agenda.done.length}</span>
            <ChevronDown size={18} className={clsx('text-ink-muted transition-transform', showDone && 'rotate-180')} />
          </button>
          {showDone && (
            <Card padding={false} className="divide-y divide-gray-100">
              {agenda.done.map(({ comm, confirmedAt }) => (
                <CompactRow
                  key={comm.id}
                  item={comm}
                  meta={`довели ${fmt(confirmedAt ?? comm.createdAt, 'd MMM')}`}
                  onOpen={() => setOpenId(comm.id)}
                  action={
                    isMe && userConfirmations[comm.id]?.[manager.id] ? (
                      <Button variant="ghost" size="sm" onClick={() => undoConfirmation(comm.id, manager.id)}>
                        <RotateCcw size={14} /> Вернуть
                      </Button>
                    ) : null
                  }
                />
              ))}
            </Card>
          )}
        </section>
      )}

      <PassportDrawer comm={openComm} onClose={closePassport} />
    </div>
  )
}

function Stat({ value, label, alert }: { value: number; label: string; alert?: boolean }) {
  return (
    <div className={clsx('min-w-20 rounded-2xl px-3 py-2', alert ? 'bg-red-50' : 'bg-gray-50')}>
      <div className={clsx('font-display text-2xl font-semibold', alert ? 'text-brand-red' : 'text-ink')}>{value}</div>
      <div className="text-[11px] text-ink-muted">{label}</div>
    </div>
  )
}

/** Сколько осталось до срока — словами */
function deadlineHint({ comm, overdue }: AgendaItem, now: Date): { text: string; urgent: boolean } {
  if (comm.typeId === 'crisis') return { text: `до ${fmt(comm.deadline, 'd MMM, HH:mm')}`, urgent: true }
  if (overdue) {
    const days = differenceInCalendarDays(now, comm.deadline)
    return { text: days > 0 ? `просрочено на ${pluralDays(days)}` : 'срок истёк сегодня', urgent: true }
  }
  const days = differenceInCalendarDays(comm.deadline, now)
  return { text: days === 0 ? 'срок сегодня' : `осталось ${pluralDays(days)}`, urgent: days <= SOON_DAYS }
}

interface PendingCardProps {
  item: AgendaItem
  now: Date
  canConfirm: boolean
  onConfirm: () => void
  onOpen: () => void
}

function PendingCard({ item, now, canConfirm, onConfirm, onOpen }: PendingCardProps) {
  const { comm, overdue } = item
  const type = typeById(comm.typeId)
  const TypeIcon = type.icon
  const answered = threeQuestions.filter((q) => comm.questions[q.key])
  const hint = deadlineHint(item, now)

  return (
    <Card padding={false} className="flex overflow-hidden">
      <span className="w-1.5 shrink-0" style={{ backgroundColor: type.color }} aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-3 p-4 @xl:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: type.color }}>
            <TypeIcon size={16} />
            {type.name}
          </div>
          <Badge color={hint.urgent ? (overdue ? palette.crimson : palette.orange) : undefined}>
            {overdue && <AlertTriangle size={12} />}
            {hint.text}
          </Badge>
        </div>

        <h3 className="font-display text-base leading-snug font-semibold text-ink">{comm.title}</h3>

        <div className="rounded-xl p-3" style={{ backgroundColor: alpha(type.color, 0.07) }}>
          <div className="mb-0.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Quote size={12} /> Главное для команды
          </div>
          <p className="text-sm font-medium text-ink">{comm.keyMessage}</p>
        </div>

        <p className="text-sm text-ink-soft">{comm.essence}</p>

        {answered.length > 0 && (
          <details className="rounded-xl bg-gray-50 px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Как рассказать: правило трёх вопросов
            </summary>
            <ol className="mt-2 space-y-2">
              {answered.map((q) => (
                <li key={q.key}>
                  <div className="text-xs text-ink-muted">{q.question}</div>
                  <div className="text-sm text-ink">{comm.questions[q.key]}</div>
                </li>
              ))}
            </ol>
          </details>
        )}

        {comm.materials.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
            {comm.materials.map((m) => (
              <span key={m} className="flex items-center gap-1">
                <Paperclip size={12} className="text-ink-muted" />
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <div className="text-xs text-ink-muted">
            Задание получено {fmt(comm.createdAt, 'd MMM')} · довести не позднее{' '}
            <span className={clsx(overdue && 'font-medium text-brand-red')}>
              {fmt(comm.deadline, comm.typeId === 'crisis' ? 'd MMM, HH:mm' : 'd MMM')}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onOpen}>
              <FileText size={14} /> Паспорт
            </Button>
            {canConfirm && (
              <Button size="sm" onClick={onConfirm}>
                <CheckCheck size={14} /> Довёл до команды
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface CompactRowProps {
  item: AgendaItem['comm']
  meta: string
  onOpen: () => void
  action?: ReactNode
}

function CompactRow({ item, meta, onOpen, action }: CompactRowProps) {
  const type = typeById(item.typeId)
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: type.color }} />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="truncate text-sm font-medium text-ink hover:underline">{item.title}</div>
        <div className="text-xs text-ink-muted">
          {type.name} · {meta}
        </div>
      </button>
      {action}
    </div>
  )
}

/** Повестка встречи с командой обычным текстом — чтобы вставить в письмо, мессенджер или заметки */
function agendaText(manager: OrgNode, items: AgendaItem[], now: Date): string {
  const lines = [`Повестка встречи с командой — ${manager.name}, ${fmt(now, 'd MMMM yyyy')}`, '']
  items.forEach(({ comm }, i) => {
    lines.push(`${i + 1}. ${comm.title} (${typeById(comm.typeId).name.toLowerCase()})`)
    lines.push(`   Главное: ${comm.keyMessage}`)
    lines.push(`   Суть: ${comm.essence}`)
    for (const q of threeQuestions) {
      if (comm.questions[q.key]) lines.push(`   ${q.basis}: ${comm.questions[q.key]}`)
    }
    lines.push(`   Довести не позднее: ${fmt(comm.deadline, 'd MMMM')}`, '')
  })
  lines.push(`Уровень ${levelById(manager.level).short}. Сформировано на портале каскадирования.`)
  return lines.join('\n')
}
