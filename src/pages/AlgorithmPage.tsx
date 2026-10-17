import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpenText, Compass, ListChecks, MessageSquareQuote } from 'lucide-react'
import { threeQuestions } from '../data/threeQuestions'
import { managerRules } from '../data/managerRules'
import { foundationOptions, strategyOptions, valueOptions, type Priority } from '../data/priorities'
import { alpha, palette } from '../theme/colors'
import Card from '../components/ui/Card'
import Segmented from '../components/ui/Segmented'

const ruleColors = [palette.azure, palette.amber, palette.green]

type PriorityGroupId = 'foundation' | 'strategy' | 'values'

const priorityGroups: Record<PriorityGroupId, { label: string; blocks: Priority<string>[] }> = {
  foundation: { label: 'Фундамент', blocks: foundationOptions },
  strategy: { label: 'Стратегия', blocks: strategyOptions },
  values: { label: 'Ценности', blocks: valueOptions },
}

const priorityGroupOptions = (Object.keys(priorityGroups) as PriorityGroupId[]).map((id) => ({
  value: id,
  label: priorityGroups[id].label,
}))

export default function AlgorithmPage() {
  const [group, setGroup] = useState<PriorityGroupId>('foundation')

  return (
    <div className="space-y-6">
      {/* Правило трёх вопросов */}
      <Card className="bg-linear-to-br from-white to-brand-yellow-light/60">
        <div className="mb-1 flex items-center gap-2">
          <MessageSquareQuote size={20} className="text-brand-red" />
          <h2 className="font-display text-lg font-semibold text-ink">Правило трёх вопросов</h2>
        </div>
        <p className="mb-4 text-sm text-ink-soft">
          Участники каскадирования доносят информацию до конечных получателей, отвечая на три вопроса. Вопросы построены
          на фундаменте, стратегии и ценностях Компании (п. 7.5).
        </p>
        <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {threeQuestions.map((q, i) => (
            <div key={q.key} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: q.color }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: q.color }}>
                  {q.basis}
                </span>
              </div>
              <div className="text-xs text-ink-muted">{q.purpose}</div>
              <div className="mt-2 text-[15px] font-medium leading-snug text-ink">«{q.question}»</div>
              <div className="mt-2 text-xs text-ink-muted">{q.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Правила доведения */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ListChecks size={20} className="text-accent-sun" />
          <h2 className="font-display text-lg font-semibold text-ink">Правила доведения</h2>
          <span className="text-xs text-ink-muted">п. 7.6</span>
        </div>
        <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-3">
          {managerRules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="h-full" style={{ borderTop: `4px solid ${ruleColors[i]}` }}>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
                    style={{ backgroundColor: ruleColors[i] }}
                  >
                    {i + 1}
                  </div>
                  <div className="font-display text-base font-semibold leading-tight text-ink">{rule.title}</div>
                </div>
                <p className="text-sm text-ink-soft">{rule.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Фундамент, стратегия и ценности */}
      <Card>
        <div className="mb-1 flex items-center gap-2">
          <BookOpenText size={20} className="text-accent-lilac" />
          <h2 className="font-display text-lg font-semibold text-ink">Язык приоритетов Компании</h2>
          <span className="text-xs text-ink-muted">п. 7.2–7.4, приложение</span>
        </div>
        <p className="mb-4 text-sm text-ink-soft">
          Каждое сообщение привязывается к фундаменту и стратегии и подаётся в свете ценностей. Это не лозунги, а
          «каркас», который задаёт направления, цели и акценты сообщения.
        </p>
        <div className="mb-4 max-w-full overflow-x-auto">
          <Segmented options={priorityGroupOptions} value={group} onChange={setGroup} />
        </div>
        <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @6xl:grid-cols-4">
          {priorityGroups[group].blocks.map((block) => (
            <div key={block.value} className="rounded-2xl p-4" style={{ backgroundColor: alpha(block.color, 0.08) }}>
              <div className="mb-2 font-display text-sm font-semibold uppercase" style={{ color: block.color }}>
                {block.label}
              </div>
              <ul className="space-y-1.5">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: block.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-start gap-3 bg-tint-mint/60">
        <Compass size={20} className="mt-0.5 shrink-0 text-accent-mint" />
        <p className="text-sm text-ink-soft">
          Если руководителю самому не хватает информации, чтобы объяснить команде, что изменится в её работе, он
          запрашивает её у вышестоящего руководителя (п. 7.6).
        </p>
      </Card>
    </div>
  )
}
