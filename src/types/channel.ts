/** Направления каналов (п. 6.2 Положения) */
export type ChannelCategory = 'digital' | 'print' | 'oral' | 'mass' | 'management'

export type ChannelId =
  | 'petlocal_banner'
  | 'petlocal_feed'
  | 'petlocal_board'
  | 'email'
  | 'vk'
  | 'tv'
  | 'digest'
  | 'digest_hr'
  | 'magazine'
  | 'posters'
  | 'table_tents'
  | 'info_boards'
  | 'oral'
  | 'one_on_one'
  | 'conference'
  | 'live_stream'
  | 'management_meeting'
  | 'committee'
  | 'protocol'
  | 'order'
  | 'info_letter'

export interface Channel {
  id: ChannelId
  name: string
  category: ChannelCategory
  icon: string
  hint?: string
}
