import type { CascadeLevel } from './communication'

export interface OrgNode {
  id: string
  level: CascadeLevel
  title: string
  name: string
  children: string[]
  regularMeeting?: {
    name: string
    frequency: string
  }
}
