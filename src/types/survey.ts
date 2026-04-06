export interface Division {
  id: string
  name: string
  shortName: string
  employeeCount: number
  color: string
}

export interface DivisionSurveyResult {
  divisionId: string
  divisionName: string
  awarenessScore: number
  responseRate: number
  lastSurveyDate: string
}
