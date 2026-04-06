export type SourceId =
  | 'board'
  | 'monthly_meeting'
  | 'committee'
  | 'project_office'
  | 'hr'
  | 'marketing'

export interface Source {
  id: SourceId
  name: string
  description: string
  icon: string
}

export type CommunicationTypeId =
  | 'strategic'
  | 'change'
  | 'administrative'
  | 'explanatory'
  | 'operational'
  | 'project'
  | 'reporting'
  | 'documentation'
  | 'evaluation'
  | 'social'
  | 'crm'

export interface CommunicationType {
  id: CommunicationTypeId
  name: string
  purpose: string
  icon: string
  color: string
}

export type ImpactScale = 'company' | 'directorate' | 'department'
export type Urgency = 'crisis' | 'urgent' | 'planned'
export type ImpactType = 'action' | 'understanding' | 'informing' | 'inspiration'
export type Complexity = 'simple' | 'medium' | 'complex'
export type Sensitivity = 'public' | 'internal' | 'restricted'

export interface ClassificationParams {
  impactScale: ImpactScale
  urgency: Urgency
  impactType: ImpactType
  complexity: Complexity
  sensitivity: Sensitivity
}

export type CascadeLevel = 'У01' | 'У02' | 'У03' | 'У04' | 'У05' | 'У06'

export interface Communication {
  id: string
  title: string
  description: string
  sourceId: SourceId
  typeId: CommunicationTypeId
  classification: ClassificationParams
  cascadeDepth: CascadeLevel
  requiredChannels: string[]
  createdAt: string
  isMandatoryCascade: boolean
  status: 'draft' | 'active' | 'completed'
}
