import type { Division, DivisionKind } from '../types/survey'
import { palette } from '../theme/colors'

/** Подразделения верхнего контура (п. 4 Положения). Численность — демо-данные. */
export const divisions: Division[] = [
  {
    id: 'do',
    name: 'Операционная дирекция',
    shortName: 'ДО',
    kind: 'directorate',
    employeeCount: 420,
    color: palette.orange,
  },
  {
    id: 'dk',
    name: 'Коммерческая дирекция',
    shortName: 'ДК',
    kind: 'directorate',
    employeeCount: 310,
    color: palette.blue,
  },
  {
    id: 'dm',
    name: 'Дирекция по маркетингу',
    shortName: 'ДМ',
    kind: 'directorate',
    employeeCount: 74,
    color: palette.pink,
  },
  {
    id: 'dp',
    name: 'Дирекция по персоналу',
    shortName: 'ДП',
    kind: 'directorate',
    employeeCount: 196,
    color: palette.green,
  },
  {
    id: 'dr',
    name: 'Дирекция по развитию',
    shortName: 'ДР',
    kind: 'directorate',
    employeeCount: 58,
    color: palette.violet,
  },
  {
    id: 'du',
    name: 'Дирекция по правовым вопросам',
    shortName: 'ДЮ',
    kind: 'directorate',
    employeeCount: 36,
    color: palette.slate,
  },
  {
    id: 'df',
    name: 'Финансовая дирекция',
    shortName: 'ДФ',
    kind: 'directorate',
    employeeCount: 112,
    color: palette.amber,
  },
  { id: 'dit', name: 'Дирекция по IT', shortName: 'ДИТ', kind: 'directorate', employeeCount: 167, color: palette.sky },
  { id: 'szfo', name: 'Дивизион СЗФО', shortName: 'СЗФО', kind: 'division', employeeCount: 1380, color: palette.teal },
  { id: 'cfo', name: 'Дивизион ЦФО', shortName: 'ЦФО', kind: 'division', employeeCount: 1120, color: palette.crimson },
  { id: 'ufo', name: 'Дивизион УФО', shortName: 'УФО', kind: 'division', employeeCount: 640, color: palette.orange },
  { id: 'kc', name: 'Контакт-центр', shortName: 'КЦ', kind: 'service', employeeCount: 530, color: palette.blue },
]

export const divisionKindLabels: Record<DivisionKind, string> = {
  directorate: 'Дирекция',
  division: 'Дивизион',
  service: 'Служба',
}
