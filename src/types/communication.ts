/** Площадки смыслообразования (п. 5.2 Положения) */
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

export interface Source {
  id: SourceId
  name: string
  frequency: string
  produces: string
  owner: string
  icon: string
}

/** Типы коммуникаций (п. 5.8 Положения) */
export type CommunicationTypeId =
  | 'strategic'
  | 'explanatory'
  | 'directive'
  | 'project'
  | 'reporting'
  | 'crisis'
  | 'values'
  | 'hr_social'
  | 'product'
  | 'documentation'

export interface CommunicationType {
  id: CommunicationTypeId
  name: string
  includes: string
  tone: string
  /** Глубина по таблице 5.8: уровень, до которого доводится информация */
  depthLabel: string
  icon: string
  color: string
}

/** Паспорт инфоповода — свойства (п. 5.3) */
export type ImpactScale = 'company' | 'directorate' | 'department'
export type Urgency = 'crisis' | 'urgent' | 'planned' | 'background'
export type ImpactType = 'action' | 'informing' | 'values'
export type Tone = 'official' | 'informal' | 'expert' | 'emotional' | 'restrained'

/** Метка конфиденциальности (слайд «Паспорт инфоповода») */
export type Confidentiality = 'open' | 'internal' | 'restricted'

export interface ClassificationParams {
  impactScale: ImpactScale
  urgency: Urgency
  impactType: ImpactType
  tone: Tone
}

/** Привязка к фундаменту, стратегии и ценностям (прил. 2) */
export type FoundationId = 'people' | 'cjm' | 'it' | 'service'
export type StrategyId = 'core' | 'geography' | 'assortment' | 'renovation'
export type ValueId = 'people_first' | 'development' | 'overcoming'

export interface Binding {
  foundation: FoundationId[]
  strategy: StrategyId[]
  values: ValueId[]
}

/** Правило трёх вопросов (п. 5.7) */
export interface ThreeQuestions {
  q1: string
  q2: string
  q3: string
}

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
  classification: ClassificationParams
  confidentiality: Confidentiality
  binding: Binding
  questions: ThreeQuestions
  cascadeDepth: CascadeLevel
  /** true, если глубина расширена до У.06 «при необходимости» */
  depthExtended: boolean
  requiredChannels: string[]
  extraChannels: string[]
  materials: string[]
  createdAt: string
  /** Дата доведения до конечных получателей */
  deadline: string
  status: CommunicationStatus
}
