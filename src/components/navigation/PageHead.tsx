import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { routeMeta, tintClasses } from '../../routes'

export default function PageHead() {
  const { pathname } = useLocation()
  const meta = routeMeta.find((r) => r.path === pathname) ?? routeMeta[0]
  const Icon = meta.icon
  const tint = tintClasses[meta.tint]

  return (
    <div className="mb-6">
      <nav aria-label="Хлебные крошки" className="mb-3 flex items-center gap-1.5 text-[13px] text-ink-muted">
        <Link to="/" className="text-ink hover:underline">Главная страница</Link>
        <ChevronRight size={13} />
        <span className={pathname === '/' ? 'text-ink-muted' : 'text-ink'}>Каскадирование</span>
        {pathname !== '/' && (
          <>
            <ChevronRight size={13} />
            <span className="text-ink-muted">{meta.label}</span>
          </>
        )}
      </nav>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tint.bg} ${tint.fg}`}>
          <Icon size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink">{meta.title}</h1>
          <p className="mt-0.5 max-w-3xl text-sm text-ink-soft">{meta.subtitle}</p>
        </div>
      </div>
    </div>
  )
}
