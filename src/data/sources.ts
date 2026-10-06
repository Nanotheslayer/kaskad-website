import type { Source } from '../types/communication'

/** Площадки смыслообразования — п. 5.2 Положения (единственные легитимные точки входа информации) */
export const sources: Source[] = [
  {
    id: 'administration',
    name: 'Администрация',
    frequency: 'В течение года',
    produces: 'Приказы и распоряжения',
    owner: 'уточняется',
    icon: 'Landmark',
  },
  {
    id: 'monthly_meeting',
    name: 'Ежемесячная встреча руководителей',
    frequency: '1 раз / месяц',
    produces: 'Стратегические решения, итоги, планы, ключевые кадровые решения',
    owner: 'Бизнес-ассистент генерального директора',
    icon: 'Users',
  },
  {
    id: 'values_committee',
    name: 'Комитет по ценностям',
    frequency: '1 раз / квартал',
    produces: 'Лучшие примеры ценностного поведения, признание',
    owner: 'уточняется',
    icon: 'Sparkles',
  },
  {
    id: 'investment_committee',
    name: 'Комитет по проектному инвестированию',
    frequency: 'уточняется',
    produces: 'Решения о проектах, открытиях, инвестициях',
    owner: 'уточняется',
    icon: 'Banknote',
  },
  {
    id: 'change_committee',
    name: 'Комитет по управлению изменениями',
    frequency: 'уточняется',
    produces: 'Изменения процессов, политик, оргструктуры',
    owner: 'уточняется',
    icon: 'RefreshCw',
  },
  {
    id: 'workshops',
    name: 'Мастерские (продажи и склад)',
    frequency: 'уточняется',
    produces: 'Решения по улучшению процессов продаж и склада',
    owner: 'уточняется',
    icon: 'Wrench',
  },
  {
    id: 'foundation_meetings',
    name: 'Встречи по фундаменту',
    frequency: 'По календарю',
    produces: 'Фундамент: люди, CJM, IT, сервис',
    owner: 'уточняется',
    icon: 'Layers',
  },
  {
    id: 'live_broadcast',
    name: 'Прямой эфир с директорами',
    frequency: 'По календарю',
    produces: 'Стратегия, цели, достижения от первых лиц',
    owner: 'Ведущий менеджер по корп. коммуникациям',
    icon: 'Radio',
  },
  {
    id: 'annual_conference',
    name: 'Итоговая конференция',
    frequency: '1 раз / год',
    produces: 'Итоги года, планы',
    owner: 'Ведущий менеджер по корп. коммуникациям',
    icon: 'Mic',
  },
  {
    id: 'directorate',
    name: 'Дирекции',
    frequency: 'В течение года',
    produces: 'Решения для оптимизации работы и совершенствования процессов',
    owner: 'Директор дирекции',
    icon: 'Building2',
  },
]

export const sourceById = (id: string) => sources.find((s) => s.id === id)
