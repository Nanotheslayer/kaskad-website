import type { CascadeLevel } from '../types/communication'
import { levelShades } from '../theme/colors'
import { indexById } from '../utils/collections'

export interface LevelInfo {
  id: CascadeLevel
  short: string
  title: string
  who: string
  color: string
}

/** Распределение должностей по уровням в Положении ещё уточняется — показываем это рядом с уровнями */
export const LEVELS_DRAFT_NOTE = 'Распределение должностей по уровням предварительное и уточняется'

/**
 * Уровни каскадирования — таблица п. 4.1 Положения. Уровень показывает очерёдность получения
 * информации; конечный адресат каскадирования — сотрудники уровня У6.
 */
export const levels: LevelInfo[] = [
  {
    id: 'У01',
    short: 'У1',
    title: 'Генеральный директор',
    who: 'Генеральный директор (ГД)',
    color: levelShades[0],
  },
  {
    id: 'У02',
    short: 'У2',
    title: 'Директора дирекций и дивизионов',
    who: 'Директора дирекций ЦО (ДО, ДК, ДМ, ДП, ДР, ДЮ, ДФ, ДИТ), директор по развитию маркетплейса и партнёрской сети, директор управления розничных продаж, директора дивизионов СЗФО, ЦФО, УФО',
    color: levelShades[1],
  },
  {
    id: 'У03',
    short: 'У3',
    title: 'Управляющие и директора служб',
    who: 'Управляющие СТЦ, управляющий сетью РЦ, директор КЦ, директор транспортной логистики, директор логистики склада',
    color: levelShades[2],
  },
  {
    id: 'У04',
    short: 'У4',
    title: 'Руководители отделов и групп',
    who: 'НСК, РКО, РОП, РОЛ, руководители',
    color: levelShades[3],
  },
  {
    id: 'У05',
    short: 'У5',
    title: 'Ведущие менеджеры, старшие специалисты',
    who: 'Ведущие менеджеры, старшие специалисты',
    color: levelShades[4],
  },
  {
    id: 'У06',
    short: 'У6',
    title: 'Специалисты',
    who: 'Специалисты, младшие специалисты, менеджеры по продажам, кладовщики, комплектовщики, партнёры-водители, операторы КЦ, специалисты ТЗ, офис',
    color: levelShades[5],
  },
]

export const LEVEL_ORDER: CascadeLevel[] = levels.map((l) => l.id)
export const levelById = indexById(levels)
export const levelIndex = (id: CascadeLevel) => LEVEL_ORDER.indexOf(id)
