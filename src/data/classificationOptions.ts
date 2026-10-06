import type { FoundationId, StrategyId, ValueId } from '../types/communication'

export interface ClassificationOption {
  value: string
  label: string
  description: string
  color?: string
}

/** Свойства паспорта инфоповода — п. 5.3 Положения */
export const impactScaleOptions: ClassificationOption[] = [
  { value: 'company', label: 'Компания', description: 'Затрагивает всю компанию' },
  { value: 'directorate', label: 'Дирекция', description: 'Затрагивает одну дирекцию или дивизион' },
  { value: 'department', label: 'Подразделение', description: 'Локальный масштаб' },
]

export const urgencyOptions: ClassificationOption[] = [
  { value: 'crisis', label: 'Критично', description: 'Немедленное реагирование', color: '#d11f3a' },
  { value: 'urgent', label: 'Срочно', description: 'В ближайшие часы и дни', color: '#f26b21' },
  { value: 'planned', label: 'Планово', description: 'Согласно календарю каскадирования', color: '#2fa84f' },
  { value: 'background', label: 'Фоново', description: 'Без чётких сроков', color: '#7b8794' },
]

export const impactTypeOptions: ClassificationOption[] = [
  { value: 'action', label: 'Действие', description: 'От сотрудников требуется конкретное действие' },
  { value: 'informing', label: 'Информирование', description: 'Достаточно, чтобы люди знали' },
  { value: 'values', label: 'Ценностная мотивация', description: 'Вовлекаем и признаём' },
]

export const toneOptions: ClassificationOption[] = [
  { value: 'official', label: 'Официальная', description: 'Приказы, регламенты, решения' },
  { value: 'informal', label: 'Неформальная', description: 'Живо и по-человечески' },
  { value: 'expert', label: 'Экспертная', description: 'С цифрами и разбором' },
  { value: 'emotional', label: 'Эмоциональная', description: 'Радость, гордость, вдохновение' },
  { value: 'restrained', label: 'Сдержанная', description: 'Спокойно, без эмоций' },
]

export const confidentialityOptions: ClassificationOption[] = [
  { value: 'open', label: 'Открытая', description: 'Можно публиковать широко' },
  { value: 'internal', label: 'Для сотрудников', description: 'Только внутри компании' },
  { value: 'restricted', label: 'Ограниченный доступ', description: 'Только руководители и участники — публичные каналы отключаются' },
]

/** Приложение 2 Положения: фундамент, стратегия, ценности */
export interface BindingOption<T extends string> {
  id: T
  label: string
  description: string
  color: string
}

export const foundationOptions: BindingOption<FoundationId>[] = [
  { id: 'people', label: 'Люди', description: 'Взаимодействие подразделений, вовлечённость, текучесть, закрепляемость, принятие ценностей', color: '#e255a1' },
  { id: 'cjm', label: 'CJM', description: 'Путь клиента от потребности до покупки и лояльности', color: '#7c5cdb' },
  { id: 'it', label: 'IT-технологичность', description: 'Надёжность IT-систем, цифровизация, автоматизация процессов', color: '#4f6bed' },
  { id: 'service', label: 'Сервис', description: 'Скорость, удовлетворённость услугами, наличие товара, удобная экосистема', color: '#12a6a0' },
]

export const strategyOptions: BindingOption<StrategyId>[] = [
  { id: 'core', label: 'Основной бизнес', description: 'Прорыв в «Сантехнике», «Электрике», «Загородном строительстве»; доля рынка в Москве', color: '#f26b21' },
  { id: 'geography', label: 'Расширение географии', description: 'Новые СТЦ в городах-миллионниках', color: '#0ea5e9' },
  { id: 'assortment', label: 'Расширение ассортимента', description: 'Маркетплейс: товары вне складской матрицы, новые категории', color: '#2fa84f' },
  { id: 'renovation', label: 'Стройка и ремонт «от и до»', description: '«Петрович» = ремонт: все сервисы и товары-партнёры', color: '#f5a300' },
]

export const valueOptions: BindingOption<ValueId>[] = [
  { id: 'people_first', label: 'Человек в приоритете', description: 'Будь другом! Помогай и поддерживай. Слушай и откликайся', color: '#e255a1' },
  { id: 'development', label: 'Развитие', description: 'Будь на шаг впереди! Ищи возможности для улучшений', color: '#2fa84f' },
  { id: 'overcoming', label: 'Преодоление', description: 'Будь готов! Проявляй волю. Действуй осознанно', color: '#f26b21' },
]

export const scaleLabels: Record<string, string> = Object.fromEntries(impactScaleOptions.map((o) => [o.value, o.label]))
export const urgencyLabels: Record<string, string> = Object.fromEntries(urgencyOptions.map((o) => [o.value, o.label]))
export const urgencyColors: Record<string, string> = Object.fromEntries(urgencyOptions.map((o) => [o.value, o.color ?? '#7b8794']))
export const impactTypeLabels: Record<string, string> = Object.fromEntries(impactTypeOptions.map((o) => [o.value, o.label]))
export const toneLabels: Record<string, string> = Object.fromEntries(toneOptions.map((o) => [o.value, o.label]))
export const confidentialityLabels: Record<string, string> = Object.fromEntries(confidentialityOptions.map((o) => [o.value, o.label]))
