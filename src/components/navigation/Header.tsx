import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'
import Logo from './Logo'

interface Props {
  onMenu: () => void
}

export default function Header({ onMenu }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/timeline?q=${encodeURIComponent(q)}` : '/timeline')
  }

  return (
    <header className="shrink-0 px-4 lg:px-8">
      <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center gap-3">
        <button className="rounded-xl bg-white p-2.5 text-ink-soft shadow-card lg:hidden" onClick={onMenu} aria-label="Открыть меню">
          <Menu size={20} />
        </button>

        {/* Когда сайдбар скрыт, логотип переезжает в шапку */}
        <Link to="/" className="shrink-0 lg:hidden" aria-label="На главную">
          <Logo compact />
        </Link>

        <form onSubmit={submit} className="relative hidden w-full max-w-sm sm:block">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по коммуникациям"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-red focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link to="/timeline" className="rounded-xl bg-white p-2.5 text-ink-soft shadow-card sm:hidden" aria-label="Поиск по коммуникациям">
            <Search size={18} />
          </Link>
          <button className="relative rounded-xl bg-white p-2.5 text-ink-soft shadow-card transition-colors hover:text-ink" aria-label="Уведомления">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-yellow to-brand-red text-sm font-bold text-white shadow-card">
              ИВ
            </div>
            <div className="hidden leading-tight md:block">
              <div className="text-sm font-medium text-ink">Иванов В.А.</div>
              <div className="text-xs text-ink-muted">Руководитель</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
