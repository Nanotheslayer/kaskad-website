import type { CascadeLevel } from '../types/communication'
import type { OrgNode } from '../types/organization'
import { orgById, orgNodes } from '../data/orgStructure'
import { LEVEL_ORDER } from '../data/levels'

const parentById = new Map<string, OrgNode>(orgNodes.flatMap((n) => n.children.map((childId) => [childId, n] as const)))

export function getNode(nodeId: string): OrgNode {
  const node = orgById.get(nodeId)
  if (!node) throw new Error(`Неизвестный узел оргструктуры: ${nodeId}`)
  return node
}

/** Узел и все его потомки */
function getSubtree(nodeId: string): OrgNode[] {
  const node = getNode(nodeId)
  return [node, ...node.children.flatMap((id) => getSubtree(id))]
}

/** Путь от генерального директора до узла */
export function getPath(nodeId: string): OrgNode[] {
  const path: OrgNode[] = []
  for (let current: OrgNode | undefined = getNode(nodeId); current; current = parentById.get(current.id)) {
    path.unshift(current)
  }
  return path
}

/** id всех узлов, у которых есть дочерние, — для «Раскрыть всё» */
export const expandableIds: string[] = orgNodes.filter((n) => n.children.length > 0).map((n) => n.id)

/** Сколько человек в узле: для команды — численность, для руководителя — 1 */
const ownHeadcount = (n: OrgNode) => (n.kind === 'team' ? (n.headcount ?? 0) : n.kind === 'unit' || n.name ? 1 : 0)

export interface LevelReach {
  level: CascadeLevel
  people: number
  units: number
}

/** Охват каскада по уровням в поддереве узла */
export function reachByLevel(rootId: string): LevelReach[] {
  const reach = new Map(LEVEL_ORDER.map((level) => [level, { level, people: 0, units: 0 }]))
  for (const node of getSubtree(rootId)) {
    const row = reach.get(node.level)!
    row.people += ownHeadcount(node)
    if (node.kind !== 'team') row.units += 1
  }
  return [...reach.values()]
}

/** Руководители подразделений в поддереве узла, включая сам узел */
export function unitsInSubtree(rootId: string): OrgNode[] {
  return getSubtree(rootId).filter((n) => n.kind === 'unit')
}
