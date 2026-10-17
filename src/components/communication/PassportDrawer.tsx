import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Paperclip, Quote, X } from 'lucide-react'
import type { TrackedCommunication } from '../../types/communication'
import { typeById } from '../../data/communicationTypes'
import { sourceById } from '../../data/sources'
import { statusColors, statusLabels } from '../../data/statuses'
import { threeQuestions } from '../../data/threeQuestions'
import { foundationById, strategyById, valueById } from '../../data/priorities'
import { useConfirmations } from '../../store/communicationsStore'
import { describeDeliveryRule } from '../../utils/cascadeEngine'
import { assigneesOf, describeAudience } from '../../utils/assignments'
import { fmt } from '../../utils/format'
import Badge from '../ui/Badge'
import ChannelList from './ChannelList'
import { eyebrowClass } from '../ui/styles'

interface PassportDrawerProps {
  comm: TrackedCommunication | null
  /** Желательно стабильная функция (useCallback): иначе подписка на Escape пересоздаётся при каждом рендере */
  onClose: () => void
}

/** Паспорт инфоповода — просмотр целиком (по слайду «Паспорт инфоповода») */
export default function PassportDrawer({ comm, onClose }: PassportDrawerProps) {
  useEffect(() => {
    if (!comm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [comm, onClose])

  // Портал на body: область контента — @container, а он становится «рамкой» для position: fixed
  return createPortal(
    <AnimatePresence>
      {comm && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Паспорт инфоповода"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-lift"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <PassportBody comm={comm} onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className={`mb-2 ${eyebrowClass}`}>{title}</h3>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="font-medium text-ink">{value}</div>
    </div>
  )
}

/** Сколько отстающих руководителей перечислять по именам */
const PENDING_NAMES_LIMIT = 6

function PassportBody({ comm, onClose }: { comm: TrackedCommunication; onClose: () => void }) {
  const type = typeById(comm.typeId)
  const source = sourceById(comm.sourceId)
  const confirmed = useConfirmations()[comm.id] ?? {}
  const pending = assigneesOf(comm.audience).filter((a) => !confirmed[a.id])
  const { done, total } = comm.progress
  const timeFormat = comm.typeId === 'crisis' ? 'd MMM, HH:mm' : 'd MMM yyyy'
  const { foundation, strategy, values } = comm.binding
  const answeredQuestions = threeQuestions.filter((q) => comm.questions[q.key])
  const hasBinding = foundation.length + strategy.length + values.length > 0
  const TypeIcon = type.icon

  return (
    <>
      <div className="relative shrink-0 border-b border-gray-100 bg-gray-50 px-6 pt-6 pb-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-ink-soft hover:bg-gray-200/70"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: type.color }}
          >
            <TypeIcon size={22} />
          </div>
          <div className="text-sm font-medium" style={{ color: type.color }}>
            {type.name}
          </div>
        </div>
        <h2 className="mt-3 pr-8 font-display text-xl leading-snug font-semibold text-ink">{comm.title}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge color={statusColors[comm.status]}>{statusLabels[comm.status]}</Badge>
          <Badge>Тональность: {type.tone.toLowerCase()}</Badge>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="rounded-2xl bg-brand-yellow-light p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-soft uppercase">
            <Quote size={13} /> Ключевое сообщение
          </div>
          <p className="text-[15px] leading-snug font-medium text-ink">{comm.keyMessage}</p>
        </div>

        <Section title="Суть">
          <p className="text-sm leading-relaxed text-ink-soft">{comm.essence}</p>
        </Section>

        <Section title="Инициатор и площадка">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-ink-muted">Инициатор</div>
              <div className="font-medium text-ink">{comm.initiator.name}</div>
              <div className="text-xs text-ink-soft">{comm.initiator.directorate}</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-ink-muted">Площадка смыслообразования</div>
              <div className="font-medium text-ink">{source.name}</div>
              <div className="text-xs text-ink-soft">{source.frequency}</div>
            </div>
          </div>
        </Section>

        <Section title="Каналы распространения">
          <ChannelList required={comm.requiredChannels} extra={comm.extraChannels} />
        </Section>

        {answeredQuestions.length > 0 && (
          <Section title="Правило трёх вопросов (п. 7.5)">
            <ol className="space-y-2">
              {answeredQuestions.map((q) => (
                <li key={q.key} className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs text-ink-muted">
                    {threeQuestions.indexOf(q) + 1}. {q.question}
                  </div>
                  <div className="mt-0.5 text-sm text-ink">{comm.questions[q.key]}</div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {hasBinding && (
          <Section title="Привязка к приоритетам (п. 7.2–7.3)">
            <div className="flex flex-wrap gap-1.5">
              {foundation.map((id) => (
                <Badge key={id}>Фундамент · {foundationById[id].label}</Badge>
              ))}
              {strategy.map((id) => (
                <Badge key={id}>Стратегия · {strategyById[id].label}</Badge>
              ))}
              {values.map((id) => (
                <Badge key={id}>Ценность · {valueById[id].label}</Badge>
              ))}
            </div>
          </Section>
        )}

        <Section title="Доведение (п. 7.6)">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Field label="Запуск каскада" value={fmt(comm.createdAt, 'd MMM, HH:mm')} />
            <Field label="Довести не позднее" value={fmt(comm.deadline, timeFormat)} />
          </div>
          <p className="mt-2 text-xs text-ink-muted">Руководители доводят {describeDeliveryRule(comm.typeId)}</p>
          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
            <div className="text-xs text-ink-muted">Кому: {describeAudience(comm.audience)}</div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="font-medium text-ink">Довели руководителей</span>
              <span className="text-ink tabular-nums">
                {done} из {total}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
              />
            </div>
            {comm.status === 'active' && pending.length > 0 && (
              <p className="mt-2 text-xs text-ink-soft">
                Ещё не довели:{' '}
                {pending
                  .slice(0, PENDING_NAMES_LIMIT)
                  .map((a) => a.name)
                  .join(', ')}
                {pending.length > PENDING_NAMES_LIMIT && ` и ещё ${pending.length - PENDING_NAMES_LIMIT}`}
              </p>
            )}
          </div>
        </Section>

        {comm.materials.length > 0 && (
          <Section title="Материалы">
            <ul className="space-y-1">
              {comm.materials.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-ink-soft">
                  <Paperclip size={14} className="text-ink-muted" />
                  {m}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </>
  )
}
