import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Compass, Lightbulb, MessageSquareQuote } from 'lucide-react'
import clsx from 'clsx'
import Card from '../components/common/Card'

const phases = [
  {
    n: 1,
    title: 'Актуализация',
    when: 'до доведения информации',
    goal: 'Определить текущий уровень осведомлённости команды и спрогнозировать реакцию',
    color: '#3b9ae8',
    actions: [
      'Оценить, какой информацией по теме команда уже располагает',
      'Определить ожидания и предположения сотрудников, в том числе по неформальным источникам',
      'Выявить категории сотрудников, которых информация затронет сильнее всего',
    ],
  },
  {
    n: 2,
    title: 'Осмысление',
    when: 'подготовка к доведению',
    goal: 'Сформировать собственное понимание и подготовить адаптированное сообщение',
    color: '#f5a300',
    actions: [
      'Изучить исходные материалы: протокол, презентацию',
      'Сформулировать сообщение по правилу трёх вопросов',
      'Если что-то неясно — отправить запрос вышестоящему уровню до момента доведения',
    ],
  },
  {
    n: 3,
    title: 'Рефлексия',
    when: 'после доведения',
    goal: 'Убедиться, что информация понята, и зафиксировать нерешённые вопросы',
    color: '#2fa84f',
    actions: [
      'Проверить понимание прямым вопросом: «Осталось ли что-то непонятным по теме …?»',
      'Зафиксировать вопросы, на которые не удалось ответить, и передать их выше',
      'Решить, нужно ли вернуться к теме повторно',
    ],
  },
]

const questions = [
  {
    n: 1,
    badge: 'Фундамент',
    q: 'Что именно произошло / какое решение принято и какой приоритет компании это затрагивает?',
    hint: 'Сервис, CJM, IT, люди',
    color: '#4f6bed',
  },
  {
    n: 2,
    badge: 'Стратегия',
    q: 'К какой стратегической цели это ведёт?',
    hint: 'Основной бизнес, расширение географии, расширение ассортимента, стройка и ремонт «от и до»',
    color: '#f26b21',
  },
  {
    n: 3,
    badge: 'Ценности',
    q: 'Что это значит для нашей команды и через какую ценность мы это проживаем?',
    hint: '«Человек в приоритете», «Развитие», «Преодоление»',
    color: '#e255a1',
  },
]

const principles = [
  {
    title: 'Переводите, а не пересылайте',
    text: 'Задача руководителя — не повторять информацию, а синтезировать, адаптировать и усиливать её. Каждый уровень отсекает абстракцию и добавляет конкретику для своей команды.',
  },
  {
    title: 'Отвечайте на вопрос «что это значит лично для нас»',
    text: 'Как изменится повседневная работа, что сделает команду успешной, что придётся делать по-другому. Если ответа нет — запросите больше информации у вышестоящего уровня: это ответственность, а не слабость.',
  },
  {
    title: 'Убирайте «корпоративный шум»',
    text: 'Уберите аббревиатуры, которые команда не использует, абстрактные формулировки и лишние подробности. Протоколы и приказы написаны формальным языком — переведите его.',
  },
  {
    title: 'Будьте первым источником, а не эхом',
    text: 'Не откладывайте: получили информацию — адаптируйте и передайте в кратчайший срок. Говорите лично, а не через мессенджер, особенно если новость сложная. Цель — не просто проинформировать, а подготовить.',
  },
  {
    title: 'Окрашивайте ценностями — через смысл, а не лозунг',
    text: 'Не «это соответствует нашей ценности», а реальный смысл: «Человек в приоритете», «Развитие» или «Преодоление».',
  },
  {
    title: 'Учитывайте, кто перед вами',
    text: 'Специфические сложности команды, баланс нагрузки и доступные ресурсы — без потери сути исходного сообщения.',
  },
]

export default function AlgorithmPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-6">
      {/* Три фазы */}
      <div className="grid gap-4 lg:grid-cols-3">
        {phases.map((p, i) => (
          <motion.div key={p.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="h-full" style={{ borderTop: `4px solid ${p.color}` }}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-bold text-white" style={{ backgroundColor: p.color }}>
                  {p.n}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold leading-tight text-ink">{p.title}</div>
                  <div className="text-xs text-ink-muted">{p.when}</div>
                </div>
              </div>
              <p className="mb-3 text-sm font-medium text-ink">{p.goal}</p>
              <ul className="space-y-2">
                {p.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Правило трёх вопросов */}
      <Card className="bg-gradient-to-br from-white to-brand-yellow-light/60">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareQuote size={20} className="text-brand-red" />
          <h2 className="font-display text-lg font-semibold text-ink">Правило трёх вопросов</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: q.color }}>
                  {q.n}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: q.color }}>{q.badge}</span>
              </div>
              <div className="text-[15px] font-medium leading-snug text-ink">{q.q}</div>
              <div className="mt-2 text-xs text-ink-muted">{q.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Принципы */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb size={20} className="text-accent-sun" />
          <h2 className="font-display text-lg font-semibold text-ink">Принципы подготовки сообщения</h2>
        </div>
        <div className="space-y-2">
          {principles.map((p, i) => {
            const isOpen = open === i
            return (
              <div key={p.title} className="overflow-hidden rounded-2xl bg-white shadow-card">
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left" aria-expanded={isOpen}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tint-sun font-display text-sm font-bold text-accent-sun">{i + 1}</span>
                  <span className="flex-1 font-medium text-ink">{p.title}</span>
                  <ChevronDown size={18} className={clsx('text-gray-400 transition-transform', isOpen && 'rotate-180')} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-4 pb-4 pl-16 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <Card className="flex items-start gap-3 bg-tint-mint/60">
        <Compass size={20} className="mt-0.5 shrink-0 text-accent-mint" />
        <p className="text-sm text-ink-soft">
          Если руководитель не может ответить на вопрос «что это значит для нас» — ему самому нужна дополнительная информация от вышестоящего уровня. Запросить её — ответственность, а не слабость.
        </p>
      </Card>
    </div>
  )
}
