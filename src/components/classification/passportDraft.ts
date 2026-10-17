import { addDays, format } from 'date-fns'
import type {
  Binding,
  ClassificationParams,
  CommunicationTypeId,
  Confidentiality,
  SourceId,
  ThreeQuestions,
} from '../../types/communication'
import type { ChannelId } from '../../types/channel'
import { currentUser } from '../../data/currentUser'
import { emptyQuestions } from '../../data/threeQuestions'

/** Черновик паспорта инфоповода, который заполняется по шагам формы */
export interface PassportDraft {
  sourceId: SourceId | null
  initiatorName: string
  directorate: string
  typeId: CommunicationTypeId | null
  classification: Partial<ClassificationParams>
  title: string
  essence: string
  keyMessage: string
  questions: ThreeQuestions
  binding: Binding
  /** Дата доведения в формате <input type="date">: yyyy-MM-dd */
  deadline: string
  confidentiality: Confidentiality
  materials: string[]
  extraChannels: ChannelId[]
}

/** Срок доведения по умолчанию — через неделю */
const DEFAULT_DEADLINE_DAYS = 7

export function createEmptyDraft(): PassportDraft {
  return {
    sourceId: null,
    initiatorName: currentUser.name,
    directorate: currentUser.directorate,
    typeId: null,
    classification: {},
    title: '',
    essence: '',
    keyMessage: '',
    questions: emptyQuestions,
    binding: { foundation: [], strategy: [], values: [] },
    deadline: format(addDays(new Date(), DEFAULT_DEADLINE_DAYS), 'yyyy-MM-dd'),
    confidentiality: 'internal',
    materials: [],
    extraChannels: [],
  }
}

export function isClassificationComplete(c: Partial<ClassificationParams>): c is ClassificationParams {
  return Boolean(c.impactScale && c.urgency && c.impactType && c.tone)
}

export const PASSPORT_STEPS = ['Площадка', 'Тип', 'Классификация', 'Суть и осмысление', 'Сроки', 'Маршрут'] as const

/** Можно ли перейти с шага step к следующему */
export function isStepComplete(step: number, draft: PassportDraft): boolean {
  switch (step) {
    case 0:
      return draft.sourceId !== null && draft.initiatorName.trim() !== ''
    case 1:
      return draft.typeId !== null
    case 2:
      return isClassificationComplete(draft.classification)
    case 3:
      return [draft.title, draft.essence, draft.keyMessage].every((v) => v.trim() !== '')
    case 4:
      return draft.deadline !== ''
    default:
      return false
  }
}
