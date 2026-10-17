import type { Communication, CommunicationTypeId, Confirmations } from '../types/communication'
import type { ChannelId } from '../types/channel'
import { communicationTypes } from '../data/communicationTypes'
import { sources } from '../data/sources'
import { channels } from '../data/channels'
import { foundationOptions, strategyOptions, valueOptions } from '../data/priorities'
import { ORG_ROOT_ID, orgNodes } from '../data/orgStructure'
import { seedCommunications } from '../data/timelineEvents'
import { determineRequiredChannels } from '../utils/cascadeEngine'
import { assigneesOf } from '../utils/assignments'

/** Что портал хранит в localStorage */
export interface PersistedState {
  /** Коммуникации, созданные пользователем через паспорт инфоповода */
  userCommunications: Communication[]
  /** Подтверждения доведения, сделанные пользователем (в том числе по демо-коммуникациям) */
  confirmations: Confirmations
}

/**
 * Версия формата в localStorage.
 * 0 — Положение от 26.08: классификация, метка конфиденциальности, глубина каскада и срок из формы.
 * 1 — Положение от 07.10: 8 типов, новые каналы, срок доведения считается от запуска.
 * 2 — задания о каскадировании: адресаты коммуникации и подтверждения руководителей вместо ручных статусов.
 */
export const PERSIST_VERSION = 2

const known = {
  type: new Set<string>(communicationTypes.map((t) => t.id)),
  source: new Set<string>(sources.map((s) => s.id)),
  channel: new Set<string>(channels.map((c) => c.id)),
  foundation: new Set<string>(foundationOptions.map((o) => o.value)),
  strategy: new Set<string>(strategyOptions.map((o) => o.value)),
  value: new Set<string>(valueOptions.map((o) => o.value)),
  orgNode: new Set<string>(orgNodes.map((n) => n.id)),
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
    isKnownList(known.orgNode, c.audience) &&
    (c.audience as unknown[]).length > 0 &&
    isDate(c.createdAt)
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

/** Запись версии 1 → 2: адресат — вся компания, статус больше не хранится */
function migrateCommunicationV1(c: unknown): unknown {
  if (!isObject(c)) return c
  const next: Record<string, unknown> = { ...c, audience: [ORG_ROOT_ID] }
  delete next.status
  return next
}

/** Ручной статус «Доведено» версии 1 → подтверждения всех руководителей-адресатов */
function confirmationsFromStatuses(statusOverrides: unknown, userCommunications: unknown[]): Confirmations {
  if (!isObject(statusOverrides)) return {}
  const audienceById = new Map<string, string[]>(seedCommunications.map((c) => [c.id, c.audience]))
  for (const c of userCommunications) {
    if (isObject(c) && isString(c.id)) audienceById.set(c.id, [ORG_ROOT_ID])
  }
  const migratedAt = new Date().toISOString()
  const confirmations: Confirmations = {}
  for (const [commId, status] of Object.entries(statusOverrides)) {
    const audience = audienceById.get(commId)
    if (status !== 'completed' || !audience) continue
    confirmations[commId] = Object.fromEntries(assigneesOf(audience).map((a) => [a.id, migratedAt]))
  }
  return confirmations
}

/** Переводит данные, сохранённые старой версией портала, в текущий формат */
export function migratePersistedState(persisted: unknown, version: number): unknown {
  if (!isObject(persisted)) return persisted
  let state = persisted
  const saved = Array.isArray(state.userCommunications) ? state.userCommunications : []
  if (version < 1) {
    state = { ...state, userCommunications: saved.map(migrateCommunicationV0) }
  }
  if (version < 2) {
    const userCommunications = (state.userCommunications as unknown[] | undefined) ?? []
    state = {
      userCommunications: userCommunications.map(migrateCommunicationV1),
      confirmations: confirmationsFromStatuses(state.statusOverrides, userCommunications),
    }
  }
  return state
}

/** Оставляет только подтверждения с известным руководителем и корректной датой */
function sanitizeConfirmations(value: unknown): Confirmations {
  const confirmations: Confirmations = {}
  if (!isObject(value)) return confirmations
  for (const [commId, byManager] of Object.entries(value)) {
    if (!isObject(byManager)) continue
    const valid = Object.entries(byManager).filter(
      (entry): entry is [string, string] => isKnown(known.orgNode, entry[0]) && isDate(entry[1]),
    )
    if (valid.length > 0) confirmations[commId] = Object.fromEntries(valid)
  }
  return confirmations
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

  const dropped = saved.length - userCommunications.length
  if (dropped > 0) console.warn(`Пропущены сохранённые коммуникации, которые портал не может прочитать: ${dropped}`)

  return { userCommunications, confirmations: sanitizeConfirmations(state.confirmations) }
}
