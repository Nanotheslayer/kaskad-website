import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Check,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Info,
  ListTodo,
  Play,
  RotateCcw,
  UserRound,
  Users,
} from 'lucide-react'
import clsx from 'clsx'
import type { OrgNode } from '../types/organization'
import { ORG_ROOT_ID, PILOT_ID } from '../data/orgStructure'
import { LEVELS_DRAFT_NOTE, levelById, levelIndex, levels } from '../data/levels'
import { alpha } from '../theme/colors'
import { useAllCommunications, useConfirmations } from '../store/communicationsStore'
import { useNow } from '../hooks/useNow'
import { DELIVERY_DAYS } from '../utils/cascadeEngine'
import { agendaFor } from '../utils/assignments'
import { toggleInSet } from '../utils/collections'
import { expandableIds, getNode, getPath, reachByLevel, unitsInSubtree } from '../utils/orgTree'
import Card from '../components/ui/Card'
import Button, { LinkButton } from '../components/ui/Button'
import LevelPill from '../components/ui/LevelPill'

const DEFAULT_SELECTED_ID = 'kais_cfo'
/** Интервал между шагами «волны» каскада по уровням */
const WAVE_STEP_MS = 750

// Пилотная дирекция не меняется во время работы — считаем её показатели один раз
const pilot = getNode(PILOT_ID)
const pilotHeadcount = pilot.headcount ?? 0
const pilotUnits = unitsInSubtree(PILOT_ID)
/** Подразделения пилота без самой дирекции */
const pilotSubunitCount = pilotUnits.length - 1
const pilotReach = reachByLevel(PILOT_ID)
/** Узлы, раскрытые в свёрнутом виде дерева */
const defaultExpandedIds = [ORG_ROOT_ID, PILOT_ID]
/** Каскад доходит до конечного адресата — сотрудников уровня У6 (п. 4.1) */
const LAST_LEVEL_IDX = levels.length - 1

