import {
  LayoutDashboard,
  GitBranch,
  FileSignature,
  GalleryHorizontal,
  Map as MapIcon,
  Layers,
  ListTodo,
  Route,
  type LucideIcon,
} from 'lucide-react'

/** Разделы портала: пункты меню, заголовки и подзаголовки страниц */
export interface RouteMeta {
  path: string
  label: string
  title: string
  subtitle: string
  icon: LucideIcon
}

export const routeMeta: RouteMeta[] = [
  {
    path: '/',
    label: 'Обзор',
    title: 'Обзор каскадирования',
    subtitle: 'Что доносим до команд, что уже доведено и где сотрудники знают меньше всего',
    icon: LayoutDashboard,
  },
  {
    path: '/agenda',
    label: 'Моя повестка',
    title: 'Моя повестка',
    subtitle: 'Все задания о каскадировании одним списком: что довести до команды на ближайшей встрече',
    icon: ListTodo,
  },
  {
    path: '/cascade',
    label: 'Структура каскада',
    title: 'Структура каскада',
    subtitle: 'Пилот на реальной структуре Дирекции по персоналу: от генерального директора до специалистов',
    icon: GitBranch,
  },
  {
    path: '/classify',
    label: 'Паспорт инфоповода',
    title: 'Паспорт инфоповода',
    subtitle: 'Заполните форму — тип коммуникации задаст тональность и обязательные каналы, срок посчитается сам',
    icon: FileSignature,
  },
  {
    path: '/timeline',
    label: 'Таймлайн',
    title: 'Таймлайн коммуникаций',
    subtitle: 'Все коммуникации компании по хронологии — выберите период и типы',
    icon: GalleryHorizontal,
  },
  {
    path: '/map',
    label: 'Оценка эффективности',
    title: 'Оценка эффективности',
    subtitle: 'Результаты опроса вовлечённости по подразделениям в сравнении со средним по компании',
    icon: MapIcon,
  },
  {
    path: '/model',
    label: 'Модель',
    title: 'Модель каскадирования',
    subtitle: 'Четыре этапа, через которые проходит каждое сообщение, и порядок действий в кризисе',
    icon: Layers,
  },
  {
    path: '/algorithm',
    label: 'Алгоритм руководителя',
    title: 'Алгоритм руководителя',
    subtitle: 'Осмысленное каскадирование: правило трёх вопросов, правила доведения и язык приоритетов Компании',
    icon: Route,
  },
]
