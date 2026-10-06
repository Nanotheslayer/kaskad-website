import type { DivisionSurveyResult } from '../types/survey'

/** Целевые значения критериев эффективности информирования (п. 8.3 Положения) */
export const surveyTargets = {
  awareness: { target: 80, label: 'Информированность', question: '«Знаете ли вы о решении X?»', hint: '% сотрудников, знающих о решении' },
  understanding: { target: 70, label: 'Понимание', question: '«Понимаете ли, как это влияет на вашу работу?»', hint: '% понимающих суть и влияние на работу' },
  trust: { target: 100, label: 'Доверие к источнику', question: '«Доверяете ли информации от руководителя?»', hint: '% доверяющих информации от руководителя' },
} as const

export type MetricId = keyof typeof surveyTargets

/** Ежемесячный пульс-опрос на «Петлокале» (демо-данные) */
export const surveyResults: DivisionSurveyResult[] = [
  { divisionId: 'do', divisionName: 'ДО', awareness: 74, understanding: 66, trust: 91, responseRate: 72, lastSurveyDate: '2026-09-29' },
  { divisionId: 'dk', divisionName: 'ДК', awareness: 69, understanding: 61, trust: 88, responseRate: 69, lastSurveyDate: '2026-09-29' },
  { divisionId: 'dm', divisionName: 'ДМ', awareness: 88, understanding: 79, trust: 96, responseRate: 91, lastSurveyDate: '2026-09-29' },
  { divisionId: 'dp', divisionName: 'ДП', awareness: 92, understanding: 85, trust: 98, responseRate: 94, lastSurveyDate: '2026-09-29' },
  { divisionId: 'dr', divisionName: 'ДР', awareness: 84, understanding: 74, trust: 95, responseRate: 86, lastSurveyDate: '2026-09-29' },
  { divisionId: 'du', divisionName: 'ДЮ', awareness: 81, understanding: 76, trust: 97, responseRate: 89, lastSurveyDate: '2026-09-29' },
  { divisionId: 'df', divisionName: 'ДФ', awareness: 86, understanding: 77, trust: 96, responseRate: 90, lastSurveyDate: '2026-09-29' },
  { divisionId: 'dit', divisionName: 'ДИТ', awareness: 83, understanding: 72, trust: 93, responseRate: 87, lastSurveyDate: '2026-09-29' },
  { divisionId: 'szfo', divisionName: 'СЗФО', awareness: 58, understanding: 49, trust: 82, responseRate: 61, lastSurveyDate: '2026-09-29' },
  { divisionId: 'cfo', divisionName: 'ЦФО', awareness: 63, understanding: 53, trust: 84, responseRate: 64, lastSurveyDate: '2026-09-29' },
  { divisionId: 'ufo', divisionName: 'УФО', awareness: 52, understanding: 44, trust: 79, responseRate: 57, lastSurveyDate: '2026-09-29' },
  { divisionId: 'kc', divisionName: 'КЦ', awareness: 71, understanding: 64, trust: 90, responseRate: 76, lastSurveyDate: '2026-09-29' },
]
