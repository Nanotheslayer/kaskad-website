import type { ThreeQuestions } from '../types/communication'
import { palette } from '../theme/colors'

export interface QuestionInfo {
  key: keyof ThreeQuestions
  /** На чём построен вопрос */
  basis: string
  question: string
  hint: string
  color: string
}

/** Правило трёх вопросов — п. 5.7 Положения */
export const threeQuestions: QuestionInfo[] = [
  {
    key: 'q1',
    basis: 'Фундамент',
    question: 'Что именно произошло / какое решение принято и какой приоритет компании это затрагивает?',
    hint: 'Сервис, CJM, IT или люди',
    color: palette.blue,
  },
  {
    key: 'q2',
    basis: 'Стратегия',
    question: 'К какой стратегической цели это ведёт?',
    hint: 'Основной бизнес, расширение географии, расширение ассортимента, стройка и ремонт «от и до»',
    color: palette.orange,
  },
  {
    key: 'q3',
    basis: 'Ценности',
    question: 'Что это значит для нашей команды и через какую ценность мы это проживаем?',
    hint: '«Человек в приоритете», «Развитие», «Преодоление»',
    color: palette.pink,
  },
]

export const emptyQuestions: ThreeQuestions = { q1: '', q2: '', q3: '' }
