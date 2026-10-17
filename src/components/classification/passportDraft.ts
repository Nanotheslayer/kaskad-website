import type { Binding, CommunicationTypeId, SourceId, ThreeQuestions } from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { currentUser } from '../../data/currentUser'
import { ORG_ROOT_ID } from '../../data/orgStructure'
import { emptyQuestions } from '../../data/threeQuestions'

/** Черновик паспорта инфоповода, который заполняется по шагам формы */
export interface PassportDraft {
  sourceId: SourceId | null
  initiatorName: string
  directorate: string
  typeId: CommunicationTypeId | null
  title: string
  essence: string
  keyMessage: string
  questions: ThreeQuestions
  binding: Binding
  /** Узлы оргструктуры, руководители которых получат задание о каскадировании */
  audience: string[]
  materials: string[]
  extraChannels: ChannelId[]
}

export function createEmptyDraft(): PassportDraft {
  return {
    sourceId: null,
    initiatorName: currentUser.name,
    directorate: currentUser.directorate,
    typeId: null,
    title: '',
    essence: '',
    keyMessage: '',
    questions: emptyQuestions,
    binding: { foundation: [], strategy: [], values: [] },
    audience: [ORG_ROOT_ID],
    materials: [],
    extraChannels: [],
  }
}

/** Шаги повторяют этапы п. 3.3 Положения: формирование → выбор каналов → осмысление → доведение */
export const PASSPORT_STEPS = ['Площадка', 'Тип', 'Суть и осмысление', 'Адресаты', 'Маршрут'] as const

/** Можно ли перейти с шага step к следующему */
export function isStepComplete(step: number, draft: PassportDraft): boolean {
  switch (step) {
    case 0:
      return draft.sourceId !== null && draft.initiatorName.trim() !== ''
    case 1:
      return draft.typeId !== null
    case 2:
      return [draft.title, draft.essence, draft.keyMessage].every((v) => v.trim() !== '')
    case 3:
      return draft.audience.length > 0
    default:
      return false
  }
}
