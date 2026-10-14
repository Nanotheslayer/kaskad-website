import {
  BookHeart,
  BookOpen,
  Building2,
  ClipboardList,
  FileCheck,
  FileText,
  Image,
  ListChecks,
  Mail,
  MailOpen,
  MessagesSquare,
  Mic,
  Newspaper,
  PanelTop,
  Pin,
  Presentation,
  Radio,
  Share2,
  Tent,
  Tv,
  UserCheck,
} from 'lucide-react'
import type { Channel, ChannelCategory } from '../types/channel'
import { palette } from '../theme/colors'

/** Каналы распространения — п. 6.2 Положения */
export const channels: Channel[] = [
  // Цифровые
  { id: 'petlocal_banner', name: 'Баннер «Петлокал»', category: 'digital', icon: PanelTop },
  { id: 'petlocal_feed', name: 'Лента «Петлокал»', category: 'digital', icon: Newspaper },
  { id: 'petlocal_board', name: 'Доска «Петлокал»', category: 'digital', icon: ClipboardList },
  { id: 'email', name: 'Email-рассылка', category: 'digital', icon: Mail },
  { id: 'vk', name: 'Соцсети (ВК)', category: 'digital', icon: Share2 },
  { id: 'tv', name: 'Корпоративное ТВ', category: 'digital', icon: Tv },
  { id: 'digest', name: 'Дайджесты подразделений', category: 'digital', icon: ListChecks },
  { id: 'digest_hr', name: 'Дайджест HR', category: 'digital', icon: BookHeart },
  // Печатные и вещественные
  { id: 'magazine', name: 'Корпоративный журнал', category: 'print', icon: BookOpen },
  { id: 'posters', name: 'Плакаты', category: 'print', icon: Image },
  { id: 'table_tents', name: 'Тейбл-тенты', category: 'print', icon: Tent },
  { id: 'info_boards', name: 'Информационные доски', category: 'print', icon: Pin },
  // Устные и личные
  {
    id: 'oral',
    name: 'Устное доведение',
    category: 'oral',
    icon: MessagesSquare,
    hint: 'Оперативки, еженедельные встречи, встречи дирекции',
  },
  { id: 'one_on_one', name: 'Индивидуальные 1:1', category: 'oral', icon: UserCheck },
  // Массовые
  { id: 'conference', name: 'Итоговая конференция', category: 'mass', icon: Mic },
  { id: 'live_stream', name: 'Прямой эфир с руководством', category: 'mass', icon: Radio },
  // Управленческие
  { id: 'management_meeting', name: 'Совещания руководителей', category: 'management', icon: Presentation },
  { id: 'committee', name: 'Заседания комитетов', category: 'management', icon: Building2 },
  { id: 'protocol', name: 'Протоколы', category: 'management', icon: FileText },
  { id: 'order', name: 'Приказы', category: 'management', icon: FileCheck },
  { id: 'info_letter', name: 'Информационные письма', category: 'management', icon: MailOpen },
]

export const channelCategories: { id: ChannelCategory; name: string; color: string }[] = [
  { id: 'digital', name: 'Цифровые', color: palette.blue },
  { id: 'print', name: 'Печатные и вещественные', color: palette.amber },
  { id: 'oral', name: 'Устные и личные', color: palette.teal },
  { id: 'mass', name: 'Массовые', color: palette.pink },
  { id: 'management', name: 'Управленческие', color: palette.violet },
]
