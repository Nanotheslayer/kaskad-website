import clsx from 'clsx'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Сегментированный переключатель в стиле табов «Петлокала»: серая подложка и белая активная вкладка */
export default function Segmented<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <div className={clsx('inline-flex min-w-0 max-w-full overflow-x-auto rounded-xl bg-gray-100 p-1', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            'shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all @xl:px-4',
            value === o.value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
