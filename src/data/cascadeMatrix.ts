import type { CommunicationTypeId, CascadeLevel } from '../types/communication'
import type { ChannelId } from '../types/channel'

/**
 * Глубина каскадирования по типу коммуникации (п. 5.8–5.9 Положения).
 * Значение — индекс нижнего уровня по шкале У.01–У.06 (0…5).
 */
export const baseDepthByType: Record<CommunicationTypeId, CascadeLevel> = {
  strategic: 'У06',
  explanatory: 'У04',
  directive: 'У04',
  project: 'У06',
  reporting: 'У04',
  crisis: 'У06',
  values: 'У06',
  hr_social: 'У06',
  product: 'У06',
  documentation: 'У03',
}

/** Типы, для которых допускается углубление до У.06 «при необходимости» (п. 5.8–5.9) */
export const extendableTypes: CommunicationTypeId[] = ['explanatory', 'directive', 'reporting']

/** Минимально обязательный набор каналов по типам — таблица п. 6.3 Положения */
export const requiredChannelsByType: Record<CommunicationTypeId, ChannelId[]> = {
  strategic: ['petlocal_feed', 'email', 'tv', 'magazine', 'posters', 'digest', 'oral'],
  explanatory: ['petlocal_feed', 'email', 'digest', 'oral'],
  directive: ['petlocal_board', 'email', 'digest', 'oral'],
  project: ['vk', 'petlocal_banner', 'petlocal_feed', 'email', 'tv', 'magazine', 'posters', 'digest', 'oral'],
  reporting: ['vk', 'petlocal_feed', 'email', 'tv', 'magazine', 'digest', 'oral'],
  crisis: ['oral', 'email', 'tv', 'posters'],
  values: ['vk', 'petlocal_feed', 'tv', 'magazine', 'digest'],
  hr_social: ['vk', 'petlocal_banner', 'petlocal_feed', 'email', 'tv', 'magazine', 'posters', 'digest_hr'],
  product: ['petlocal_feed', 'tv', 'digest', 'oral'],
  documentation: ['email'],
}

/** Каналы «широкого» охвата — исключаются при метке «Ограниченный доступ» */
export const publicChannels: ChannelId[] = [
  'vk',
  'tv',
  'magazine',
  'posters',
  'table_tents',
  'petlocal_banner',
  'petlocal_feed',
  'petlocal_board',
  'info_boards',
  'conference',
  'live_stream',
]
