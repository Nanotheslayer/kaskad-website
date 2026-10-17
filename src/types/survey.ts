export type DivisionKind = 'directorate' | 'division' | 'service'

export interface Division {
  id: string
  name: string
  shortName: string
  kind: DivisionKind
  employeeCount: number
  color: string
}

/** Результаты опроса вовлечённости по вопросам п. 8.2 Положения: доля положительных ответов, % */
export interface DivisionSurveyResult {
  divisionId: string
  divisionName: string
  /** «Содержание работы»: понимаю, как мои цели соотносятся с целями подразделения и Компании */
  goals: number
  /** «Директора»: доносят информацию о текущем состоянии Компании и направлении развития */
  directorsInform: number
  /** «Директора»: открыто и честно ведут себя в общении */
  directorsOpen: number
  responseRate: number
  lastSurveyDate: string
}
