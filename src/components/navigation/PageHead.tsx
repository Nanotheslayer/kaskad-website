import { Link, useLocation } from 'react-router'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { routeMeta } from '../../routes'
import { tintClasses } from '../../theme/tints'

export default function PageHead() {
  const { pathname } = useLocation()
  const meta = routeMeta.find((r) => r.path === pathname) ?? routeMeta[0]
  const Icon = meta.icon

  return (
    <div className="mb-6">
      <nav aria-label="Хлебные крошки" className="mb-3 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted">
        <Link to="/" className="text-ink hover:underline">
          Главная страница
        </Link>
        <ChevronRight size={13} />
        <span className={pathname === '/' ? 'text-ink-muted' : 'text-ink'}>Каскадирование</span>
        {pathname !== '/' && (
          <>
            <ChevronRight size={13} />
            <span className="text-ink-muted">{meta.label}</span>
          </>
        )}
      </nav>
      <div className="flex items-start gap-3 @xl:gap-4">
        <div
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl @xl:h-12 @xl:w-12',
            tintClasses[meta.tint],
          )}
        >
          <Icon size={24} />
        </div>
        <div>
          <h1 className="font-display text-xl leading-tight font-semibold text-ink @xl:text-2xl/8">{meta.title}</h1>
          <p className="mt-0.5 max-w-3xl text-sm text-ink-soft">{meta.subtitle}</p>
        </div>
      </div>
    </div>
  )
}
