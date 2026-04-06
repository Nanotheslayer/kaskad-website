import type { Source } from '../types/communication'

export const sources: Source[] = [
  {
    id: 'board',
    name: 'Совет директоров / ГД',
    description: 'Стратегические решения',
    icon: 'Crown',
  },
  {
    id: 'monthly_meeting',
    name: 'Ежемесячная встреча руководителей',
    description: 'Управленческие решения',
    icon: 'Users',
  },
  {
    id: 'committee',
    name: 'Комитеты',
    description: 'Изменения процессов',
    icon: 'Building2',
  },
  {
    id: 'project_office',
    name: 'Проектные офисы',
    description: 'Проектные обновления',
    icon: 'Kanban',
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Кадровые изменения',
    icon: 'UserCog',
  },
  {
    id: 'marketing',
    name: 'Маркетинг / коммерция',
    description: 'Клиентские инициативы',
    icon: 'Megaphone',
  },
]
