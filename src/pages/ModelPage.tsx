import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, ChevronRight } from 'lucide-react'
import Card from '../components/common/Card'
import clsx from 'clsx'

interface ModelLevel {
  id: string
  title: string
  subtitle: string
  color: string
  details: string[]
}

const levels: ModelLevel[] = [
  {
    id: 'sources',
    title: 'Источники смыслов',
    subtitle: 'Где появляется информация',
    color: '#ed1b24',
    details: [
      'Совет директоров / ГД — стратегические решения',
      'Ежемесячная встреча руководителей — управленческие решения',
      'Комитеты — изменения процессов',
      'Проектные офисы — проектные обновления',
      'HR — кадровые изменения',
      'Маркетинг / коммерция — клиентские инициативы',
    ],
  },
  {
    id: 'classification',
    title: 'Классификация информации',
    subtitle: 'Паспорт информационного сообщения',
    color: '#d97706',
    details: [
      'Масштаб влияния: компания / дирекция / подразделение',
      'Срочность: кризис / срочно / планово',
      'Тип воздействия: действие / понимание / информирование / вдохновение',
      'Сложность: простая / средняя / сложная',
      'Чувствительность: публичная / рабочая / ограниченная',
    ],
  },
  {
    id: 'type',
    title: 'Тип коммуникации',
    subtitle: '11 типов корпоративных коммуникаций',
    color: '#3b82f6',
    details: [
      'Стратегические — направление развития',
      'Изменения — трансформация процессов',
      'Распорядительные — обязательные решения',
      'Разъяснительные — объяснение решений',
      'Операционные — текущая деятельность',
      'Проектные — управление проектами',
      'Отчётные — результаты деятельности',
      'Документационные — фиксация решений',
      'Оценочные — обратная связь',
      'Социальная ответственность — культура',
      'CRM — коммуникации о клиентах',
    ],
  },
  {
    id: 'depth',
    title: 'Глубина каскадирования',
    subtitle: 'До какого уровня доводится информация',
    color: '#8b5cf6',
    details: [
      'У01 — Генеральный директор',
      'У02 — Директора дирекций',
      'У03 — Руководители отделов',
      'У04 — Руководители групп',
      'У05 — Старшие специалисты',
      'У06 — Линейные специалисты',
      'Глубина определяется автоматически по типу + свойствам',
    ],
  },
  {
    id: 'channels',
    title: 'Каналы распространения',
    subtitle: 'Транспорт информации',
    color: '#14b8a6',
    details: [
      'Личные: встречи, оперативки',
      'Управленческие: совещания руководителей, комитеты',
      'Цифровые: портал, email, мессенджер',
      'Публичные: конференции, общие собрания',
    ],
  },
  {
    id: 'feedback',
    title: 'Проверка понимания',
    subtitle: 'Обратная связь и пульс-опросы',
    color: '#22c55e',
    details: [
      'Пульс-опросы по подразделениям',
      'Карта осведомлённости компании',
      'Оценка уровня информированности',
      'Корректировка каналов и глубины при необходимости',
    ],
  },
]

export default function ModelPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-6">
        Corporate Cascade Communication Model — нажмите на уровень для подробностей
      </p>

      <div className="space-y-3">
        {levels.map((level, i) => {
          const isExpanded = expandedId === level.id
          return (
            <div key={level.id}>
              <motion.button
                onClick={() => setExpandedId(isExpanded ? null : level.id)}
                whileHover={{ scale: 1.01 }}
                className={clsx(
                  'w-full rounded-xl border-2 p-5 text-left transition-all',
                  isExpanded
                    ? 'border-current shadow-lg'
                    : 'border-gray-100 bg-white hover:shadow-md'
                )}
                style={isExpanded ? { borderColor: level.color, backgroundColor: level.color + '08' } : undefined}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg"
                      style={{ backgroundColor: level.color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-brand-dark">{level.title}</div>
                      <div className="text-sm text-gray-500">{level.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className={clsx('text-gray-400 transition-transform', isExpanded && 'rotate-90')}
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 mt-2 rounded-lg border border-gray-100 bg-white p-4">
                      <ul className="space-y-2">
                        {level.details.map((detail, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <div
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: level.color }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {i < levels.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown size={18} className="text-gray-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
