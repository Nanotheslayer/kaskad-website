interface StepHeadingProps {
  title: string
  description: string
  className?: string
}

/** Заголовок и пояснение шага формы паспорта */
export default function StepHeading({ title, description, className }: StepHeadingProps) {
  return (
    <div className={className}>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
    </div>
  )
}
