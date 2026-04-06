import type { CommunicationTypeId } from '../types/communication'
import type { ChannelId } from '../types/channel'
import type { Urgency, ImpactScale, Sensitivity, Complexity, ImpactType } from '../types/communication'

export const baseDepthByType: Record<CommunicationTypeId, number> = {
  strategic: 5,       // У06
  change: 5,          // У06
  administrative: 4,  // У05
  explanatory: 4,     // У05
  operational: 5,     // У06
  project: 4,         // У05
  reporting: 3,       // У04
  documentation: 2,   // У03
  evaluation: 3,      // У04
  social: 5,          // У06
  crm: 4,             // У05
}

export interface ChannelRule {
  channelId: ChannelId
  conditions: {
    urgency?: Urgency[]
    impactScale?: ImpactScale[]
    sensitivity?: Sensitivity[]
    complexity?: Complexity[]
    impactType?: ImpactType[]
  }
}

export const channelRules: ChannelRule[] = [
  // Кризис → личные встречи + мессенджер + email
  { channelId: 'one_on_one', conditions: { urgency: ['crisis'] } },
  { channelId: 'messenger', conditions: { urgency: ['crisis', 'urgent'] } },
  { channelId: 'email', conditions: { urgency: ['crisis', 'urgent'], impactScale: ['company', 'directorate'] } },

  // Масштаб компания → совещания + портал
  { channelId: 'management_meeting', conditions: { impactScale: ['company'] } },
  { channelId: 'portal', conditions: { impactScale: ['company'] } },

  // Сложная + действие/понимание → личные встречи
  { channelId: 'one_on_one', conditions: { complexity: ['complex'], impactType: ['action', 'understanding'] } },

  // Действие → оперативки
  { channelId: 'team_meeting', conditions: { impactType: ['action'] } },

  // Вдохновение + компания → общее собрание
  { channelId: 'town_hall', conditions: { impactType: ['inspiration'], impactScale: ['company'] } },

  // Срочно + компания → email
  { channelId: 'email', conditions: { urgency: ['urgent'], impactScale: ['company'] } },

  // Дирекция → совещания
  { channelId: 'management_meeting', conditions: { impactScale: ['directorate'] } },
]

export const scaleCaps: Record<ImpactScale, number> = {
  company: 5,
  directorate: 3,
  department: 2,
}
