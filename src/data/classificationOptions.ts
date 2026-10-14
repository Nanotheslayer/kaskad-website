import type {
  Confidentiality,
  FoundationId,
  ImpactScale,
  ImpactType,
  StrategyId,
  Tone,
  Urgency,
  ValueId,
} from '../types/communication'
import { palette } from '../theme/colors'

export interface Option<T extends string> {
  value: T
  label: string
  description: string
  color?: string
}

export type ColoredOption<T extends string> = Option<T> & { color: string }

/** Свойства паспорта инфоповода — п. 5.3 Положения */
export const impactScaleOptions: Option<ImpactScale>[] = [
  { value: 'company', label: 'Компания', description: 'Затрагивает всю компанию' },
  { value: 'directorate', label: 'Дирекция', description: 'Затрагивает одну дирекцию или дивизион' },
  { value: 'department', label: 'Подразделение', description: 'Локальный масштаб' },
]

export const urgencyOptions: ColoredOption<Urgency>[] = [
  { value: 'crisis', label: 'Критично', description: 'Немедленное реагирование', color: palette.crimson },
  { value: 'urgent', label: 'Срочно', description: 'В ближайшие часы и дни', color: palette.orange },
  { value: 'planned', label: 'Планово', description: 'Согласно календарю каскадирования', color: palette.green },
  { value: 'background', label: 'Фоново', description: 'Без чётких сроков', color: palette.slate },
]

export const impactTypeOptions: Option<ImpactType>[] = [
  { value: 'action', label: 'Действие', description: 'От сотрудников требуется конкретное действие' },
  { value: 'informing', label: 'Информирование', description: 'Достаточно, чтобы люди знали' },
  { value: 'values', label: 'Ценностная мотивация', description: 'Вовлекаем и признаём' },
]

export const toneOptions: Option<Tone>[] = [
  { value: 'official', label: 'Официальная', description: 'Приказы, регламенты, решения' },
  { value: 'informal', label: 'Неформальная', description: 'Живо и по-человечески' },
  { value: 'expert', label: 'Экспертная', description: 'С цифрами и разбором' },
  { value: 'emotional', label: 'Эмоциональная', description: 'Радость, гордость, вдохновение' },
  { value: 'restrained', label: 'Сдержанная', description: 'Спокойно, без эмоций' },
]

export const confidentialityOptions: Option<Confidentiality>[] = [
  { value: 'open', label: 'Открытая', description: 'Можно публиковать широко' },
  { value: 'internal', label: 'Для сотрудников', description: 'Только внутри компании' },
  {
    value: 'restricted',
    label: 'Ограниченный доступ',
    description: 'Только руководители и участники — публичные каналы отключаются',
  },
]

/** Приложение 2 Положения: фундамент, стратегия, ценности */
export const foundationOptions: ColoredOption<FoundationId>[] = [
  {
    value: 'people',
    label: 'Люди',
    description: 'Взаимодействие подразделений, вовлечённость, текучесть, закрепляемость, принятие ценностей',
    color: palette.pink,
  },
  {
    value: 'cjm',
    label: 'CJM',
    description: 'Путь клиента от потребности до покупки и лояльности',
    color: palette.violet,
  },
  {
    value: 'it',
    label: 'IT-технологичность',
    description: 'Надёжность IT-систем, цифровизация, автоматизация процессов',
    color: palette.blue,
  },
  {
    value: 'service',
    label: 'Сервис',
    description: 'Скорость, удовлетворённость услугами, наличие товара, удобная экосистема',
    color: palette.teal,
  },
]

export const strategyOptions: ColoredOption<StrategyId>[] = [
  {
    value: 'core',
    label: 'Основной бизнес',
    description: 'Прорыв в «Сантехнике», «Электрике», «Загородном строительстве»; доля рынка в Москве',
    color: palette.orange,
  },
  {
    value: 'geography',
    label: 'Расширение географии',
    description: 'Новые СТЦ в городах-миллионниках',
    color: palette.sky,
  },
  {
    value: 'assortment',
    label: 'Расширение ассортимента',
    description: 'Маркетплейс: товары вне складской матрицы, новые категории',
    color: palette.green,
  },
  {
    value: 'renovation',
    label: 'Стройка и ремонт «от и до»',
    description: '«Петрович» = ремонт: все сервисы и товары-партнёры',
    color: palette.amber,
  },
]

export const valueOptions: ColoredOption<ValueId>[] = [
  {
    value: 'people_first',
    label: 'Человек в приоритете',
    description: 'Будь другом! Помогай и поддерживай. Слушай и откликайся',
    color: palette.pink,
  },
  {
    value: 'development',
    label: 'Развитие',
    description: 'Будь на шаг впереди! Ищи возможности для улучшений',
    color: palette.green,
  },
  {
    value: 'overcoming',
    label: 'Преодоление',
    description: 'Будь готов! Проявляй волю. Действуй осознанно',
    color: palette.orange,
  },
]

function indexByValue<T extends string, O extends Option<T>>(options: readonly O[]): Record<T, O> {
  return Object.fromEntries(options.map((o) => [o.value, o])) as Record<T, O>
}

function labelsOf<T extends string>(options: readonly Option<T>[]): Record<T, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<T, string>
}

export const scaleLabels = labelsOf(impactScaleOptions)
export const impactTypeLabels = labelsOf(impactTypeOptions)
export const toneLabels = labelsOf(toneOptions)
export const confidentialityLabels = labelsOf(confidentialityOptions)

export const urgencyById = indexByValue(urgencyOptions)
export const foundationById = indexByValue(foundationOptions)
export const strategyById = indexByValue(strategyOptions)
export const valueById = indexByValue(valueOptions)
