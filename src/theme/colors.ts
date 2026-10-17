/**
 * Цвета из данных: типы коммуникаций, уровни каскада, группы каналов, статусы, оценки.
 * Фирменные цвета — красный, жёлтый и чёрный из брендбука. Остальные приглушённые: они только различают
 * категории и не спорят с фирменными. Цвета для классов Tailwind — в блоке @theme в src/index.css.
 */
export const palette = {
  brandRed: '#ed1b24',
  brandYellow: '#ffcb05',
  black: '#1a1b23',
  graphite: '#5b5c64',
  steel: '#3a6593',
  petrol: '#2b7377',
  green: '#3d7d52',
  ochre: '#a26a00',
  plum: '#7a5a8a',
  clay: '#a65b3a',
} as const

/** Уровни У1–У6: от чёрного брендбука к серому — чем дальше от генерального директора, тем светлее */
export const levelShades = ['#1a1b23', '#30313a', '#46474f', '#5b5c64', '#707179', '#85868d'] as const

/** Цвет с прозрачностью: alpha('#3d7d52', 0.12) → '#3d7d521f' */
export function alpha(hex: string, opacity: number): string {
  const channel = Math.round(opacity * 255)
  return hex + channel.toString(16).padStart(2, '0')
}
