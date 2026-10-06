export type DivisionKind = 'directorate' | 'division' | 'service'

export interface Division {
  id: string
  name: string
  shortName: string
  kind: DivisionKind
  employeeCount: number
  color: string
}

/** Критерии оценки эффективности информирования (п. 8.3 Положения) */
export interface DivisionSurveyResult {
  divisionId: string
  divisionName: string
  /** Информированность: % знающих о решении (цель ≥ 80) */
  awareness: number
  /** Понимание: % понимающих суть и влияние на работу (цель ≥ 70) */
  understanding: number
  /** Доверие к источнику: % доверяющих информации от руководителя (цель 100) */
  trust: number
  responseRate: number
  lastSurveyDate: string
}
