import {
  LayoutDashboard,
  GitBranch,
  FileSignature,
  GalleryHorizontal,
  Map,
  Layers,
  Route,
  type LucideIcon,
} from 'lucide-react'

export type Tint = 'sun' | 'mint' | 'rose' | 'sky' | 'lilac' | 'peach'

export interface RouteMeta {
  path: string
  label: string
  title: string
  subtitle: string
  icon: LucideIcon
  tint: Tint
}

export const routeMeta: RouteMeta[] = [
  {
    path: '/',
    label: 'Обзор',
    title: 'Обзор каскадирования',
    subtitle: 'Что доносим до команд, что уже доведено и где сотрудники знают меньше всего',
    icon: LayoutDashboard,
    tint: 'sun',
  },
  {
    path: '/cascade',
    label: 'Структура каскада',
    title: 'Структура каскада',
    subtitle: 'Пилот на реальной структуре Дирекции по персоналу: от генерального директора до специалистов',
    icon: GitBranch,
    tint: 'mint',
  },
  {
    path: '/classify',
    label: 'Паспорт инфоповода',
    title: 'Паспорт инфоповода',
    subtitle: 'Заполните форму — система сама определит глубину каскада и обязательные каналы',
    icon: FileSignature,
    tint: 'rose',
  },
  {
    path: '/timeline',
    label: 'Таймлайн',
    title: 'Таймлайн коммуникаций',
    subtitle: 'Все коммуникации компании по хронологии — выберите период и типы',
    icon: GalleryHorizontal,
    tint: 'sky',
  },
  {
    path: '/map',
    label: 'Карта осведомлённости',
    title: 'Карта осведомлённости',
    subtitle: 'Результаты пульс-опросов по подразделениям относительно целевых значений',
    icon: Map,
    tint: 'lilac',
  },
  {
    path: '/model',
    label: 'Модель',
    title: 'Модель каскадирования',
    subtitle: 'Шесть этапов, через которые проходит любое информационное сообщение',
    icon: Layers,
    tint: 'peach',
  },
  {
    path: '/algorithm',
    label: 'Алгоритм руководителя',
    title: 'Алгоритм руководителя',
    subtitle: 'Осмысленное каскадирование: правило трёх вопросов и три фазы работы с информацией',
    icon: Route,
    tint: 'mint',
  },
]

export const tintClasses: Record<Tint, { bg: string; fg: string; solid: string }> = {
  sun: { bg: 'bg-tint-sun', fg: 'text-accent-sun', solid: '#ffcb05' },
  mint: { bg: 'bg-tint-mint', fg: 'text-accent-mint', solid: '#2fa84f' },
  rose: { bg: 'bg-tint-rose', fg: 'text-accent-rose', solid: '#f26b6b' },
  sky: { bg: 'bg-tint-sky', fg: 'text-accent-sky', solid: '#3b9ae8' },
  lilac: { bg: 'bg-tint-lilac', fg: 'text-accent-lilac', solid: '#7c5cdb' },
  peach: { bg: 'bg-tint-peach', fg: 'text-accent-peach', solid: '#f28b3c' },
}
