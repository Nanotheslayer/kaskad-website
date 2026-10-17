import {
  BookOpen,
  Building2,
  ClipboardList,
  Image,
  ListChecks,
  Mail,
  MessagesSquare,
  Newspaper,
  PanelTop,
  Pin,
  Share2,
  Tent,
  Tv,
  UserCheck,
} from 'lucide-react'
import type { Channel, ChannelCategory, ChannelId } from '../types/channel'
import { palette } from '../theme/colors'

/** Каналы распространения — п. 6.1 Положения */
export const channels: Channel[] = [
  // Цифровые
  { id: 'petlocal_feed', name: 'Лента «Петлокал»', category: 'digital', icon: Newspaper },
  { id: 'petlocal_banner', name: 'Баннер «Петлокал»', category: 'digital', icon: PanelTop },
  { id: 'petlocal_board', name: 'Доска объявлений «Петлокал»', category: 'digital', icon: ClipboardList },
  { id: 'email', name: 'Email-рассылка', category: 'digital', icon: Mail },
  { id: 'vk', name: 'Соцсети (ВК)', category: 'digital', icon: Share2 },
  { id: 'tv', name: 'Корпоративное ТВ', category: 'digital', icon: Tv },
  { id: 'digest', name: 'Дайджесты подразделений', category: 'digital', icon: ListChecks },
  { id: 'directorate_channels', name: 'Внутренние каналы дирекций', category: 'digital', icon: Building2 },
  // Печатные
  { id: 'magazine', name: 'Журнал «Петрович, новости»', category: 'print', icon: BookOpen },
  { id: 'posters', name: 'Плакаты', category: 'print', icon: Image },
  { id: 'table_tents', name: 'Тейбл-тенты', category: 'print', icon: Tent },
  { id: 'info_boards', name: 'Информационные доски', category: 'print', icon: Pin },
  // Устные
  {
    id: 'team_meetings',
    name: 'Встречи с командой',
    category: 'oral',
    icon: MessagesSquare,
    hint: 'Встречи дирекции, еженедельные встречи, ежедневные оперативки',
  },
  { id: 'one_on_one', name: 'Индивидуальные встречи 1:1', category: 'oral', icon: UserCheck },
]

export const channelCategories: { id: ChannelCategory; name: string; color: string }[] = [
  { id: 'digital', name: 'Цифровые', color: palette.steel },
  { id: 'print', name: 'Печатные', color: palette.graphite },
  { id: 'oral', name: 'Устные', color: palette.black },
]

/**
 * Каналы, которые обеспечивают руководители, — п. 6.2. Публикацию в остальных (корпоративных)
 * каналах обеспечивает инициатор вместе с ведущим менеджером по корпоративным коммуникациям.
 */
export const managerChannels: ChannelId[] = ['team_meetings', 'one_on_one']
