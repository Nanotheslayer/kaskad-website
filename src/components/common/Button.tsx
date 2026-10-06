import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all',
        {
          'bg-brand-red text-white hover:bg-brand-red-dark active:scale-[0.98] shadow-sm': variant === 'primary',
          'bg-brand-yellow text-brand-dark hover:bg-brand-yellow-dark active:scale-[0.98]': variant === 'yellow',
          'bg-white text-ink border border-gray-200 hover:bg-gray-50': variant === 'secondary',
          'text-ink hover:bg-gray-100': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
