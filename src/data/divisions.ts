import type { Division } from '../types/survey'

export const divisions: Division[] = [
  { id: 'it', name: 'Информационные технологии', shortName: 'ИТ', employeeCount: 85, color: '#3b82f6' },
  { id: 'hr', name: 'Управление персоналом', shortName: 'HR', employeeCount: 32, color: '#ec4899' },
  { id: 'sales', name: 'Коммерческая дирекция', shortName: 'Продажи', employeeCount: 210, color: '#f97316' },
  { id: 'marketing', name: 'Маркетинг', shortName: 'Маркетинг', employeeCount: 28, color: '#8b5cf6' },
  { id: 'production', name: 'Производство', shortName: 'Производство', employeeCount: 340, color: '#22c55e' },
  { id: 'logistics', name: 'Логистика', shortName: 'Логистика', employeeCount: 180, color: '#14b8a6' },
  { id: 'finance', name: 'Финансы', shortName: 'Финансы', employeeCount: 45, color: '#eab308' },
  { id: 'legal', name: 'Юридический', shortName: 'Юр.', employeeCount: 15, color: '#6b7280' },
  { id: 'admin', name: 'Администрация', shortName: 'Админ.', employeeCount: 25, color: '#ef4444' },
]
