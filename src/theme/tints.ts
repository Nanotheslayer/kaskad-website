/** Пастельные пары «фон + акцент» для иконок разделов и плашек (цвета — в tailwind.config.ts) */
export type Tint = 'sun' | 'mint' | 'rose' | 'sky' | 'lilac' | 'peach'

export const tintClasses: Record<Tint, string> = {
  sun: 'bg-tint-sun text-accent-sun',
  mint: 'bg-tint-mint text-accent-mint',
  rose: 'bg-tint-rose text-accent-rose',
  sky: 'bg-tint-sky text-accent-sky',
  lilac: 'bg-tint-lilac text-accent-lilac',
  peach: 'bg-tint-peach text-accent-peach',
}
