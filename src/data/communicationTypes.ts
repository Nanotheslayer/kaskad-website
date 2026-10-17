import { BarChart3, FileCheck, HeartHandshake, MessageCircle, ShoppingBag, Siren, Sparkles, Target } from 'lucide-react'
import type { CommunicationType } from '../types/communication'
import { palette } from '../theme/colors'
import { indexById } from '../utils/collections'

/** 8 типов коммуникаций с тональностью и обязательными каналами — таблица п. 5.4 Положения */
export const communicationTypes: CommunicationType[] = [
  {
    id: 'strategic',
    name: 'Стратегические',
    includes:
      'Миссия и видение, стратегические цели, итоги конференций и стратсессий, долгосрочные планы; стратегические проекты: открытие новых СТЦ / РЦ, выход в новые регионы, крупные IT-проекты, новые сервисы',
    tone: 'Официальная + эмоциональная',
    channels: ['posters', 'team_meetings'],
    icon: Target,
    color: palette.blue,
  },
  {
    id: 'explanatory',
    name: 'Разъяснительные',
    includes: 'Пояснения к оргизменениям, комментарии к нормативным документам',
    tone: 'Официальная + экспертная',
    channels: ['petlocal_feed', 'email', 'team_meetings'],
    icon: MessageCircle,
    color: palette.teal,
  },
  {
    id: 'directive',
    name: 'Распорядительные',
    includes: 'Приказы и распоряжения, кадровые назначения, структурные изменения, регламенты',
    tone: 'Официальная',
    channels: ['email', 'team_meetings'],
    icon: FileCheck,
    color: palette.orange,
  },
  {
    id: 'reporting',
    name: 'Отчётные (результаты)',
    includes: 'Финансовые и операционные итоги, статусы по проектам, результаты опросов вовлечённости',
    tone: 'Экспертная + сдержанная',
    channels: ['tv', 'magazine', 'digest', 'team_meetings'],
    icon: BarChart3,
    color: palette.green,
  },
  {
    id: 'crisis',
    name: 'Антикризисные',
    includes: 'Экстренные изменения процессов, реакция на внешние события, аварийные и сложные кадровые ситуации',
    tone: 'Сдержанная + официальная',
    channels: ['petlocal_feed', 'email', 'posters', 'team_meetings', 'directorate_channels'],
    icon: Siren,
    color: palette.crimson,
  },
  {
    id: 'values',
    name: 'Ценностные',
    includes: 'Истории ценностного поведения',
    tone: 'Эмоциональная + неформальная',
    channels: ['vk', 'petlocal_feed', 'tv', 'magazine'],
    icon: Sparkles,
    color: palette.pink,
  },
  {
    id: 'hr_social',
    name: 'HR / Социальные',
    includes: 'Корпоративные мероприятия, благотворительные программы, изменения льгот, обучение и развитие',
    tone: 'Неформальная + эмоциональная',
    channels: ['vk', 'petlocal_banner', 'petlocal_feed', 'email', 'tv', 'magazine', 'posters', 'digest'],
    icon: HeartHandshake,
    color: palette.amber,
  },
  {
    id: 'product',
    name: 'Продуктовые / коммерческие',
    includes: 'Новые товарные категории, важные изменения ассортимента, партнёрства, программы лояльности',
    tone: 'Экспертная + неформальная',
    channels: ['petlocal_feed', 'tv', 'digest', 'team_meetings'],
    icon: ShoppingBag,
    color: palette.sky,
  },
]

export const typeById = indexById(communicationTypes)
