import {
  BarChart3,
  FileCheck,
  FileText,
  HeartHandshake,
  MessageCircle,
  Rocket,
  ShoppingBag,
  Siren,
  Sparkles,
  Target,
} from 'lucide-react'
import type { CommunicationType } from '../types/communication'
import { palette } from '../theme/colors'
import { indexById } from '../utils/collections'

/** 10 типов корпоративных коммуникаций — п. 5.8 Положения */
export const communicationTypes: CommunicationType[] = [
  {
    id: 'strategic',
    name: 'Стратегические',
    includes: 'Миссия и видение, стратегические цели, итоги конференций и стратсессий, долгосрочные планы',
    tone: 'Официальная + эмоциональная',
    icon: Target,
    color: palette.blue,
  },
  {
    id: 'explanatory',
    name: 'Разъяснительные',
    includes: 'Пояснения к оргизменениям, комментарии к нормативным документам, новые политики, изменения в мотивации',
    tone: 'Официальная + экспертная',
    icon: MessageCircle,
    color: palette.teal,
  },
  {
    id: 'directive',
    name: 'Распорядительные',
    includes: 'Приказы и распоряжения, кадровые назначения, структурные изменения, регламенты',
    tone: 'Официальная',
    icon: FileCheck,
    color: palette.orange,
  },
  {
    id: 'project',
    name: 'Проектные',
    includes: 'Открытие новых СТЦ / РЦ, запуск крупных проектов, выход в новые регионы, новые сервисы',
    tone: 'Эмоциональная + экспертная',
    icon: Rocket,
    color: palette.violet,
  },
  {
    id: 'reporting',
    name: 'Отчётные (результаты)',
    includes: 'Финансовые и операционные итоги, статусы по проектам, результаты опросов вовлечённости',
    tone: 'Экспертная + сдержанная',
    icon: BarChart3,
    color: palette.green,
  },
  {
    id: 'crisis',
    name: 'Кризисные / антикризисные',
    includes: 'Экстренные изменения процессов, реакция на внешние события, аварийные и сложные кадровые ситуации',
    tone: 'Сдержанная + официальная',
    icon: Siren,
    color: palette.crimson,
  },
  {
    id: 'values',
    name: 'Ценностные',
    includes: 'Итоги Комитета по ценностям, истории ценностного поведения, «герои ценностей», признание',
    tone: 'Эмоциональная + неформальная',
    icon: Sparkles,
    color: palette.pink,
  },
  {
    id: 'hr_social',
    name: 'HR / Социальные',
    includes: 'Корпоративные мероприятия, благотворительные программы, изменения льгот, обучение и развитие',
    tone: 'Неформальная + эмоциональная',
    icon: HeartHandshake,
    color: palette.amber,
  },
  {
    id: 'product',
    name: 'Продуктовые / коммерческие',
    includes: 'Новые товарные категории, важные изменения ассортимента, партнёрства, программы лояльности',
    tone: 'Экспертная + неформальная',
    icon: ShoppingBag,
    color: palette.sky,
  },
  {
    id: 'documentation',
    name: 'Документационные (служебные)',
    includes: 'Протоколы ключевых совещаний, краткие сводки для каскадирования, реестры решений',
    tone: 'Официальная',
    icon: FileText,
    color: palette.slate,
  },
]

export const typeById = indexById(communicationTypes)
