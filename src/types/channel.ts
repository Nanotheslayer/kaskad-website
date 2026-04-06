export type ChannelCategory = 'personal' | 'management' | 'digital' | 'public'

export type ChannelId =
  | 'one_on_one'
  | 'team_meeting'
  | 'management_meeting'
  | 'committee_session'
  | 'portal'
  | 'email'
  | 'messenger'
  | 'conference'
  | 'town_hall'

export interface Channel {
  id: ChannelId
  name: string
  category: ChannelCategory
  icon: string
}
