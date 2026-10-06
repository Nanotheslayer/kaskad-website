import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Quote, Paperclip, ShieldAlert } from 'lucide-react'
import type { Communication } from '../../types/communication'
import { typeById } from '../../data/communicationTypes'
import { sourceById } from '../../data/sources'
import { levelById } from '../../data/levels'
import {
  confidentialityLabels,
  foundationOptions,
  impactTypeLabels,
  scaleLabels,
  strategyOptions,
  toneLabels,
  urgencyColors,
  urgencyLabels,
  valueOptions,
} from '../../data/classificationOptions'
import { fmt, statusColors, statusLabels } from '../../utils/format'
import { getIcon } from '../../utils/icons'
import Badge from '../common/Badge'
import DepthScale from './DepthScale'
import ChannelList from './ChannelList'

interface Props {
  comm: Communication | null
  onClose: () => void
}

const questionTitles = [
  'Что произошло и какой приоритет компании это затрагивает?',
  'К какой стратегической цели это ведёт?',
  'Что это значит для нашей команды и через какую ценность мы это проживаем?',
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">{title}</h3>
      {children}
    </section>
  )
}

/** Паспорт инфоповода — просмотр целиком (по слайду «Паспорт инфоповода») */
export default function PassportDrawer({ comm, onClose }: Props) {
  useEffect(() => {
    if (!comm) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
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

function PassportBody({ comm, onClose }: { comm: Communication; onClose: () => void }) {
  const type = typeById(comm.typeId)
  const source = sourceById(comm.sourceId)
  const TypeIcon = type ? getIcon(type.icon) : null
  const depth = levelById(comm.cascadeDepth)
  const color = type?.color ?? '#7b8794'
  const c = comm.classification
  const hasQuestions = comm.questions.q1 || comm.questions.q2 || comm.questions.q3
  const { foundation, strategy, values } = comm.binding
  const hasBinding = foundation.length + strategy.length + values.length > 0

  return (
    <>
      <div className="relative shrink-0 px-6 pb-5 pt-6" style={{ background: `linear-gradient(135deg, ${color}26, ${color}08)` }}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-soft hover:bg-white/70" aria-label="Закрыть">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
            {TypeIcon && <TypeIcon size={22} />}
          </div>
          <div className="text-sm font-medium" style={{ color }}>
            {type?.name}
          </div>
        </div>
        <h2 className="mt-3 pr-8 font-display text-xl font-semibold leading-snug text-ink">{comm.title}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge color={statusColors[comm.status]}>{statusLabels[comm.status]}</Badge>
          <Badge color={urgencyColors[c.urgency]}>{urgencyLabels[c.urgency]}</Badge>
          <Badge>до {depth.short}</Badge>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="rounded-2xl bg-brand-yellow-light p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent-sun">
            <Quote size={13} /> Ключевое сообщение
          </div>
          <p className="text-[15px] font-medium leading-snug text-ink">{comm.keyMessage}</p>
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
              <div className="font-medium text-ink">{source?.name}</div>
              <div className="text-xs text-ink-soft">{source?.frequency}</div>
            </div>
          </div>
        </Section>

        <Section title="Классификация (п. 5.3)">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ['Масштаб влияния', scaleLabels[c.impactScale]],
              ['Срочность', urgencyLabels[c.urgency]],
              ['Тип воздействия', impactTypeLabels[c.impactType]],
              ['Тональность', toneLabels[c.tone]],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-gray-50 px-3 py-2">
                <div className="text-xs text-ink-muted">{k}</div>
                <div className="font-medium text-ink">{v}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={`Глубина каскада — до ${depth.short}`}>
          <DepthScale depth={comm.cascadeDepth} extended={comm.depthExtended} />
          <p className="mt-2 text-xs text-ink-muted">Нижний уровень: {depth.title}</p>
        </Section>

        <Section title="Каналы распространения">
          <ChannelList required={comm.requiredChannels} extra={comm.extraChannels} />
          {comm.confidentiality === 'restricted' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-accent-rose">
              <ShieldAlert size={14} className="mt-0.5 shrink-0" />
              Метка «Ограниченный доступ»: каналы широкого охвата отключены
            </div>
          )}
        </Section>

        {hasQuestions && (
          <Section title="Правило трёх вопросов (п. 5.7)">
            <ol className="space-y-2">
              {[comm.questions.q1, comm.questions.q2, comm.questions.q3].map((q, i) =>
                q ? (
                  <li key={i} className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs text-ink-muted">
                      {i + 1}. {questionTitles[i]}
                    </div>
                    <div className="mt-0.5 text-sm text-ink">{q}</div>
                  </li>
                ) : null,
              )}
            </ol>
          </Section>
        )}

        {hasBinding && (
          <Section title="Привязка (прил. 2)">
            <div className="flex flex-wrap gap-1.5">
              {foundation.map((id) => {
                const o = foundationOptions.find((x) => x.id === id)!
                return <Badge key={id} color={o.color}>Фундамент · {o.label}</Badge>
              })}
              {strategy.map((id) => {
                const o = strategyOptions.find((x) => x.id === id)!
                return <Badge key={id} color={o.color}>Стратегия · {o.label}</Badge>
              })}
              {values.map((id) => {
                const o = valueOptions.find((x) => x.id === id)!
                return <Badge key={id} color={o.color}>Ценность · {o.label}</Badge>
              })}
            </div>
          </Section>
        )}

        <Section title="Сроки и конфиденциальность">
          <div className="grid grid-cols-2 gap-2 text-sm min-[480px]:grid-cols-3">
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <div className="text-xs text-ink-muted">Создана</div>
              <div className="font-medium text-ink">{fmt(comm.createdAt, 'd MMM, HH:mm')}</div>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <div className="text-xs text-ink-muted">Довести до</div>
              <div className="font-medium text-ink">{fmt(comm.deadline, 'd MMM yyyy')}</div>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <div className="text-xs text-ink-muted">Метка</div>
              <div className="font-medium text-ink">{confidentialityLabels[comm.confidentiality]}</div>
            </div>
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

