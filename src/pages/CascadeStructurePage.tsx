import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Check,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Info,
  Play,
  RotateCcw,
  UserRound,
  Users,
} from 'lucide-react'
import clsx from 'clsx'
import { orgNodes, orgById } from '../data/orgStructure'
import { levels, levelById, levelIndex } from '../data/levels'
import { communicationTypes, typeById } from '../data/communicationTypes'
import { determineCascadeDepth } from '../utils/cascadeEngine'
import { getPath, peopleReached, reachByLevel } from '../utils/orgTree'
import type { OrgNode } from '../types/organization'
import type { CommunicationTypeId } from '../types/communication'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import LevelPill from '../components/ui/LevelPill'
import { extendableTypes } from '../data/cascadeMatrix'

const DEFAULT_SELECTED = 'kais_cfo'
const ROOT_ID = 'gd'

interface SimState {
  typeId: CommunicationTypeId | ''
  wide: boolean
}

function allParentIds(): string[] {
  return orgNodes.filter((n) => n.children.length > 0).map((n) => n.id)
}

export default function CascadeStructurePage() {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SELECTED)
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['gd', 'dp', ...getPath(DEFAULT_SELECTED).map((n) => n.id)]),
  )
  const [sim, setSim] = useState<SimState>({ typeId: '', wide: false })
  const [wave, setWave] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)

  const depthInfo = useMemo(() => {
    if (!sim.typeId) return null
    return determineCascadeDepth(sim.typeId, {
      impactScale: sim.wide ? 'company' : 'department',
      impactType: sim.wide ? 'action' : 'informing',
      urgency: 'planned',
    })
  }, [sim])

  const depthIdx = depthInfo ? levelIndex(depthInfo.depth) : null
  const activeIdx = depthIdx === null ? null : (wave ?? depthIdx)

  // Анимация «волны» каскада по уровням
  useEffect(() => {
    if (!playing || depthIdx === null) return
    const id = window.setInterval(() => {
      setWave((w) => {
        const next = (w ?? -1) + 1
        if (next >= depthIdx) {
          setPlaying(false)
          return depthIdx
        }
        return next
      })
    }, 750)
    return () => window.clearInterval(id)
  }, [playing, depthIdx])

  const startPlay = () => {
    if (depthIdx === null) return
    // раскрываем всё дерево, чтобы волна была видна
    setExpanded(new Set(allParentIds()))
    setWave(-1)
    setPlaying(true)
  }

  const resetSim = () => {
    setPlaying(false)
    setWave(null)
  }

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const select = (id: string) => {
    setSelectedId(id)
    setExpanded((prev) => new Set([...prev, ...getPath(id).map((n) => n.id)]))
  }

  const path = useMemo(() => getPath(selectedId), [selectedId])
  const pathIds = useMemo(() => new Set(path.map((n) => n.id)), [path])
  const selected = orgById.get(selectedId)!

  const dpReach = useMemo(() => reachByLevel('dp'), [])
  const dpTotal = orgById.get('dp')!.headcount ?? 0
  const simPeople = depthInfo ? peopleReached('dp', depthInfo.depth) : null
  const simLeaders = depthInfo
    ? orgNodes.filter((n) => n.kind === 'unit' && n.level !== 'У01' && levelIndex(n.level) <= levelIndex(depthInfo.depth) && getPath(n.id).some((p) => p.id === 'dp')).length
    : null

  return (
    <div className="space-y-5">
      {/* Пилотный баннер + уровни */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow-light via-white to-tint-mint/60 p-4 shadow-card @xl:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
              Пилот
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">Дирекция по персоналу</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {dpTotal} сотрудников, {orgNodes.filter((n) => n.kind === 'unit' && n.id !== 'gd' && getPath(n.id).some((p) => p.id === 'dp') && n.id !== 'dp').length} подразделений
              и руководителей. Названия подразделений — по структуре в «Петлокале»; ФИО руководителей и численность условные.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 @2xl:grid-cols-3 @6xl:grid-cols-6">
          {levels.map((l, i) => {
            const row = dpReach[i]
            return (
              <div key={l.id} className="rounded-2xl bg-white/80 p-3 backdrop-blur">
                <div className="flex items-center justify-between">
                  <LevelPill level={l.id} />
                  {row.people > 0 && <span className="text-xs font-medium tabular-nums text-ink-soft">{row.people} чел.</span>}
                </div>
                <div className="mt-2 text-[13px] font-medium leading-tight text-ink">{l.title}</div>
                <div className="mt-1 text-[11px] leading-snug text-ink-muted">{l.entryPoint}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Сценарий каскада */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full min-w-0 @2xl:w-auto @2xl:min-w-64 @2xl:flex-1">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted" htmlFor="sim-type">
              Проиграть каскад для типа коммуникации
            </label>
            <select
              id="sim-type"
              value={sim.typeId}
              onChange={(e) => {
                setSim({ typeId: e.target.value as CommunicationTypeId | '', wide: false })
                resetSim()
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-red focus:outline-none"
            >
              <option value="">— выберите тип, чтобы увидеть глубину —</option>
              {communicationTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} · {t.depthLabel}
                </option>
              ))}
            </select>
          </div>

          {sim.typeId && extendableTypes.includes(sim.typeId) && (
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={sim.wide}
                onChange={(e) => {
                  setSim({ ...sim, wide: e.target.checked })
                  resetSim()
                }}
                className="h-4 w-4 accent-brand-red"
              />
              Касается всей компании и требует действий
            </label>
          )}

          <div className="flex gap-2">
            <Button onClick={startPlay} disabled={!depthInfo || playing}>
              <Play size={16} /> Запустить каскад
            </Button>
            {wave !== null && (
              <Button variant="secondary" onClick={resetSim}>
                <RotateCcw size={16} /> Сбросить
              </Button>
            )}
          </div>
        </div>

        {depthInfo && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-1 gap-3 @xl:grid-cols-2 @5xl:grid-cols-4">
            <div className="rounded-2xl p-3" style={{ backgroundColor: typeById(sim.typeId as CommunicationTypeId)!.color + '1c' }}>
              <div className="text-xs text-ink-muted">Нижний уровень</div>
              <div className="mt-1 flex items-center gap-2">
                <LevelPill level={depthInfo.depth} />
                <span className="text-sm font-medium text-ink">{levelById(depthInfo.depth).title}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3">
              <div className="text-xs text-ink-muted">Охват в Дирекции по персоналу</div>
              <div className="mt-1 text-lg font-bold text-ink">
                {simPeople} <span className="text-sm font-normal text-ink-soft">из {dpTotal} чел.</span>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3">
              <div className="text-xs text-ink-muted">Руководителей, которые должны донести</div>
              <div className="mt-1 text-lg font-bold text-ink">{simLeaders}</div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-snug text-ink-soft">
              <Info size={14} className="mb-1 text-ink-muted" />
              {depthInfo.reason}
            </div>
          </motion.div>
        )}
      </Card>

      <div className="grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[minmax(0,1fr)_320px] @6xl:grid-cols-[minmax(0,1fr)_360px] @7xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Дерево */}
        <Card padding={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
            <div className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <Building2 size={18} className="text-ink-muted" />
              Структура компании
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setExpanded(new Set(allParentIds()))}>
                <ChevronsUpDown size={14} /> Раскрыть всё
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setExpanded(new Set(['gd', 'dp']))}>
                <ChevronsDownUp size={14} /> Свернуть
              </Button>
            </div>
          </div>
          <div className="p-2 @xl:p-4">
            <TreeNode
              node={orgById.get(ROOT_ID)!}
              depth={0}
              expanded={expanded}
              selectedId={selectedId}
              pathIds={pathIds}
              activeIdx={activeIdx}
              playing={playing}
              onToggle={toggle}
              onSelect={select}
            />
          </div>
        </Card>

        {/* Детали */}
        <div className="order-first grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl:order-none @4xl:sticky @4xl:top-2 @4xl:grid-cols-1">
          <NodeDetails node={selected} path={path} onSelect={select} />
        </div>
      </div>
    </div>
  )
}

interface TreeProps {
  node: OrgNode
  depth: number
  expanded: Set<string>
  selectedId: string
  pathIds: Set<string>
  activeIdx: number | null
  playing: boolean
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

function TreeNode({ node, depth, expanded, selectedId, pathIds, activeIdx, playing, onToggle, onSelect }: TreeProps) {
  const hasChildren = node.children.length > 0
  const isOpen = expanded.has(node.id)
  const isSelected = selectedId === node.id
  const onPath = pathIds.has(node.id)
  const lvl = levelById(node.level)
  const simOn = activeIdx !== null
  const reached = simOn && levelIndex(node.level) <= activeIdx!
  const dimmed = simOn && !reached
  const pulsing = playing && simOn && levelIndex(node.level) === activeIdx
  const isTeam = node.kind === 'team'
  const isPlaceholder = node.kind === 'root' && !node.name

  return (
    <div>
      <motion.div
        animate={pulsing ? { scale: [1, 1.015, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          'group flex items-start gap-1 rounded-xl px-1 py-1.5 transition-all @xl:gap-2 @xl:px-2',
          isSelected ? 'bg-tint-sun/70 ring-1 ring-brand-yellow' : onPath ? 'bg-gray-50' : 'hover:bg-gray-50',
          dimmed && 'opacity-35',
          reached && 'bg-tint-mint/40',
        )}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggle(node.id)}
          disabled={!hasChildren}
          aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
          className={clsx('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md', hasChildren ? 'text-ink-soft hover:bg-gray-200' : 'text-transparent')}
        >
          <ChevronRight size={16} className={clsx('transition-transform', isOpen && 'rotate-90')} />
        </button>

        <button type="button" onClick={() => !isPlaceholder && onSelect(node.id)} className="flex min-w-0 flex-1 flex-wrap items-start gap-x-2.5 gap-y-1 text-left">
          <LevelPill level={node.level} muted={dimmed} className="mt-0.5" />
          <div className="min-w-[9rem] flex-1">
            <div className={clsx('text-[14px] leading-snug', isTeam ? 'text-ink-soft' : 'font-medium text-ink', isPlaceholder && 'italic text-ink-muted')}>
              {isTeam && <Users size={13} className="mr-1.5 inline -translate-y-px text-ink-muted" />}
              {node.title}
            </div>
            {(node.name || node.note) && (
              <div className="mt-0.5 text-xs leading-snug text-ink-muted">
                {node.name ? `${node.position} · ${node.name}` : node.note}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-0.5">
            {reached && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-mint text-white" title="Информация доведена">
                <Check size={12} />
              </span>
            )}
            {node.headcount !== undefined && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-ink-soft">
                {node.headcount} чел.
              </span>
            )}
          </div>
        </button>
      </motion.div>

      {hasChildren && isOpen && (
        <div className="ml-3 border-l-2 pl-1.5 @xl:ml-[19px] @xl:pl-3" style={{ borderColor: lvl.color + '55' }}>
          {node.children.map((id) => {
            const child = orgById.get(id)
            if (!child) return null
            return (
              <TreeNode
                key={id}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                selectedId={selectedId}
                pathIds={pathIds}
                activeIdx={activeIdx}
                playing={playing}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function NodeDetails({ node, path, onSelect }: { node: OrgNode; path: OrgNode[]; onSelect: (id: string) => void }) {
  const lvl = levelById(node.level)
  const reach = useMemo(() => reachByLevel(node.id), [node.id])
  const maxPeople = Math.max(...reach.map((r) => r.people), 1)
  const total = reach.reduce((s, r) => s + r.people, 0)
  const isTeam = node.kind === 'team'

  return (
    <>
      <Card className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <LevelPill level={node.level} />
            <span className="text-xs text-ink-muted">{lvl.title}</span>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">{node.title}</h3>
          {node.name && (
            <div className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
              <UserRound size={15} className="text-ink-muted" />
              {node.position} · <span className="font-medium text-ink">{node.name}</span>
            </div>
          )}
          {node.note && <p className="mt-2 rounded-xl bg-tint-sky/60 px-3 py-2 text-xs leading-snug text-ink-soft">{node.note}</p>}
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-xs text-ink-muted">{isTeam ? 'Как информация приходит к этой группе' : 'Как информация приходит к руководителю'}</div>
          <div className="mt-1 text-sm font-medium text-ink">{lvl.entryPoint}</div>
        </div>
      </Card>

      <Card>
        <h4 className="mb-3 font-display text-sm font-semibold text-ink">Путь каскада сверху вниз</h4>
        <ol className="relative">
          {path.map((p, i) => {
            const last = i === path.length - 1
            return (
              <li key={p.id} className="relative flex gap-3 pb-3 last:pb-0">
                {!last && <span className="absolute left-[21px] top-7 h-[calc(100%-1.25rem)] w-0.5 bg-gray-200" />}
                <LevelPill level={p.level} className="relative z-10 mt-0.5" />
                <button onClick={() => onSelect(p.id)} className="min-w-0 flex-1 text-left">
                  <div className={clsx('text-[13px] leading-snug', last ? 'font-semibold text-ink' : 'text-ink-soft hover:text-ink')}>{p.title}</div>
                  {p.name && <div className="text-xs text-ink-muted">{p.name}</div>}
                </button>
              </li>
            )
          })}
        </ol>
      </Card>

      {!isTeam && (
        <Card>
          <div className="mb-3 flex items-baseline justify-between">
            <h4 className="font-display text-sm font-semibold text-ink">Охват ниже по каскаду</h4>
            <span className="text-xs text-ink-muted">{total} чел.</span>
          </div>
          <div className="space-y-2">
            {reach.map((r) => (
              <div key={r.level} className={clsx('flex items-center gap-2', r.people === 0 && 'opacity-30')}>
                <LevelPill level={r.level} />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: levelById(r.level).color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.people / maxPeople) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium tabular-nums text-ink-soft">{r.people}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-ink-muted">
            Правило: руководители, подчинённые напрямую директору дирекции, — У.03; руководители отделов, направлений и групп внутри центров — У.04; ведущие менеджеры и старшие специалисты — У.05; специалисты — У.06. Если промежуточного руководителя нет, уровень пропускается.
          </p>
        </Card>
      )}
    </>
  )
}

