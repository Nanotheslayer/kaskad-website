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
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={!isCompleted || !onStepClick}
              onClick={() => onStepClick?.(i)}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <div
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
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
                )}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={clsx('h-0.5 w-6 rounded', i < currentStep ? 'bg-brand-red' : 'bg-gray-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
