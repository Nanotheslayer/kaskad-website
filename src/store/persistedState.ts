import type { Communication, CommunicationStatus } from '../types/communication'
import { communicationTypes } from '../data/communicationTypes'
import { sources } from '../data/sources'
import { levels } from '../data/levels'
import { channels } from '../data/channels'
import { statusLabels } from '../data/statuses'
import {
  confidentialityOptions,
  foundationOptions,
  impactScaleOptions,
  impactTypeOptions,
  strategyOptions,
  toneOptions,
  urgencyOptions,
  valueOptions,
} from '../data/classificationOptions'

export interface PersistedState {
  userCommunications: Communication[]
  statusOverrides: Record<string, CommunicationStatus>
}

const known = {
  type: new Set<string>(communicationTypes.map((t) => t.id)),
  source: new Set<string>(sources.map((s) => s.id)),
  level: new Set<string>(levels.map((l) => l.id)),
  channel: new Set<string>(channels.map((c) => c.id)),
  impactScale: new Set<string>(impactScaleOptions.map((o) => o.value)),
  urgency: new Set<string>(urgencyOptions.map((o) => o.value)),
  impactType: new Set<string>(impactTypeOptions.map((o) => o.value)),
  tone: new Set<string>(toneOptions.map((o) => o.value)),
  confidentiality: new Set<string>(confidentialityOptions.map((o) => o.value)),
  foundation: new Set<string>(foundationOptions.map((o) => o.value)),
  strategy: new Set<string>(strategyOptions.map((o) => o.value)),
  value: new Set<string>(valueOptions.map((o) => o.value)),
  status: new Set<string>(Object.keys(statusLabels)),
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const isString = (v: unknown): v is string => typeof v === 'string'
const isKnown = (ids: Set<string>, v: unknown) => isString(v) && ids.has(v)
const isKnownList = (ids: Set<string>, v: unknown) => Array.isArray(v) && v.every((x) => isKnown(ids, x))
const isDate = (v: unknown) => isString(v) && !Number.isNaN(Date.parse(v))

/** Запись совпадает с тем, что сохраняет форма паспорта, и все её id есть в справочниках */
export function isValidCommunication(c: unknown): c is Communication {
  if (!isObject(c)) return false
  const { initiator, classification: cls, binding, questions } = c
  return (
    [c.id, c.title, c.essence, c.keyMessage].every(isString) &&
    isObject(initiator) &&
    isString(initiator.name) &&
    isString(initiator.directorate) &&
    isKnown(known.source, c.sourceId) &&
    isKnown(known.type, c.typeId) &&
    isObject(cls) &&
    isKnown(known.impactScale, cls.impactScale) &&
    isKnown(known.urgency, cls.urgency) &&
    isKnown(known.impactType, cls.impactType) &&
    isKnown(known.tone, cls.tone) &&
    isKnown(known.confidentiality, c.confidentiality) &&
    isObject(binding) &&
    isKnownList(known.foundation, binding.foundation) &&
    isKnownList(known.strategy, binding.strategy) &&
    isKnownList(known.value, binding.values) &&
    isObject(questions) &&
    [questions.q1, questions.q2, questions.q3].every(isString) &&
    isKnown(known.level, c.cascadeDepth) &&
    typeof c.depthExtended === 'boolean' &&
    isKnownList(known.channel, c.requiredChannels) &&
    isKnownList(known.channel, c.extraChannels) &&
    Array.isArray(c.materials) &&
    c.materials.every(isString) &&
    isDate(c.createdAt) &&
    isDate(c.deadline) &&
    isKnown(known.status, c.status)
  )
}

/**
 * Данные из localStorage могли сохраниться старой версией портала или быть изменены вручную.
 * Страницы рассчитывают на валидные id справочников, поэтому записи, которые не проходят
 * проверку, отбрасываем при загрузке целиком, а не падаем при отрисовке.
 */
export function sanitizePersistedState(persisted: unknown): PersistedState {
  const state = isObject(persisted) ? persisted : {}
  const saved = Array.isArray(state.userCommunications) ? state.userCommunications : []
  const userCommunications = saved.filter(isValidCommunication)
  const overrides = isObject(state.statusOverrides) ? Object.entries(state.statusOverrides) : []
  const statusOverrides = Object.fromEntries(overrides.filter(([, status]) => isKnown(known.status, status)))

  const dropped = saved.length - userCommunications.length
  if (dropped > 0) console.warn(`Пропущены сохранённые коммуникации, которые портал не может прочитать: ${dropped}`)

  return { userCommunications, statusOverrides: statusOverrides as PersistedState['statusOverrides'] }
}
