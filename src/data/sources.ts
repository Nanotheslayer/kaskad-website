import {
  Banknote,
  Building2,
  Landmark,
  Layers,
  Mic,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import type { Source } from '../types/communication'
import { indexById } from '../utils/collections'

/** Площадки смыслообразования — таблица п. 5.1 Положения */
export const sources: Source[] = [
  {
    id: 'administration',
    name: 'Администрация',
    frequency: 'В течение года',
    produces: 'Приказы и распоряжения',
    icon: Landmark,
  },
  {
    id: 'monthly_meeting',
    name: 'Ежемесячная встреча руководителей',
    frequency: '1 раз / месяц',
    produces: 'Итоги отчётного периода, изменения, планы',
    icon: Users,
  },
  {
    id: 'values_committee',
    name: 'Комитет по ценностям',
    frequency: '1 раз / квартал',
    produces: 'Лучшие примеры ценностного поведения, признание',
    icon: Sparkles,
  },
  {
    id: 'investment_committee',
    name: 'Комитет по проектному инвестированию',
    frequency: 'уточняется',
    produces: 'Решения о проектах, открытиях, инвестициях',
    icon: Banknote,
  },
  {
    id: 'change_committee',
    name: 'Комитет по управлению изменениями',
    frequency: 'уточняется',
    produces: 'Изменения процессов, политик, оргструктуры',
    icon: RefreshCw,
  },
  {
    id: 'workshops',
    name: 'Мастерские (продажи и склад)',
    frequency: 'уточняется',
    produces: 'уточняется',
    icon: Wrench,
  },
  {
    id: 'foundation_meetings',
    name: 'Встречи по фундаменту и развитию',
    frequency: 'Ежемесячно',
    produces: 'Решения по стратегическим проектам и процессам компании',
    icon: Layers,
  },
  {
    id: 'live_broadcast',
    name: 'Прямой эфир с директорами',
    frequency: 'По потребности',
    produces: 'Достижения, подробности о направлениях работы, ответы на вопросы сотрудников',
    icon: Radio,
  },
  {
    id: 'annual_conference',
    name: 'Итоговая конференция',
    frequency: '1 раз / год',
    produces: 'Итоги года, стратегия и планы на следующий год',
    icon: Mic,
  },
  {
    id: 'directorate',
    name: 'Отдельные подразделения внутри компании',
    frequency: 'В течение года',
    produces: 'Решения для оптимизации работы и совершенствования процессов, ключевые кадровые решения',
    icon: Building2,
  },
  {
    id: 'qms_commission',
    name: 'Комиссии изменений СМК',
    frequency: 'уточняется',
    produces: 'Изменения системы менеджмента качества',
    icon: ShieldCheck,
  },
]

export const sourceById = indexById(sources)
