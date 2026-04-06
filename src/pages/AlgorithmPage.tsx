import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle2 } from 'lucide-react'
import Card from '../components/common/Card'
import clsx from 'clsx'

interface AlgorithmStep {
  number: number
  title: string
  description: string
  color: string
  details?: string[]
}

const algorithmSteps: AlgorithmStep[] = [
  {
    number: 1,
    title: 'Получил информацию',
    description: 'Информация поступила из источника смыслов',
    color: '#ed1b24',
  },
  {
    number: 2,
    title: 'Определил тип коммуникации',
    description: 'Классифицировал по одному из 11 типов',
    color: '#d97706',
  },
  {
    number: 3,
    title: 'Определил глубину',
    description: 'Система рассчитала, до какого уровня каскадировать',
    color: '#3b82f6',
  },
  {
    number: 4,
    title: 'Осмыслил через 3 вопроса',
    description: 'Ответил на ключевые вопросы для адаптации',
    color: '#8b5cf6',
    details: [
      'Что это значит для моей команды?',
      'Что конкретно изменится в нашей работе?',
      'Что нужно сделать и к какому сроку?',
    ],
  },
  {
    number: 5,
    title: 'Адаптировал для команды',
    description: '«Переводите, а не пересылайте» — адаптация языка и контекста',
    color: '#14b8a6',
  },
  {
    number: 6,
    title: 'Передал',
    description: 'Донёс информацию через определённые каналы',
    color: '#22c55e',
  },
  {
    number: 7,
    title: 'Проверил понимание',
    description: 'Убедился, что команда поняла суть и знает следующие шаги',
    color: '#0d9488',
  },
]

export default function AlgorithmPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-2">
        Пошаговый алгоритм осмысленного каскадирования для руководителя
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Принцип: «Переводите, а не пересылайте». Каждый руководитель адаптирует информацию для своей команды.
      </p>

      {/* 3 фазы осмысления */}
      <Card className="mb-6 bg-brand-yellow/10 border-brand-yellow/30">
        <h3 className="font-semibold text-sm text-brand-dark mb-3">Три фазы осмысления</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Понимание', 'Адаптация', 'Проверка'].map((phase, i) => (
            <div key={i} className="rounded-lg bg-white p-3 text-center">
              <div className="text-2xl font-bold text-brand-red mb-1">{i + 1}</div>
              <div className="text-xs font-medium text-brand-dark">{phase}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Алгоритм */}
      <div className="space-y-2">
        {algorithmSteps.map((step, i) => {
          const isActive = activeStep === step.number
          return (
            <div key={step.number}>
              <motion.button
                onClick={() => setActiveStep(isActive ? null : step.number)}
                whileHover={{ x: 4 }}
                className={clsx(
                  'w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
                  isActive
                    ? 'shadow-lg'
                    : 'border-gray-100 bg-white hover:shadow-md'
                )}
                style={isActive ? { borderColor: step.color, backgroundColor: step.color + '08' } : undefined}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-brand-dark">{step.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                </div>
                <CheckCircle2
                  size={20}
                  className={clsx(isActive ? 'text-green-500' : 'text-gray-200')}
                />
              </motion.button>

              {/* Детали шага 4 — три вопроса */}
              {isActive && step.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className="ml-14 mt-2 rounded-lg border border-purple-100 bg-purple-50 p-4">
                    <h4 className="text-sm font-semibold text-purple-800 mb-2">Три вопроса руководителя:</h4>
                    <ol className="space-y-2">
                      {step.details.map((q, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-purple-700">
                          <span className="font-bold shrink-0">{j + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}

              {i < algorithmSteps.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
