import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'yellow'
type Size = 'sm' | 'md' | 'lg'

interface StyleProps {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark active:scale-[0.98] shadow-xs',
  yellow: 'bg-brand-yellow text-brand-black hover:bg-brand-yellow-dark active:scale-[0.98]',
  secondary: 'bg-white text-ink border border-gray-200 hover:bg-gray-50',
  ghost: 'text-ink hover:bg-gray-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

function buttonClass({ variant = 'primary', size = 'md' }: StyleProps, className?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all',
    variantClasses[variant],
    sizeClasses[size],
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps

export default function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />
}

/** Ссылка, оформленная как кнопка: не вкладываем <button> в <a> */
export function LinkButton({ variant, size, className, ...props }: LinkProps & StyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />
}
