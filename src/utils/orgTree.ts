import type { CascadeLevel } from '../types/communication'
import type { OrgNode } from '../types/organization'
import { orgNodes, orgById } from '../data/orgStructure'
import { LEVEL_ORDER, levelIndex } from '../data/levels'

export function getDescendantIds(nodeId: string): string[] {
  const node = orgById.get(nodeId)
  if (!node) return []
  const ids: string[] = [nodeId]
  for (const childId of node.children) ids.push(...getDescendantIds(childId))
  return ids
}

export function getParent(nodeId: string): OrgNode | undefined {
  return orgNodes.find((n) => n.children.includes(nodeId))
}

/** Путь от генерального директора до узла */
export function getPath(nodeId: string): OrgNode[] {
  const path: OrgNode[] = []
  let current = orgById.get(nodeId)
  while (current) {
    path.unshift(current)
    current = getParent(current.id)
  }
  return path
}

/** Сколько человек в узле: для команды — численность, для руководителя — 1 */
export const ownHeadcount = (n: OrgNode) => (n.kind === 'team' ? n.headcount ?? 0 : n.kind === 'unit' || n.name ? 1 : 0)

export interface LevelReach {
  level: CascadeLevel
  people: number
  units: number
}

/** Охват каскада по уровням в поддереве узла */
export function reachByLevel(rootId: string): LevelReach[] {
  const acc = new Map<CascadeLevel, LevelReach>(
    LEVEL_ORDER.map((l) => [l, { level: l, people: 0, units: 0 }]),
  )
  for (const id of getDescendantIds(rootId)) {
    const node = orgById.get(id)
    if (!node) continue
    const row = acc.get(node.level)!
    row.people += ownHeadcount(node)
    if (node.kind !== 'team') row.units += 1
  }
  return LEVEL_ORDER.map((l) => acc.get(l)!)
}

export function peopleReached(rootId: string, depth: CascadeLevel): number {
  return reachByLevel(rootId)
    .filter((r) => levelIndex(r.level) <= levelIndex(depth))
    .reduce((s, r) => s + r.people, 0)
}

export function isReached(node: OrgNode, depth: CascadeLevel): boolean {
  return levelIndex(node.level) <= levelIndex(depth)
}
