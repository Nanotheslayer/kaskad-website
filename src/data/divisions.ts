import type { Division, DivisionKind } from '../types/survey'

/** Подразделения верхнего контура (п. 4 Положения). Численность — демо-данные. */
export const divisions: Division[] = [
  {
    id: 'do',
    name: 'Операционная дирекция',
    shortName: 'ДО',
    kind: 'directorate',
    employeeCount: 420,
  },
  {
    id: 'dk',
    name: 'Коммерческая дирекция',
    shortName: 'ДК',
    kind: 'directorate',
    employeeCount: 310,
  },
  {
    id: 'dm',
    name: 'Дирекция по маркетингу',
    shortName: 'ДМ',
    kind: 'directorate',
    employeeCount: 74,
  },
  {
    id: 'dp',
    name: 'Дирекция по персоналу',
    shortName: 'ДП',
    kind: 'directorate',
    employeeCount: 196,
  },
  {
    id: 'dr',
    name: 'Дирекция по развитию',
    shortName: 'ДР',
    kind: 'directorate',
    employeeCount: 58,
  },
  {
    id: 'du',
    name: 'Дирекция по правовым вопросам',
    shortName: 'ДЮ',
    kind: 'directorate',
    employeeCount: 36,
  },
  {
    id: 'df',
    name: 'Финансовая дирекция',
    shortName: 'ДФ',
    kind: 'directorate',
    employeeCount: 112,
  },
  { id: 'dit', name: 'Дирекция по IT', shortName: 'ДИТ', kind: 'directorate', employeeCount: 167 },
  { id: 'szfo', name: 'Дивизион СЗФО', shortName: 'СЗФО', kind: 'division', employeeCount: 1380 },
  { id: 'cfo', name: 'Дивизион ЦФО', shortName: 'ЦФО', kind: 'division', employeeCount: 1120 },
  { id: 'ufo', name: 'Дивизион УФО', shortName: 'УФО', kind: 'division', employeeCount: 640 },
  { id: 'kc', name: 'Контакт-центр', shortName: 'КЦ', kind: 'service', employeeCount: 530 },
]

export const divisionKindLabels: Record<DivisionKind, string> = {
  directorate: 'Дирекция',
  division: 'Дивизион',
  service: 'Служба',
}
