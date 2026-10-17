import type { Communication, Confirmations, TrackedCommunication } from '../types/communication'
import type { OrgNode } from '../types/organization'
import { ORG_ROOT_ID } from '../data/orgStructure'
import { deliveryDeadline } from './cascadeEngine'
import { getNode, getPath, unitsInSubtree } from './orgTree'

/**
 * Кто получает задание о каскадировании: руководители подразделений с командой в выбранных ветках.
 * Задание приходит всем сразу при запуске каскада; паспорт с тезисами доступен каждому.
 */
export function assigneesOf(audience: readonly string[]): OrgNode[] {
  const seen = new Set<string>()
  const result: OrgNode[] = []
  for (const rootId of audience) {
    for (const unit of unitsInSubtree(rootId)) {
      if (unit.children.length === 0 || seen.has(unit.id)) continue
      seen.add(unit.id)
      result.push(unit)
    }
  }
  return result
}

/** Все руководители, которые могут получить задание, — для выбора чужой повестки */
export const allAssignees = assigneesOf([ORG_ROOT_ID])

/** Подпись адресатов: «Вся компания» или названия выбранных подразделений */
export const describeAudience = (audience: readonly string[]) =>
  audience.includes(ORG_ROOT_ID) ? 'Вся компания' : audience.map((id) => getNode(id).title).join(', ')

/**
 * Выбор адресатов в паспорте. «Вся компания» исключает остальное; выбранная ветка заменяет
 * своих предков и потомков, чтобы одно подразделение не попадало в адресаты дважды.
 * Снятие последней ветки возвращает «Всю компанию».
 */
export function toggleAudience(audience: readonly string[], id: string): string[] {
  if (id === ORG_ROOT_ID) return [ORG_ROOT_ID]
  if (audience.includes(id)) {
    const next = audience.filter((x) => x !== id)
    return next.length > 0 ? next : [ORG_ROOT_ID]
  }
  const ancestors = new Set(getPath(id).map((n) => n.id))
  const unrelated = audience.filter((x) => !ancestors.has(x) && !getPath(x).some((n) => n.id === id))
  return [...unrelated, id]
}

/** Ход доведения: статус по датам и подтверждениям руководителей */
export function trackCommunication(
  comm: Communication,
  now: Date,
  confirmed: Record<string, string> = {},
): TrackedCommunication {
  const deadline = deliveryDeadline(comm.typeId, comm.createdAt)
  const assignees = assigneesOf(comm.audience)
  const done = assignees.filter((a) => confirmed[a.id]).length
  const total = assignees.length
  const launched = new Date(comm.createdAt) <= now
  // Если задание некому получать (адресаты вне пилота), каскад завершается по сроку
  const finished = total > 0 ? done === total : deadline < now
  return {
    ...comm,
    deadline,
    progress: { done, total },
    status: !launched ? 'planned' : finished ? 'completed' : 'active',
  }
}

export interface AgendaItem {
  comm: TrackedCommunication
  /** Когда руководитель подтвердил доведение; null — ещё не довёл */
  confirmedAt: string | null
  overdue: boolean
}

export interface Agenda {
  /** К ближайшей встрече с командой: сначала просроченные, затем по сроку */
  pending: AgendaItem[]
  /** Каскад ещё не запущен — задание придёт позже */
  upcoming: AgendaItem[]
  /** Уже доведено — сначала последние */
  done: AgendaItem[]
}

/** Личная повестка руководителя: все задания о каскадировании одним списком */
export function agendaFor(
  managerId: string,
  communications: readonly TrackedCommunication[],
  confirmations: Confirmations,
  now: Date,
): Agenda {
  const items = communications
    .filter((c) => assigneesOf(c.audience).some((a) => a.id === managerId))
    .map((comm): AgendaItem => {
      const confirmedAt = confirmations[comm.id]?.[managerId] ?? null
      return { comm, confirmedAt, overdue: !confirmedAt && comm.status !== 'planned' && comm.deadline < now }
    })

  const byDeadline = (a: AgendaItem, b: AgendaItem) => +a.comm.deadline - +b.comm.deadline
  return {
    pending: items
      .filter((i) => !i.confirmedAt && i.comm.status !== 'planned')
      .sort((a, b) => Number(b.overdue) - Number(a.overdue) || byDeadline(a, b)),
    upcoming: items
      .filter((i) => i.comm.status === 'planned')
      .sort((a, b) => +new Date(a.comm.createdAt) - +new Date(b.comm.createdAt)),
    done: items
      .filter((i) => i.confirmedAt)
      .sort((a, b) => +new Date(b.confirmedAt ?? 0) - +new Date(a.confirmedAt ?? 0)),
  }
}
