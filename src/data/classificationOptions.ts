export interface ClassificationOption {
  value: string
  label: string
  description: string
  color?: string
}

export const impactScaleOptions: ClassificationOption[] = [
  { value: 'company', label: 'Компания', description: 'Затрагивает всю компанию' },
  { value: 'directorate', label: 'Дирекция', description: 'На уровне дирекции' },
  { value: 'department', label: 'Подразделение', description: 'Локальный масштаб' },
]

export const urgencyOptions: ClassificationOption[] = [
  { value: 'crisis', label: 'Кризис', description: 'Немедленное реагирование', color: '#dc2626' },
  { value: 'urgent', label: 'Срочно', description: 'В течение 24 часов', color: '#d97706' },
  { value: 'planned', label: 'Планово', description: 'Согласно плану', color: '#16a34a' },
]

export const impactTypeOptions: ClassificationOption[] = [
  { value: 'action', label: 'Действие', description: 'Требуется конкретное действие' },
  { value: 'understanding', label: 'Понимание', description: 'Необходимо глубокое понимание' },
  { value: 'informing', label: 'Информирование', description: 'Достаточно информировать' },
  { value: 'inspiration', label: 'Вдохновение', description: 'Мотивация и вовлечение' },
]

export const complexityOptions: ClassificationOption[] = [
  { value: 'simple', label: 'Простая', description: 'Однозначная информация' },
  { value: 'medium', label: 'Средняя', description: 'Требует контекста' },
  { value: 'complex', label: 'Сложная', description: 'Требует подготовки и адаптации' },
]

export const sensitivityOptions: ClassificationOption[] = [
  { value: 'public', label: 'Публичная', description: 'Открытая информация' },
  { value: 'internal', label: 'Рабочая', description: 'Для внутреннего пользования' },
  { value: 'restricted', label: 'Ограниченная', description: 'Только для определённого круга' },
]
