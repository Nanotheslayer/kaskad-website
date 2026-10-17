import type { CascadeLevel, CommunicationTypeId } from '../types/communication'
import type { ChannelId } from '../types/channel'

/**
 * Базовая глубина каскадирования по типу коммуникации (п. 5.8–5.9 Положения):
 * нижний уровень шкалы У.01–У.06, до которого доводится информация.
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

/**
 * Типы, для которых допускается углубление до У.06 «при необходимости» — по таблице п. 5.8.
 * Сводка п. 5.9 называет вместо распорядительных отчётные; таблица и матрицы каскадирования
 * дают для отчётных фиксированное «→ У.04», поэтому следуем таблице.
 */
export const extendableTypes: CommunicationTypeId[] = ['explanatory', 'directive']

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
