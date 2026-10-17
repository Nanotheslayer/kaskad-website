/**
 * Палитра акцентных цветов: типы коммуникаций, уровни каскада, категории каналов, статусы.
 * Фирменные и пастельные цвета для классов Tailwind — в блоке @theme в src/index.css.
 */
export const palette = {
  brandRed: '#ed1b24',
  brandYellow: '#ffcb05',
  crimson: '#d11f3a',
  orange: '#f26b21',
  tangerine: '#f28b3c',
  amber: '#f5a300',
  green: '#2fa84f',
  teal: '#12a6a0',
  azure: '#3b9ae8',
  sky: '#0ea5e9',
  blue: '#4f6bed',
  violet: '#7c5cdb',
  pink: '#e255a1',
  coral: '#e5484d',
  slate: '#7b8794',
} as const

/** Цвет с прозрачностью: alpha('#2fa84f', 0.12) → '#2fa84f1f' */
export function alpha(hex: string, opacity: number): string {
  const channel = Math.round(opacity * 255)
  return hex + channel.toString(16).padStart(2, '0')
}
