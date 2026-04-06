import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  ClipboardList,
  Clock,
  Map,
  Layers,
  Route,
} from 'lucide-react'
import clsx from 'clsx'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Обзор' },
  { to: '/cascade', icon: GitBranch, label: 'Каскад' },
  { to: '/classify', icon: ClipboardList, label: 'Классификация' },
  { to: '/timeline', icon: Clock, label: 'Таймлайн' },
  { to: '/map', icon: Map, label: 'Карта' },
  { to: '/model', icon: Layers, label: 'Модель' },
  { to: '/algorithm', icon: Route, label: 'Алгоритм' },
]

export default function Sidebar() {
  return (
    <aside className="flex w-60 flex-col bg-brand-black text-white">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red font-bold text-white text-lg">
          К
        </div>
        <div>
          <div className="font-semibold text-sm leading-tight">КАСКАД</div>
          <div className="text-[11px] text-white/50">Портал коммуникаций</div>
        </div>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="text-xs text-white/40">Петрович</div>
        <div className="text-xs text-white/40">v0.1.0 — Прототип</div>
      </div>
    </aside>
  )
}
