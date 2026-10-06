import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { sources } from '../data/sources'
import { communicationTypes } from '../data/communicationTypes'
import { levels } from '../data/levels'
import { channelCategories, channels } from '../data/channels'
import { foundationOptions, strategyOptions, valueOptions } from '../data/classificationOptions'

interface Stage {
  id: string
  title: string
  subtitle: string
  color: string
  clause: string
  details: string[]
}

const stages: Stage[] = [
  {
    id: 'sources',
    title: 'Смыслообразование',
    subtitle: 'Информация рождается на площадке смыслообразования',
    color: '#f26b21',
    clause: 'п. 5.2',
    details: sources.map((s) => `${s.name} — ${s.produces.toLowerCase()} (${s.frequency.toLowerCase()})`),
  },
  {
    id: 'classification',
    title: 'Классификация',
    subtitle: 'Сообщению присваивается «паспорт» из четырёх свойств',
    color: '#f5a300',
    clause: 'п. 5.3–5.7',
    details: [
      'Масштаб влияния: компания / дирекция / подразделение',
      'Срочность: критично / срочно / планово / фоново (без чётких сроков)',
      'Ожидаемый тип воздействия: действие / информирование / ценностная мотивация',
      'Тональность: официальная / неформальная / экспертная / эмоциональная / сдержанная',
      `Фундамент: ${foundationOptions.map((o) => o.label).join(', ')}`,
      `Стратегия: ${strategyOptions.map((o) => o.label).join(', ')}`,
      `Ценности: ${valueOptions.map((o) => o.label).join(', ')}`,
    ],
  },
  {
    id: 'type',
    title: 'Определение типа коммуникации',
    subtitle: '10 типов — тип определяет глубину, каналы и базовую тональность',
    color: '#4f6bed',
    clause: 'п. 5.8',
    details: communicationTypes.map((t) => `${t.name} ${t.depthLabel} — ${t.includes.toLowerCase()}`),
  },
  {
    id: 'depth',
    title: 'Определение глубины каскадирования',
    subtitle: 'Нижний уровень по шкале У.01–У.06, до которого доводится информация',
    color: '#7c5cdb',
    clause: 'п. 4, 5.9',
    details: [
      ...levels.map((l) => `${l.short} — ${l.who}. Точка входа: ${l.entryPoint.toLowerCase()}`),
      'Стратегические, проектные, кризисные, ценностные, HR / социальные и продуктовые → до У.06 (все сотрудники)',
      'Разъяснительные, распорядительные и отчётные → до У.04 (с углублением до У.06 при необходимости)',
      'Документационные (служебные) → до У.03',
    ],
  },
  {
    id: 'channels',
    title: 'Выбор каналов распространения',
    subtitle: 'Обязательный минимум задан по типам; руководитель может добавить, но не исключить',
    color: '#12a6a0',
    clause: 'п. 6',
    details: [
      ...channelCategories.map((cat) => `${cat.name}: ${channels.filter((c) => c.category === cat.id).map((c) => c.name.toLowerCase()).join(', ')}`),
      'Для кризисных коммуникаций первым источником должен быть руководитель (устное доведение), а не цифровой канал',
    ],
  },
  {
    id: 'feedback',
    title: 'Осмысление и проверка усвоения',
    subtitle: 'Адаптация под аудиторию и контроль понимания',
    color: '#2fa84f',
    clause: 'п. 7–8',
    details: [
      'Три фазы работы руководителя: актуализация, осмысление, рефлексия',
      'Пульс-опрос на «Петлокале» — раз в месяц, 2–3 вопроса, не более минуты',
      'Информированность — не менее 80%, понимание — не менее 70%, доверие к источнику — 100% принявших участие',
      'Опрос взаимодействия — июнь и декабрь; опрос вовлечённости — апрель и октябрь (3 недели)',
    ],
  },
]

export default function ModelPage() {
  const [expandedId, setExpandedId] = useState<string | null>('type')

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 text-sm text-ink-soft">
        Любое сообщение проходит шесть этапов — нажмите на этап, чтобы увидеть, что на нём определяет Положение.
      </p>

      <div className="relative space-y-3">
        <div className="absolute bottom-6 left-[2.15rem] top-6 w-0.5 bg-gray-200" aria-hidden="true" />
        {stages.map((stage, i) => {
          const isExpanded = expandedId === stage.id
          return (
            <div key={stage.id} className="relative">
              <button
                onClick={() => setExpandedId(isExpanded ? null : stage.id)}
                className={clsx(
                  'relative w-full rounded-2xl bg-white p-4 text-left shadow-card transition-all hover:shadow-lift',
                  isExpanded && 'ring-2',
                )}
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
                  <span className="hidden rounded-full px-2 py-0.5 text-[11px] font-medium @xl:block" style={{ backgroundColor: stage.color + '1f', color: stage.color }}>
                    {stage.clause}
                  </span>
                  <ChevronRight size={20} className={clsx('shrink-0 text-gray-400 transition-transform', isExpanded && 'rotate-90')} />
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
                    <div className="ml-16 mt-2 rounded-2xl p-4" style={{ backgroundColor: stage.color + '10' }}>
                      <ul className="space-y-2">
                        {stage.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-ink-soft">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: stage.color }} />
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
  )
}
