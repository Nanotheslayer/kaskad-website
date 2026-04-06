import clsx from 'clsx'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: boolean
}

export default function Card({ children, padding = true, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-white border border-gray-100 shadow-sm',
        padding && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
