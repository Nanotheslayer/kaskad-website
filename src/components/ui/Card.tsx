import clsx from 'clsx'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: boolean
}

export default function Card({ children, padding = true, className, ...props }: CardProps) {
  return (
    <div className={clsx('rounded-2xl bg-white shadow-card', padding && 'p-5', className)} {...props}>
      {children}
    </div>
  )
}
