import type { DivisionSurveyResult } from '../types/survey'

/**
 * Вопросы опроса вовлечённости, по которым оценивается эффективность каскадирования, — п. 8.2 Положения.
 * Значение показателя — доля положительных ответов, %.
 */
export const surveyQuestions = {
  goals: {
    factor: 'Содержание работы',
    label: 'Понимание целей',
    question: '«Я понимаю, как мои рабочие цели соотносятся с целями моего подразделения и Компании в целом»',
  },
  directorsInform: {
    factor: 'Директора (первые лица)',
    label: 'Информирование',
    question:
      '«Директора Компании доносят до сотрудников информацию о текущем состоянии компании и направлении её развития в будущем»',
  },
  directorsOpen: {
    factor: 'Директора (первые лица)',
    label: 'Открытость',
    question: '«Директора Компании открыто и честно ведут себя в общении»',
  },
} as const

export type MetricId = keyof typeof surveyQuestions

/** Последняя волна опроса вовлечённости (демо-данные) */
export const surveyResults: DivisionSurveyResult[] = [
  {
    divisionId: 'do',
    divisionName: 'ДО',
    goals: 76,
    directorsInform: 72,
    directorsOpen: 76,
    responseRate: 72,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'dk',
    divisionName: 'ДК',
    goals: 71,
    directorsInform: 67,
    directorsOpen: 73,
    responseRate: 69,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'dm',
    divisionName: 'ДМ',
    goals: 89,
    directorsInform: 86,
    directorsOpen: 81,
    responseRate: 91,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'dp',
    divisionName: 'ДП',
    goals: 95,
    directorsInform: 90,
    directorsOpen: 83,
    responseRate: 94,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'dr',
    divisionName: 'ДР',
    goals: 84,
    directorsInform: 82,
    directorsOpen: 80,
    responseRate: 86,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'du',
    divisionName: 'ДЮ',
    goals: 86,
    directorsInform: 79,
    directorsOpen: 82,
    responseRate: 89,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'df',
    divisionName: 'ДФ',
    goals: 87,
    directorsInform: 84,
    directorsOpen: 81,
    responseRate: 90,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'dit',
    divisionName: 'ДИТ',
    goals: 82,
    directorsInform: 81,
    directorsOpen: 78,
    responseRate: 87,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'szfo',
    divisionName: 'СЗФО',
    goals: 59,
    directorsInform: 56,
    directorsOpen: 67,
    responseRate: 61,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'cfo',
    divisionName: 'ЦФО',
    goals: 63,
    directorsInform: 61,
    directorsOpen: 69,
    responseRate: 64,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'ufo',
    divisionName: 'УФО',
    goals: 54,
    directorsInform: 50,
    directorsOpen: 64,
    responseRate: 57,
    lastSurveyDate: '2026-04-24',
  },
  {
    divisionId: 'kc',
    divisionName: 'КЦ',
    goals: 74,
    directorsInform: 69,
    directorsOpen: 75,
    responseRate: 76,
    lastSurveyDate: '2026-04-24',
  },
]

export const surveyByDivision = new Map(surveyResults.map((r) => [r.divisionId, r]))

/** Среднее по подразделениям — ориентир вместо целевых значений: в п. 8 Положения целей нет */
export const surveyAverage = (metric: MetricId) =>
  Math.round(surveyResults.reduce((sum, r) => sum + r[metric], 0) / surveyResults.length)
