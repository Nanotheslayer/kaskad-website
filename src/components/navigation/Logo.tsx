/** Логотип портала: «каскад» из трёх ступеней в цветах бренда */
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#ed1b24" />
        <rect x="8" y="9" width="24" height="5" rx="2.5" fill="#ffffff" />
        <rect x="8" y="17.5" width="17" height="5" rx="2.5" fill="#ffcb05" />
        <rect x="8" y="26" width="10" height="5" rx="2.5" fill="#ffffff" />
      </svg>
      <div className="leading-none">
        <div className="font-display text-[22px] font-bold tracking-tight text-brand-red">Каскад</div>
        <div className="mt-1 text-[11px] text-ink-muted">портал коммуникаций · Петрович</div>
      </div>
    </div>
  )
}
