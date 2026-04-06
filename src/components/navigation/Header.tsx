import { useLocation } from 'react-router-dom'
import { Bell, User } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/': 'Обзор',
  '/cascade': 'Каскадная структура',
  '/classify': 'Классификация коммуникации',
  '/timeline': 'Таймлайн коммуникаций',
  '/map': 'Карта компании',
  '/model': 'Модель каскадирования',
  '/algorithm': 'Алгоритм руководителя',
}

export default function Header() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'Каскад'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-brand-dark">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-red" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow text-brand-dark font-semibold text-sm">
            ИВ
          </div>
          <span className="text-sm font-medium text-brand-dark">Иванов В.А.</span>
        </div>
      </div>
    </header>
  )
}
