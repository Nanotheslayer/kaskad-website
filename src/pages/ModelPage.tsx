import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, ShieldAlert, Users } from 'lucide-react'
import clsx from 'clsx'
import { sources } from '../data/sources'
import { communicationTypes } from '../data/communicationTypes'
import { LEVELS_DRAFT_NOTE, levels } from '../data/levels'
import { channelCategories, channels } from '../data/channels'
import { threeQuestions } from '../data/threeQuestions'
import { crisisChannelsNote, crisisHeadquarters, crisisPhases, crisisSituations, crisisSummary } from '../data/crisis'
import { alpha, palette } from '../theme/colors'
import { DELIVERY_DAYS } from '../utils/cascadeEngine'
import Card from '../components/ui/Card'

interface Stage {
  id: string
  title: string
  subtitle: string
  color: string
  clause: string
  details: string[]
}

const channelName = new Map(channels.map((c) => [c.id, c.name]))

/** Этапы, через которые проходит каждое сообщение, — п. 3.3 Положения */
const stages: Stage[] = [
  {
    id: 'forming',
    title: 'Формирование',
    subtitle: 'На площадке смыслообразования принимаются решения и формулируются ключевые сообщения',
    color: palette.orange,
    clause: 'п. 5.1–5.2',
    details: [
      ...sources.map((s) => `${s.name} — ${s.produces.toLowerCase()} (${s.frequency.toLowerCase()})`),
      'По итогам площадки ответственный фиксирует решения и доводит ключевые сообщения в формате, принятом для площадки. Протокол служит исходным материалом для руководителей',
    ],
  },
  {
    id: 'channels',
    title: 'Выбор каналов',
    subtitle: 'Если сообщение нужно донести шире, тип коммуникации задаёт обязательные каналы и тональность',
    color: palette.blue,
    clause: 'п. 5.3–5.4, 6',
    details: [
      'Тип определяет инициатор, при необходимости — с методической помощью Центра развития корпоративной культуры и бренда работодателя',
      ...communicationTypes.map(
        (t) =>
          `${t.name} — ${t.includes.toLowerCase()}. Тональность: ${t.tone.toLowerCase()}. Каналы: ${t.channels
            .map((id) => channelName.get(id)?.toLowerCase())
            .join(', ')}`,
      ),
      ...channelCategories.map(
        (cat) =>
          `${cat.name}: ${channels
            .filter((c) => c.category === cat.id)
            .map((c) => c.name.toLowerCase())
            .join(', ')}`,
      ),
      'Обязательные каналы — минимум: дополнительные добавляются с учётом аудитории, обязательные не исключаются',
      'Публикацию в корпоративных каналах обеспечивает инициатор вместе с ведущим менеджером по корпоративным коммуникациям, встречи с командой — руководители',
    ],
  },
  {
    id: 'understanding',
    title: 'Осмысление',
    subtitle: 'Руководитель адаптирует сообщение для своей команды',
    color: palette.amber,
    clause: 'п. 7',
    details: [
      ...threeQuestions.map((q) => `Вопрос ${q.basis.toLowerCase()}: «${q.question}» (${q.hint.toLowerCase()})`),
      'Сообщение привязывается к блокам фундамента и стратегии и подаётся в свете ценностей Компании — это «язык», понятный сотрудникам, а не лозунги',
      'Сохраните суть, объясните, что изменится в работе команды, уберите корпоративный шум. Не хватает информации — запросите её у вышестоящего руководителя',
    ],
  },
  {
    id: 'delivery',
    title: 'Доведение',
    subtitle: 'Руководители каждого уровня доводят сообщение до своих команд',
    color: palette.green,
    clause: 'п. 3.2, 4, 7.6',
    details: [
      'Руководитель получает информацию раньше своей команды, чтобы успеть её адаптировать. Конечный адресат каскадирования — сотрудники уровня У6',
      ...levels.map((l) => `${l.short} — ${l.who}`),
      LEVELS_DRAFT_NOTE,
      `Срок — на ближайшей встрече с командой, но не позднее ${DELIVERY_DAYS} дней после получения задания о каскадировании. Антикризисные — по возможности лично`,
      'Цифровые и печатные каналы дополняют доведение информации руководителем, но не заменяют его',
    ],
  },
]

