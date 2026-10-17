import type { LucideIcon } from 'lucide-react'
import type { ChannelId } from './channel'

/** Площадки смыслообразования (п. 5.1 Положения) */
export type SourceId =
  | 'administration'
  | 'monthly_meeting'
  | 'values_committee'
  | 'investment_committee'
  | 'change_committee'
  | 'workshops'
  | 'foundation_meetings'
  | 'live_broadcast'
  | 'annual_conference'
  | 'directorate'
  | 'qms_commission'

export interface Source {
  id: SourceId
  name: string
  frequency: string
  produces: string
  icon: LucideIcon
}

/** Типы коммуникаций (п. 5.4 Положения) */
export type CommunicationTypeId =
  'strategic' | 'explanatory' | 'directive' | 'reporting' | 'crisis' | 'values' | 'hr_social' | 'product'

export interface CommunicationType {
  id: CommunicationTypeId
  name: string
  includes: string
  /** Тональность по таблице п. 5.4 */
  tone: string
  /** Обязательные каналы по таблице п. 5.4 — минимум, который нельзя сократить (п. 6.2) */
  channels: ChannelId[]
  icon: LucideIcon
  color: string
}

/** Привязка к фундаменту, стратегии и ценностям (п. 7.2–7.3, приложение) */
export type FoundationId = 'people' | 'cjm' | 'it' | 'service'
export type StrategyId = 'core' | 'geography' | 'assortment' | 'renovation'
export type ValueId = 'people_first' | 'development' | 'overcoming'

export interface Binding {
  foundation: FoundationId[]
  strategy: StrategyId[]
  values: ValueId[]
}

/** Правило трёх вопросов (п. 7.5) */
export interface ThreeQuestions {
  q1: string
  q2: string
  q3: string
}

/** Уровни каскадирования У1–У6 (п. 4.1) */
export type CascadeLevel = 'У01' | 'У02' | 'У03' | 'У04' | 'У05' | 'У06'

export type CommunicationStatus = 'planned' | 'active' | 'completed'

export interface Communication {
  id: string
  title: string
  /** «Суть» — 2–3 предложения */
  essence: string
  keyMessage: string
  initiator: { name: string; directorate: string }
  sourceId: SourceId
  typeId: CommunicationTypeId
  binding: Binding
  questions: ThreeQuestions
  requiredChannels: ChannelId[]
  extraChannels: ChannelId[]
  materials: string[]
  /** Запуск каскада: с этого момента руководители получают задание о каскадировании */
  createdAt: string
  status: CommunicationStatus
}
