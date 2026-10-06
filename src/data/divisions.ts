import type { Division } from '../types/survey'

/** Подразделения верхнего контура (п. 4 Положения). Численность — демо-данные. */
export const divisions: Division[] = [
  { id: 'do', name: 'Операционная дирекция', shortName: 'ДО', kind: 'directorate', employeeCount: 420, color: '#f26b21' },
  { id: 'dk', name: 'Коммерческая дирекция', shortName: 'ДК', kind: 'directorate', employeeCount: 310, color: '#4f6bed' },
  { id: 'dm', name: 'Дирекция по маркетингу', shortName: 'ДМ', kind: 'directorate', employeeCount: 74, color: '#e255a1' },
  { id: 'dp', name: 'Дирекция по персоналу', shortName: 'ДП', kind: 'directorate', employeeCount: 196, color: '#2fa84f' },
  { id: 'dr', name: 'Дирекция по развитию', shortName: 'ДР', kind: 'directorate', employeeCount: 58, color: '#7c5cdb' },
  { id: 'du', name: 'Дирекция по правовым вопросам', shortName: 'ДЮ', kind: 'directorate', employeeCount: 36, color: '#7b8794' },
  { id: 'df', name: 'Финансовая дирекция', shortName: 'ДФ', kind: 'directorate', employeeCount: 112, color: '#f5a300' },
  { id: 'dit', name: 'Дирекция по IT', shortName: 'ДИТ', kind: 'directorate', employeeCount: 167, color: '#0ea5e9' },
  { id: 'szfo', name: 'Дивизион СЗФО', shortName: 'СЗФО', kind: 'division', employeeCount: 1380, color: '#12a6a0' },
  { id: 'cfo', name: 'Дивизион ЦФО', shortName: 'ЦФО', kind: 'division', employeeCount: 1120, color: '#d11f3a' },
  { id: 'ufo', name: 'Дивизион УФО', shortName: 'УФО', kind: 'division', employeeCount: 640, color: '#f26b21' },
  { id: 'kc', name: 'Контакт-центр', shortName: 'КЦ', kind: 'service', employeeCount: 530, color: '#4f6bed' },
]
