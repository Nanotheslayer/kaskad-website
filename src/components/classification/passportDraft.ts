import type { Binding, CommunicationTypeId, SourceId, ThreeQuestions } from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { currentUser } from '../../data/currentUser'
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
    materials: [],
    extraChannels: [],
  }
}

/** Шаги повторяют этапы п. 3.3 Положения: формирование → выбор каналов → осмысление → доведение */
export const PASSPORT_STEPS = ['Площадка', 'Тип', 'Суть и осмысление', 'Материалы', 'Маршрут'] as const

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
      return true
    default:
      return false
  }
}
