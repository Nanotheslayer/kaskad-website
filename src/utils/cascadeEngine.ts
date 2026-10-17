import type { CascadeLevel, ClassificationParams, CommunicationTypeId, Confidentiality } from '../types/communication'
import type { ChannelId } from '../types/channel'
import { baseDepthByType, extendableTypes, publicChannels, requiredChannelsByType } from '../data/cascadeMatrix'
import { levelById } from '../data/levels'

export interface DepthResult {
  depth: CascadeLevel
  /** Глубина расширена до У.06 «при необходимости» */
  extended: boolean
  reason: string
}

/** Каналы, которые остаются в маршруте при метке «Ограниченный доступ» в любом случае */
const RESTRICTED_FALLBACK_CHANNELS: ChannelId[] = ['email', 'oral']

export const isExtendable = (typeId: CommunicationTypeId) => extendableTypes.includes(typeId)

/**
 * Глубина каскадирования (п. 5.8–5.9 Положения).
 * Базовое правило задаёт тип коммуникации; для разъяснительных и распорядительных
 * глубина может быть расширена до У.06 «при необходимости». Условие расширения
 * Положение не задаёт — это правило портала.
 */
export function determineCascadeDepth(
  typeId: CommunicationTypeId,
  classification: Partial<ClassificationParams>,
): DepthResult {
  const base = baseDepthByType[typeId]

  if (!isExtendable(typeId)) {
    return { depth: base, extended: false, reason: fixedDepthReason(typeId) }
  }

  const wide = classification.impactScale === 'company'
  const needsAction = classification.impactType === 'action'
  const hot = classification.urgency === 'crisis' || classification.urgency === 'urgent'

  if (wide && (needsAction || hot)) {
    return {
      depth: 'У06',
      extended: true,
      reason: needsAction
        ? 'Информация касается всей компании и требует действий от сотрудников — доводим до У.06'
        : 'Информация касается всей компании и срочная — доводим до У.06',
    }
  }

  return {
    depth: base,
    extended: false,
    reason:
      'Базовая глубина для типа. По правилу портала расширится до У.06, если сообщение затрагивает всю компанию и требует действий или срочное',
  }
}

function fixedDepthReason(typeId: CommunicationTypeId): string {
  const base = baseDepthByType[typeId]
  if (typeId === 'documentation')
    return 'Документационные (служебные) сообщения доводятся до У.03 и не публикуются широко'
  if (base === 'У06') return 'Тип коммуникации всегда доводится до всех сотрудников (У.06)'
  return `Для этого типа глубина фиксирована — до ${levelById(base).short}`
}

/** Краткая запись правила глубины для типа: «→ У.04 (→ У.06 при необх.)» */
export function describeDepthRule(typeId: CommunicationTypeId): string {
  const base = `→ ${levelById(baseDepthByType[typeId]).short}`
  return isExtendable(typeId) ? `${base} (→ ${levelById('У06').short} при необх.)` : base
}

/**
 * Обязательные каналы по типу — таблица п. 6.3 Положения.
 * Метка «Ограниченный доступ» убирает каналы широкого охвата.
 */
export function determineRequiredChannels(
  typeId: CommunicationTypeId,
  confidentiality: Confidentiality = 'internal',
): ChannelId[] {
  const required = requiredChannelsByType[typeId]
  if (confidentiality !== 'restricted') return [...required]

  const narrowed = required.filter((id) => !publicChannels.includes(id))
  for (const id of RESTRICTED_FALLBACK_CHANNELS) {
    if (!narrowed.includes(id)) narrowed.push(id)
  }
  return narrowed
}
