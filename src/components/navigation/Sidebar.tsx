import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bookmark, ChevronUp, Pencil, X } from 'lucide-react'
import clsx from 'clsx'
import Logo from './Logo'
import { routeMeta, tintClasses } from '../../routes'

const quickLinks = [
  { to: '/classify', label: 'Новый инфоповод' },
  { to: '/timeline', label: 'Таймлайн коммуникаций' },
  { to: '/cascade', label: 'Каскад Дирекции по персоналу' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  const [quickOpen, setQuickOpen] = useState(true)

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col bg-white transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 xl:w-72',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 px-5 pb-4 pt-5">
          <Logo />
          <button className="rounded-lg p-1.5 text-ink-muted hover:bg-gray-100 lg:hidden" onClick={onClose} aria-label="Закрыть меню">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Быстрый доступ */}
          <div>
            <div className="flex items-center gap-2.5 px-2 py-2 xl:gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-ink-soft">
                <Bookmark size={18} />
              </div>
              <span className="flex-1 whitespace-nowrap text-sm font-medium leading-tight text-ink xl:text-[15px]">Быстрый доступ</span>
              <Pencil size={15} className="text-ink-muted" />
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className="rounded p-1 text-ink-soft hover:bg-gray-100"
                aria-label={quickOpen ? 'Свернуть' : 'Развернуть'}
              >
                <ChevronUp size={18} className={clsx('transition-transform', !quickOpen && 'rotate-180')} />
              </button>
            </div>
            {quickOpen && (
              <div className="mb-1 ml-12 space-y-0.5 xl:ml-14">
                {quickLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={onClose}
                    className="block rounded-lg px-2 py-2 text-[13px] leading-tight text-ink hover:bg-gray-100 xl:text-[14px]"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="mx-2 my-3 border-t border-gray-200" />

          <nav className="space-y-0.5">
            {routeMeta.map(({ path, icon: Icon, label, tint }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-2.5 rounded-xl px-2 py-2.5 text-sm font-medium transition-colors xl:gap-3 xl:text-[15px]',
                    isActive ? 'bg-gray-100 text-ink' : 'text-ink hover:bg-gray-50',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={clsx(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all',
                        tintClasses[tint].bg,
                        tintClasses[tint].fg,
                        isActive && 'shadow-sm ring-2 ring-white',
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="leading-tight">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <div className="text-xs text-ink-muted">Положение о каскадировании</div>
          <div className="text-xs text-ink-muted">v0.2 · прототип</div>
        </div>
      </aside>
    </>
  )
}
