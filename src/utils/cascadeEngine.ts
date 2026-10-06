import type {
  CascadeLevel,
  ClassificationParams,
  CommunicationTypeId,
  Confidentiality,
} from '../types/communication'
import type { ChannelId } from '../types/channel'
import { baseDepthByType, extendableTypes, publicChannels, requiredChannelsByType } from '../data/cascadeMatrix'
import { levelIndex } from '../data/levels'

export interface DepthResult {
  depth: CascadeLevel
  /** Глубина расширена до У.06 «при необходимости» */
  extended: boolean
  reason: string
}

/**
 * Глубина каскадирования (п. 5.9 Положения).
 * Базовое правило задаёт тип коммуникации; для разъяснительных, распорядительных
 * и отчётных глубина может быть расширена до У.06 «при необходимости».
 */
export function determineCascadeDepth(
  typeId: CommunicationTypeId,
  classification: Partial<ClassificationParams>,
): DepthResult {
  const base = baseDepthByType[typeId]

  if (extendableTypes.includes(typeId)) {
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
      reason: 'Базовая глубина для типа. Расширится до У.06, если сообщение затрагивает всю компанию и требует действий или срочное',
    }
  }

  const reasons: Partial<Record<CommunicationTypeId, string>> = {
    documentation: 'Документационные (служебные) сообщения доводятся до У.03 и не публикуются широко',
  }
  return {
    depth: base,
    extended: false,
    reason: reasons[typeId] ?? 'Тип коммуникации всегда доводится до всех сотрудников (У.06)',
  }
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
  if (!narrowed.includes('email')) narrowed.push('email')
  if (!narrowed.includes('oral')) narrowed.push('oral')
  return narrowed
}

export function getLevelLabel(level: CascadeLevel): string {
  const labels: Record<CascadeLevel, string> = {
    'У01': 'Генеральный директор',
    'У02': 'Директора дирекций и дивизионов',
    'У03': 'Управляющие и директора служб',
    'У04': 'Руководители отделов',
    'У05': 'Ведущие менеджеры, старшие специалисты',
    'У06': 'Линейные сотрудники',
  }
  return labels[level]
}

export const levelShort = (level: CascadeLevel) => level.replace('У', 'У.')

export const reachesLevel = (depth: CascadeLevel, level: CascadeLevel) => levelIndex(level) <= levelIndex(depth)
