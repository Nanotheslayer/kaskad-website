import { useState } from 'react'
import { orgNodes } from '../data/orgStructure'
import { motion } from 'framer-motion'
import { ChevronDown, Users, Calendar } from 'lucide-react'
import type { CascadeLevel } from '../types/communication'
import type { OrgNode } from '../types/organization'
import clsx from 'clsx'

const LEVELS: CascadeLevel[] = ['У01', 'У02', 'У03', 'У04', 'У05', 'У06']
const levelColors: Record<CascadeLevel, string> = {
  'У01': '#ed1b24',
  'У02': '#d97706',
  'У03': '#3b82f6',
  'У04': '#8b5cf6',
  'У05': '#14b8a6',
  'У06': '#6b7280',
}

function getDescendantIds(nodeId: string): string[] {
  const node = orgNodes.find((n) => n.id === nodeId)
  if (!node) return []
  const ids: string[] = [nodeId]
  for (const childId of node.children) {
    ids.push(...getDescendantIds(childId))
  }
  return ids
}

function getAncestorIds(nodeId: string): string[] {
  const ids: string[] = [nodeId]
  const parent = orgNodes.find((n) => n.children.includes(nodeId))
  if (parent) {
    ids.push(...getAncestorIds(parent.id))
  }
  return ids
}

export default function CascadeStructurePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const highlightedIds = selectedNode
    ? new Set([...getDescendantIds(selectedNode), ...getAncestorIds(selectedNode)])
    : null

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Нажмите на узел, чтобы подсветить путь каскадирования
      </p>

      <div className="space-y-4 overflow-x-auto pb-4">
        {LEVELS.map((level, levelIdx) => {
          const nodesAtLevel = orgNodes.filter((n) => n.level === level)
          if (nodesAtLevel.length === 0) return null

          return (
            <div key={level}>
              {/* Уровень */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex h-8 w-14 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: levelColors[level] }}
                >
                  {level}
                </div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {level === 'У01' && 'Генеральный директор'}
                  {level === 'У02' && 'Директора дирекций'}
                  {level === 'У03' && 'Руководители отделов'}
                  {level === 'У04' && 'Руководители групп'}
                  {level === 'У05' && 'Старшие специалисты'}
                  {level === 'У06' && 'Линейные специалисты'}
                </span>
              </div>

              {/* Узлы */}
              <div className="flex flex-wrap gap-2 ml-4">
                {nodesAtLevel.map((node) => {
                  const isHighlighted = highlightedIds ? highlightedIds.has(node.id) : true
                  const isSelected = selectedNode === node.id

                  return (
                    <motion.button
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      whileHover={{ scale: 1.02 }}
                      className={clsx(
                        'flex flex-col items-start rounded-xl border-2 p-3 text-left transition-all min-w-[180px]',
                        isSelected
                          ? 'border-brand-red bg-red-50 shadow-md'
                          : isHighlighted
                            ? 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                            : 'border-gray-50 bg-gray-50 opacity-30'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: levelColors[node.level] }}
                        />
                        <span className="text-xs font-bold text-brand-dark">{node.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 mb-1">{node.name}</span>
                      {node.children.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Users size={10} />
                          {node.children.length} подчинённых
                        </span>
                      )}
                      {node.regularMeeting && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-500 mt-1">
                          <Calendar size={10} />
                          {node.regularMeeting.name}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Стрелка вниз */}
              {levelIdx < LEVELS.length - 1 && nodesAtLevel.length > 0 && (
                <div className="flex justify-center my-1">
                  <ChevronDown size={20} className="text-gray-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-brand-yellow bg-yellow-50 p-4"
        >
          {(() => {
            const node = orgNodes.find((n) => n.id === selectedNode)
            if (!node) return null
            const descendants = getDescendantIds(selectedNode).length - 1
            return (
              <div>
                <div className="font-semibold text-sm text-brand-dark">{node.title} — {node.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Каскад достигает {descendants} сотрудников ниже по иерархии
                </div>
                {node.regularMeeting && (
                  <div className="text-xs text-blue-600 mt-1">
                    Регулярная встреча: {node.regularMeeting.name} ({node.regularMeeting.frequency})
                  </div>
                )}
              </div>
            )
          })()}
        </motion.div>
      )}
    </div>
  )
}
