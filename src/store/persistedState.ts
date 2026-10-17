import type { Communication, CommunicationStatus, CommunicationTypeId } from '../types/communication'
import type { ChannelId } from '../types/channel'
import { communicationTypes } from '../data/communicationTypes'
import { sources } from '../data/sources'
import { channels } from '../data/channels'
import { statusLabels } from '../data/statuses'
import { foundationOptions, strategyOptions, valueOptions } from '../data/priorities'
import { determineRequiredChannels } from '../utils/cascadeEngine'

/** Что портал хранит в localStorage */
export interface PersistedState {
  /** Коммуникации, созданные пользователем через паспорт инфоповода */
  userCommunications: Communication[]
  /** Ручные изменения статуса (в том числе для демо-коммуникаций) */
  statusOverrides: Record<string, CommunicationStatus>
}

/**
 * Версия формата в localStorage.
 * 0 — Положение от 26.08: классификация, метка конфиденциальности, глубина каскада и срок из формы.
 * 1 — Положение от 07.10: 8 типов, новые каналы, срок доведения считается от запуска.
 */
export const PERSIST_VERSION = 1

const known = {
  type: new Set<string>(communicationTypes.map((t) => t.id)),
  source: new Set<string>(sources.map((s) => s.id)),
  channel: new Set<string>(channels.map((c) => c.id)),
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
  const { initiator, binding, questions } = c
  return (
    [c.id, c.title, c.essence, c.keyMessage].every(isString) &&
    isObject(initiator) &&
    isString(initiator.name) &&
    isString(initiator.directorate) &&
    isKnown(known.source, c.sourceId) &&
    isKnown(known.type, c.typeId) &&
    isObject(binding) &&
    isKnownList(known.foundation, binding.foundation) &&
    isKnownList(known.strategy, binding.strategy) &&
    isKnownList(known.value, binding.values) &&
    isObject(questions) &&
    [questions.q1, questions.q2, questions.q3].every(isString) &&
    isKnownList(known.channel, c.requiredChannels) &&
    isKnownList(known.channel, c.extraChannels) &&
    Array.isArray(c.materials) &&
    c.materials.every(isString) &&
    isDate(c.createdAt) &&
    isKnown(known.status, c.status)
  )
}

/** Типы и каналы редакции 26.08, которых нет в редакции 07.10, → их преемники */
const legacyTypes: Record<string, CommunicationTypeId> = { project: 'strategic', documentation: 'directive' }
const legacyChannels: Record<string, ChannelId> = { oral: 'team_meetings', digest_hr: 'digest' }

/** Запись версии 0 → 1: тип и каналы по редакции 07.10, без классификации, метки, глубины и срока */
function migrateCommunicationV0(c: unknown): unknown {
  if (!isObject(c) || !isString(c.typeId)) return c
  const typeId = legacyTypes[c.typeId] ?? c.typeId
  // Неизвестный тип оставляем как есть — запись отбросит проверка при загрузке
  if (!isKnown(known.type, typeId)) return c

  const requiredChannels = determineRequiredChannels(typeId as CommunicationTypeId)
  const savedExtra = Array.isArray(c.extraChannels) ? c.extraChannels.filter(isString) : []
  const extraChannels = [...new Set(savedExtra.map((id) => legacyChannels[id] ?? id))].filter(
    (id) => isKnown(known.channel, id) && !requiredChannels.includes(id as ChannelId),
  )

  return {
    id: c.id,
    title: c.title,
    essence: c.essence,
    keyMessage: c.keyMessage,
    initiator: c.initiator,
    sourceId: c.sourceId,
    typeId,
    binding: c.binding,
    questions: c.questions,
    requiredChannels,
    extraChannels,
    materials: c.materials,
    createdAt: c.createdAt,
    status: c.status,
  }
}

/** Переводит данные, сохранённые старой версией портала, в текущий формат */
export function migratePersistedState(persisted: unknown, version: number): unknown {
  if (!isObject(persisted)) return persisted
  let state = persisted
  if (version < 1 && Array.isArray(state.userCommunications)) {
    state = { ...state, userCommunications: state.userCommunications.map(migrateCommunicationV0) }
  }
  return state
}

/**
 * Данные из localStorage могли быть изменены вручную или не пройти миграцию.
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
