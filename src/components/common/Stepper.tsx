import clsx from 'clsx'
import { Check } from 'lucide-react'

interface Step {
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 @xl:gap-2">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={i} className={clsx('flex items-center gap-1 @xl:gap-2', i < steps.length - 1 ? 'flex-1 @5xl:flex-none' : 'shrink-0')} title={step.label}>
            <button
              type="button"
              disabled={!isCompleted || !onStepClick}
              onClick={() => onStepClick?.(i)}
              className="flex shrink-0 items-center gap-2 disabled:cursor-default"
            >
              <div
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors @xl:h-8 @xl:w-8',
                  isCompleted && 'bg-brand-red text-white',
                  isActive && 'bg-brand-yellow text-brand-dark ring-4 ring-brand-yellow/30',
                  !isCompleted && !isActive && 'bg-white text-ink-muted',
                )}
              >
                {isCompleted ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={clsx(
                  'text-sm font-medium whitespace-nowrap',
                  isActive ? 'text-ink' : isCompleted ? 'text-ink-soft' : 'text-ink-muted',
                  // на узкой области подписи остаются только у текущего шага
                  !isActive && 'hidden @5xl:inline',
                )}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={clsx('h-0.5 min-w-2 flex-1 rounded @5xl:w-6 @5xl:flex-none', i < currentStep ? 'bg-brand-red' : 'bg-gray-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
