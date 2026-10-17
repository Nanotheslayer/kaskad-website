import type { LucideIcon } from 'lucide-react'

/** Группы каналов (п. 6.1 Положения) */
export type ChannelCategory = 'digital' | 'print' | 'oral'

export type ChannelId =
  | 'petlocal_feed'
  | 'petlocal_banner'
  | 'petlocal_board'
  | 'email'
  | 'vk'
  | 'tv'
  | 'digest'
  | 'directorate_channels'
  | 'magazine'
  | 'posters'
  | 'table_tents'
  | 'info_boards'
  | 'team_meetings'
  | 'one_on_one'

export interface Channel {
  id: ChannelId
  name: string
  category: ChannelCategory
  icon: LucideIcon
  hint?: string
}