/** Кто за что отвечает — п. 1.3 Положения */
const responsibilities = [
  ['Генеральный директор', 'Формирует информационную повестку Компании и транслирует стратегически важную информацию'],
  ['Директора дирекций и дивизионов', 'Своевременно доводят информацию до руководителей своей дирекции или дивизиона'],
  [
    'Управляющие СТЦ, РЦ, директор КЦ, директора транспортной логистики и логистики склада',
    'Доводят информацию до руководителей отделов и контролируют проведение оперативных совещаний',
  ],
  [
    'Руководители отделов и групп (НСК, РКО, РОП, РОЛ)',
    'Доводят информацию до каждого сотрудника своего подразделения',
  ],
  [
    'Ответственные за площадки смыслообразования',
    'Фиксируют итоги площадки и доводят ключевые сообщения через один или несколько каналов',
  ],
  ['HR BP', 'Участвуют в формировании информации в дирекциях и помогают распространять материалы по их каналам'],
  [
    'Центр развития корпоративной культуры и бренда работодателя',
    'Методическое сопровождение каскадирования, контент для каналов, сообщения вне регулярных собраний',
  ],
]

export default function ModelPage() {
  const [expandedId, setExpandedId] = useState<string | null>('channels')

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="mb-5 text-sm text-ink-soft">
          Каждое сообщение проходит четыре этапа — нажмите на этап, чтобы увидеть, что на нём определяет Положение.
        </p>

        <div className="relative space-y-3">
          <div className="absolute bottom-6 left-[2.15rem] top-6 w-0.5 bg-gray-200" aria-hidden="true" />
          {stages.map((stage, i) => {
            const isExpanded = expandedId === stage.id
            return (
              <div key={stage.id} className="relative">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : stage.id)}
                  className="relative w-full rounded-2xl bg-white p-4 text-left shadow-card transition-all hover:shadow-lift"
                  // Рамка цвета этапа: inline, потому что цвет приходит из данных
                  style={isExpanded ? { boxShadow: `0 0 0 2px ${stage.color}` } : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
                      style={{ backgroundColor: stage.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium leading-snug text-ink">{stage.title}</div>
                      <div className="text-sm text-ink-soft">{stage.subtitle}</div>
                    </div>
                    <span
                      className="hidden rounded-full px-2 py-0.5 text-[11px] font-medium @xl:block"
                      style={{ backgroundColor: alpha(stage.color, 0.12), color: stage.color }}
                    >
                      {stage.clause}
                    </span>
                    <ChevronRight
                      size={20}
                      className={clsx('shrink-0 text-gray-400 transition-transform', isExpanded && 'rotate-90')}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-16 mt-2 rounded-2xl p-4" style={{ backgroundColor: alpha(stage.color, 0.06) }}>
                        <ul className="space-y-2">
                          {stage.details.map((d) => (
                            <li key={d} className="flex items-start gap-2.5 text-sm text-ink-soft">
                              <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: stage.color }}
                              />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <Card>
        <SectionTitle
          icon={<Users size={18} className="text-accent-sky" />}
          title="Кто за что отвечает"
          clause="п. 1.3"
        />
        <dl className="divide-y divide-gray-100">
          {responsibilities.map(([who, what]) => (
            <div key={who} className="grid gap-1 py-2.5 @xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @xl:gap-4">
              <dt className="text-sm font-medium text-ink">{who}</dt>
              <dd className="text-sm text-ink-soft">{what}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="space-y-5">
        <SectionTitle
          icon={<ShieldAlert size={18} className="text-brand-red" />}
          title="Антикризисные коммуникации"
          clause="раздел 9"
        />

        <div>
          <h3 className="mb-2 text-sm font-medium text-ink">Кризисной считается ситуация, которая</h3>
          <BulletList items={crisisSituations} color={palette.crimson} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-ink">Оперативный штаб</h3>
          <BulletList items={crisisHeadquarters} color={palette.crimson} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-ink">Фазы</h3>
          <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-3">
            {crisisPhases.map((phase, i) => (
              <div key={phase.name} className="rounded-2xl bg-red-50/70 p-3">
                <div className="text-sm font-semibold text-ink">
                  {i + 1}. {phase.name}
                </div>
                <div className="text-xs font-medium text-brand-red">{phase.term}</div>
                <p className="mt-2 text-xs text-ink">{phase.goal}</p>
                <p className="mt-1 text-xs text-ink-soft">{phase.format}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-sm font-medium text-ink">Еженедельная сводка штаба</h3>
          <p className="mb-2 text-sm text-ink-soft">{crisisSummary.schedule}.</p>
          <BulletList items={crisisSummary.structure} color={palette.crimson} />
        </div>

        <p className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-ink-soft">{crisisChannelsNote}.</p>
      </Card>
    </div>
  )
}

function SectionTitle({ icon, title, clause }: { icon: ReactNode; title: string; clause: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <span className="text-xs text-ink-muted">{clause}</span>
    </div>
  )
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          {item}
        </li>
      ))}
    </ul>
  )
}
