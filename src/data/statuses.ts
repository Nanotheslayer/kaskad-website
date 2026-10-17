import type { CommunicationStatus } from '../types/communication'
import { palette } from '../theme/colors'

export const statusLabels: Record<CommunicationStatus, string> = {
  planned: 'Запланирована',
  active: 'Идёт каскад',
  completed: 'Доведено',
}

export const statusColors: Record<CommunicationStatus, string> = {
  planned: palette.steel,
  active: palette.ochre,
  completed: palette.green,
}
