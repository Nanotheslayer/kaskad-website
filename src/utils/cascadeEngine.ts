import type { CommunicationTypeId, ClassificationParams, CascadeLevel } from '../types/communication'
import type { ChannelId } from '../types/channel'
import { baseDepthByType, channelRules, scaleCaps } from '../data/cascadeMatrix'

const LEVELS: CascadeLevel[] = ['У01', 'У02', 'У03', 'У04', 'У05', 'У06']

export function determineCascadeDepth(
  typeId: CommunicationTypeId,
  classification: ClassificationParams,
): CascadeLevel {
  let levelIndex = baseDepthByType[typeId]

  // Тип воздействия: действие углубляет, информирование сокращает
  if (classification.impactType === 'action') {
    levelIndex = Math.min(levelIndex + 1, 5)
  } else if (classification.impactType === 'informing') {
    levelIndex = Math.max(levelIndex - 1, 0)
  }

  // Ограничение по масштабу влияния
  levelIndex = Math.min(levelIndex, scaleCaps[classification.impactScale])

  // Кризис — минимум У05
  if (classification.urgency === 'crisis') {
    levelIndex = Math.max(levelIndex, 4)
  }

  return LEVELS[levelIndex]
}

export function determineRequiredChannels(
  classification: ClassificationParams,
): ChannelId[] {
  const matched = new Set<ChannelId>()

  for (const rule of channelRules) {
    const { conditions } = rule
    let matches = true

    if (conditions.urgency && !conditions.urgency.includes(classification.urgency)) {
      matches = false
    }
    if (conditions.impactScale && !conditions.impactScale.includes(classification.impactScale)) {
      matches = false
    }
    if (conditions.sensitivity && !conditions.sensitivity.includes(classification.sensitivity)) {
      matches = false
    }
    if (conditions.complexity && !conditions.complexity.includes(classification.complexity)) {
      matches = false
    }
    if (conditions.impactType && !conditions.impactType.includes(classification.impactType)) {
      matches = false
    }

    if (matches) {
      matched.add(rule.channelId)
    }
  }

  // Ограниченная чувствительность → исключить публичные каналы
  if (classification.sensitivity === 'restricted') {
    matched.delete('portal')
    matched.delete('conference')
    matched.delete('town_hall')
    matched.add('one_on_one')
    matched.add('management_meeting')
  }

  // Минимум один канал
  if (matched.size === 0) {
    matched.add('team_meeting')
  }

  return Array.from(matched)
}

export function isMandatoryCascade(
  typeId: CommunicationTypeId,
  classification: ClassificationParams,
  depth: CascadeLevel,
): boolean {
  if (typeId === 'strategic' || typeId === 'change') return true
  if (classification.impactScale === 'company') return true
  if (classification.urgency === 'crisis') return true
  const depthIndex = LEVELS.indexOf(depth)
  if (depthIndex >= 4) return true
  return false
}

export function getLevelLabel(level: CascadeLevel): string {
  const labels: Record<CascadeLevel, string> = {
    'У01': 'Генеральный директор',
    'У02': 'Директора дирекций',
    'У03': 'Руководители отделов',
    'У04': 'Руководители групп',
    'У05': 'Старшие специалисты',
    'У06': 'Линейные специалисты',
  }
  return labels[level]
}

export const LEVEL_ORDER = LEVELS
