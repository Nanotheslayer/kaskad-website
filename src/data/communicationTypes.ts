import type { CommunicationType } from '../types/communication'

export const communicationTypes: CommunicationType[] = [
  { id: 'strategic', name: 'Стратегические', purpose: 'Направление развития', icon: 'Target', color: '#3b82f6' },
  { id: 'change', name: 'Изменения', purpose: 'Трансформация процессов', icon: 'RefreshCw', color: '#8b5cf6' },
  { id: 'administrative', name: 'Распорядительные', purpose: 'Обязательные решения', icon: 'FileCheck', color: '#ef4444' },
  { id: 'explanatory', name: 'Разъяснительные', purpose: 'Объяснение решений', icon: 'MessageCircle', color: '#14b8a6' },
  { id: 'operational', name: 'Операционные', purpose: 'Текущая деятельность', icon: 'Settings', color: '#f97316' },
  { id: 'project', name: 'Проектные', purpose: 'Управление проектами', icon: 'Kanban', color: '#6366f1' },
  { id: 'reporting', name: 'Отчётные', purpose: 'Результаты деятельности', icon: 'BarChart3', color: '#22c55e' },
  { id: 'documentation', name: 'Документационные', purpose: 'Фиксация решений', icon: 'FileText', color: '#6b7280' },
  { id: 'evaluation', name: 'Оценочные', purpose: 'Обратная связь', icon: 'Star', color: '#eab308' },
  { id: 'social', name: 'Социальная ответственность', purpose: 'Культура', icon: 'Heart', color: '#ec4899' },
  { id: 'crm', name: 'CRM', purpose: 'Коммуникации о клиентах', icon: 'Users', color: '#06b6d4' },
]
