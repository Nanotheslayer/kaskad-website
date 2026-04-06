import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons = LucideIcons as unknown as Record<string, LucideIcon>

export function getIcon(name: string): LucideIcon | null {
  return icons[name] || null
}
