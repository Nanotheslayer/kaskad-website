import logoUrl from '../../assets/petrovich-logo.png'

interface Props {
  compact?: boolean
}

/** Логотип «Петрович» и подпись портала каскадирования */
export default function Logo({ compact }: Props) {
  if (compact) {
    return <img src={logoUrl} alt="Петрович" className="h-8 w-auto" />
  }
  return (
    <div className="min-w-0">
      <img src={logoUrl} alt="Петрович" className="h-11 w-auto" />
      <div className="mt-2 flex items-center gap-1.5 pl-1">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="0" y="1" width="14" height="3" rx="1.5" fill="#ed1b24" />
          <rect x="0" y="5.5" width="10" height="3" rx="1.5" fill="#ffcb05" />
          <rect x="0" y="10" width="6" height="3" rx="1.5" fill="#2fa84f" />
        </svg>
        <span className="font-display text-sm font-semibold text-ink">Каскад</span>
        <span className="truncate text-xs text-ink-muted">· портал коммуникаций</span>
      </div>
    </div>
  )
}
