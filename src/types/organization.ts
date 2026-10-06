import type { CascadeLevel } from './communication'

export type OrgNodeKind = 'root' | 'unit' | 'team'

export interface OrgNode {
  id: string
  level: CascadeLevel
  /** root — вышестоящие руководители, unit — подразделение с руководителем, team — состав команды */
  kind: OrgNodeKind
  /** Название подразделения / должности */
  title: string
  /** Должность руководителя (для unit) */
  position?: string
  /** ФИО руководителя (демо-данные) */
  name?: string
  /** Численность: для unit — всего в подразделении, для team — в группе */
  headcount?: number
  children: string[]
  note?: string
}
