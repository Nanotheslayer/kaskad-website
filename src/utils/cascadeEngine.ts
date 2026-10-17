import { addDays, addHours } from 'date-fns'
import type { CommunicationTypeId } from '../types/communication'
import type { ChannelId } from '../types/channel'
import { typeById } from '../data/communicationTypes'

/** Довести на ближайшей встрече с командой, но не позднее 20 дней после получения задания (п. 7.6) */
export const DELIVERY_DAYS = 20
/** Антикризисные сообщения доводятся в первые часы кризиса: 0–24 часа (п. 9.7) */
export const CRISIS_DELIVERY_HOURS = 24

/** Крайний срок доведения для руководителя, получившего задание о каскадировании в момент assignedAt */
export function deliveryDeadline(typeId: CommunicationTypeId, assignedAt: Date | string): Date {
  const start = new Date(assignedAt)
  return typeId === 'crisis' ? addHours(start, CRISIS_DELIVERY_HOURS) : addDays(start, DELIVERY_DAYS)
}

/** Правило срока словами — для подписей в паспорте и повестке */
export function describeDeliveryRule(typeId: CommunicationTypeId): string {
  return typeId === 'crisis'
    ? `в первые ${CRISIS_DELIVERY_HOURS} часа, по возможности лично`
    : `на ближайшей встрече с командой, но не позднее ${DELIVERY_DAYS} дней после получения задания`
}

/** Обязательные каналы по типу — таблица п. 5.4 Положения */
export function determineRequiredChannels(typeId: CommunicationTypeId): ChannelId[] {
  return [...typeById(typeId).channels]
}