/** Состояние дерева, общее для всех узлов */
interface TreeState {
  expanded: Set<string>
  selectedId: string
  pathIds: Set<string>
  /** Индекс уровня, до которого «дошла» волна каскада; null — симуляция выключена */
  activeLevelIdx: number | null
  playing: boolean
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

export default function CascadeStructurePage() {
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID)
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([...defaultExpandedIds, ...getPath(DEFAULT_SELECTED_ID).map((n) => n.id)]),
  )
  /**
   * Уровень, до которого дошла «волна» каскада: null — волну не запускали,
   * -1 — старт, затем по одному уровню вниз до У6
   */
  const [wave, setWave] = useState<number | null>(null)
  const playing = wave !== null && wave < LAST_LEVEL_IDX

  // Пока волна не дошла до У6, раз в WAVE_STEP_MS спускаемся на уровень ниже
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setWave((w) => (w ?? -1) + 1), WAVE_STEP_MS)
    return () => window.clearTimeout(timer)
  }, [playing, wave])

  const startWave = () => {
    // Раскрываем всё дерево, чтобы волна была видна
    setExpanded(new Set(expandableIds))
    setWave(-1)
  }

  const resetWave = () => setWave(null)

  const select = (id: string) => {
    setSelectedId(id)
    setExpanded((prev) => new Set([...prev, ...getPath(id).map((n) => n.id)]))
  }

  const path = useMemo(() => getPath(selectedId), [selectedId])
  const tree: TreeState = {
    expanded,
    selectedId,
    pathIds: new Set(path.map((n) => n.id)),
    activeLevelIdx: wave,
    playing,
    onToggle: (id) => setExpanded((prev) => toggleInSet(prev, id)),
    onSelect: select,
  }

  return (
    <div className="space-y-5">
      {/* Пилотный баннер + уровни */}
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-brand-yellow-light via-white to-tint-mint/60 p-4 shadow-card @xl:p-5">
        <div className="max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold tracking-wide text-brand-dark uppercase">
            Пилот
          </div>
          <h2 className="font-display text-xl font-semibold text-ink">{pilot.title}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {pilotHeadcount} сотрудников, {pilotSubunitCount} подразделений и руководителей. Названия подразделений — по
            структуре в «Петлокале»; ФИО руководителей и численность условные.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 @2xl:grid-cols-3 @6xl:grid-cols-6">
          {levels.map((l, i) => (
            <div key={l.id} className="rounded-2xl bg-white/80 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <LevelPill level={l.id} />
                {pilotReach[i].people > 0 && (
                  <span className="text-xs font-medium text-ink-soft tabular-nums">{pilotReach[i].people} чел.</span>
                )}
              </div>
              <div className="mt-2 text-[13px] leading-tight font-medium text-ink">{l.title}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-muted">{LEVELS_DRAFT_NOTE}.</p>
      </div>

      {/* Как идёт каскад */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1 basis-80">
            <h2 className="font-display text-base font-semibold text-ink">Как идёт каскад</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Руководитель каждого уровня получает информацию раньше своей команды и доводит её на ближайшей встрече, но
              не позднее {DELIVERY_DAYS} дней после получения задания. Конечный адресат — сотрудники уровня У6 (п. 3.2,
              4.1, 7.6).
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startWave} disabled={playing}>
              <Play size={16} /> Проиграть каскад
            </Button>
            {wave !== null && (
              <Button variant="secondary" onClick={resetWave}>
                <RotateCcw size={16} /> Сбросить
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 @xl:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="text-xs text-ink-muted">Охват в Дирекции по персоналу</div>
            <div className="mt-1 text-lg font-bold text-ink">
              {pilotHeadcount} <span className="text-sm font-normal text-ink-soft">чел.</span>
            </div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="text-xs text-ink-muted">Руководителей, которые доводят</div>
            <div className="mt-1 text-lg font-bold text-ink">{pilotUnits.length}</div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 text-xs leading-snug text-ink-soft">
            <Info size={14} className="mb-1 text-ink-muted" />
            Цифровые и печатные каналы дополняют доведение информации руководителем, но не заменяют его (п. 4.2)
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[minmax(0,1fr)_320px] @6xl:grid-cols-[minmax(0,1fr)_360px] @7xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card padding={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
            <div className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <Building2 size={18} className="text-ink-muted" />
              Структура компании
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setExpanded(new Set(expandableIds))}>
                <ChevronsUpDown size={14} /> Раскрыть всё
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setExpanded(new Set(defaultExpandedIds))}>
                <ChevronsDownUp size={14} /> Свернуть
              </Button>
            </div>
          </div>
          <div className="p-2 @xl:p-4">
            <TreeNode node={getNode(ORG_ROOT_ID)} tree={tree} />
          </div>
        </Card>

        <div className="order-first grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl:sticky @4xl:top-2 @4xl:order-0 @4xl:grid-cols-1">
          <NodeDetails node={getNode(selectedId)} path={path} onSelect={select} />
        </div>
      </div>
    </div>
  )
}

function TreeNode({ node, tree }: { node: OrgNode; tree: TreeState }) {
  const { expanded, selectedId, pathIds, activeLevelIdx, playing, onToggle, onSelect } = tree
  const hasChildren = node.children.length > 0
  const isOpen = expanded.has(node.id)
  const isSelected = selectedId === node.id
  const nodeLevelIdx = levelIndex(node.level)
  const reached = activeLevelIdx !== null && nodeLevelIdx <= activeLevelIdx
  const dimmed = activeLevelIdx !== null && !reached
  const pulsing = playing && nodeLevelIdx === activeLevelIdx
  const isTeam = node.kind === 'team'
  // «Другие дирекции» — заглушка без руководителя, выбирать нечего
  const isPlaceholder = node.kind === 'root' && !node.name

  return (
    <div>
      <motion.div
        animate={pulsing ? { scale: [1, 1.015, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          'group flex items-start gap-1 rounded-xl px-1 py-1.5 transition-all @xl:gap-2 @xl:px-2',
          isSelected
            ? 'bg-tint-sun/70 ring-1 ring-brand-yellow'
            : pathIds.has(node.id)
              ? 'bg-gray-50'
              : 'hover:bg-gray-50',
          dimmed && 'opacity-35',
          reached && 'bg-tint-mint/40',
        )}
      >
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          disabled={!hasChildren}
          aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
          aria-expanded={hasChildren ? isOpen : undefined}
          className={clsx(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
            hasChildren ? 'text-ink-soft hover:bg-gray-200' : 'text-transparent',
          )}
        >
          <ChevronRight size={16} className={clsx('transition-transform', isOpen && 'rotate-90')} />
        </button>

        <button
          type="button"
          onClick={() => !isPlaceholder && onSelect(node.id)}
          className="flex min-w-0 flex-1 flex-wrap items-start gap-x-2.5 gap-y-1 text-left"
        >
          <LevelPill level={node.level} muted={dimmed} className="mt-0.5" />
          <div className="min-w-36 flex-1">
            <div
              className={clsx(
                'text-[14px] leading-snug',
                isTeam ? 'text-ink-soft' : 'font-medium text-ink',
                isPlaceholder && 'text-ink-muted italic',
              )}
            >
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
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-mint text-white"
                title="Информация доведена"
              >
                <Check size={12} />
              </span>
            )}
            {node.headcount !== undefined && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-ink-soft tabular-nums">
                {node.headcount} чел.
              </span>
            )}
          </div>
        </button>
      </motion.div>

      {hasChildren && isOpen && (
        <div
          className="ml-3 border-l-2 pl-1.5 @xl:ml-[19px] @xl:pl-3"
          style={{ borderColor: alpha(levelById(node.level).color, 0.33) }}
        >
          {node.children.map((id) => (
            <TreeNode key={id} node={getNode(id)} tree={tree} />
          ))}
        </div>
      )}
    </div>
  )
}

interface NodeDetailsProps {
  node: OrgNode
  path: OrgNode[]
  onSelect: (id: string) => void
}

function NodeDetails({ node, path, onSelect }: NodeDetailsProps) {
  const level = levelById(node.level)
  const reach = useMemo(() => reachByLevel(node.id), [node.id])
  const maxPeople = Math.max(1, ...reach.map((r) => r.people))
  const total = reach.reduce((sum, r) => sum + r.people, 0)
  const isTeam = node.kind === 'team'

  return (
    <>
      <Card className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <LevelPill level={node.level} />
            <span className="text-xs text-ink-muted">{level.title}</span>
          </div>
          <h3 className="mt-2 font-display text-lg leading-snug font-semibold text-ink">{node.title}</h3>
          {node.name && (
            <div className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
              <UserRound size={15} className="text-ink-muted" />
              {node.position} · <span className="font-medium text-ink">{node.name}</span>
            </div>
          )}
          {node.note && (
            <p className="mt-2 rounded-xl bg-tint-sky/60 px-3 py-2 text-xs leading-snug text-ink-soft">{node.note}</p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-xs text-ink-muted">Уровень {level.short} по п. 4.1</div>
          <div className="mt-1 text-sm text-ink">{level.who}</div>
        </div>

        {node.kind === 'unit' && node.children.length > 0 && <AgendaLink nodeId={node.id} />}
      </Card>

      <Card>
        <h4 className="mb-3 font-display text-sm font-semibold text-ink">Путь каскада сверху вниз</h4>
        <ol className="relative">
          {path.map((p, i) => {
            const last = i === path.length - 1
            return (
              <li key={p.id} className="relative flex gap-3 pb-3 last:pb-0">
                {!last && <span className="absolute top-7 left-[21px] h-[calc(100%-1.25rem)] w-0.5 bg-gray-200" />}
                <LevelPill level={p.level} className="relative z-10 mt-0.5" />
                <button type="button" onClick={() => onSelect(p.id)} className="min-w-0 flex-1 text-left">
                  <div
                    className={clsx(
                      'text-[13px] leading-snug',
                      last ? 'font-semibold text-ink' : 'text-ink-soft hover:text-ink',
                    )}
                  >
                    {p.title}
                  </div>
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
                <span className="w-8 text-right text-xs font-medium text-ink-soft tabular-nums">{r.people}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-ink-muted">
            Предварительное правило пилота: руководители, подчинённые напрямую директору дирекции, — У3; руководители
            отделов, направлений и групп внутри центров — У4; ведущие менеджеры и старшие специалисты — У5; специалисты
            — У6. Если промежуточного руководителя нет, уровень пропускается.
          </p>
        </Card>
      )}
    </>
  )
}

/** Сколько заданий о каскадировании ждут руководителя, и ссылка на его повестку */
function AgendaLink({ nodeId }: { nodeId: string }) {
  const communications = useAllCommunications()
  const confirmations = useConfirmations()
  const now = useNow()
  const pending = useMemo(
    () => agendaFor(nodeId, communications, confirmations, now).pending.length,
    [nodeId, communications, confirmations, now],
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-tint-peach/60 p-3">
      <div>
        <div className="text-xs text-ink-muted">В повестке руководителя</div>
        <div className="text-sm font-medium text-ink">к доведению: {pending}</div>
      </div>
      <LinkButton to={`/agenda?person=${nodeId}`} variant="secondary" size="sm">
        <ListTodo size={14} /> Повестка
      </LinkButton>
    </div>
  )
}
