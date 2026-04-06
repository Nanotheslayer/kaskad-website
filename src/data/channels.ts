import type { Channel } from '../types/channel'

export const channels: Channel[] = [
  { id: 'one_on_one', name: 'Личные встречи', category: 'personal', icon: 'UserCheck' },
  { id: 'team_meeting', name: 'Оперативки', category: 'personal', icon: 'Users' },
  { id: 'management_meeting', name: 'Совещания руководителей', category: 'management', icon: 'Presentation' },
  { id: 'committee_session', name: 'Заседания комитетов', category: 'management', icon: 'Building2' },
  { id: 'portal', name: 'Корпоративный портал', category: 'digital', icon: 'Globe' },
  { id: 'email', name: 'Email рассылка', category: 'digital', icon: 'Mail' },
  { id: 'messenger', name: 'Корпоративный мессенджер', category: 'digital', icon: 'MessageSquare' },
  { id: 'conference', name: 'Конференции', category: 'public', icon: 'Mic' },
  { id: 'town_hall', name: 'Общие собрания', category: 'public', icon: 'Megaphone' },
]
