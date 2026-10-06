import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Communication, CommunicationStatus } from '../types/communication'
import { seedCommunications } from '../data/timelineEvents'

interface CommunicationsState {
  /** Коммуникации, созданные пользователем через паспорт инфоповода */
  userCommunications: Communication[]
  /** Ручные изменения статуса (в том числе для демо-коммуникаций) */
  statusOverrides: Record<string, CommunicationStatus>
  addCommunication: (comm: Communication) => void
  updateStatus: (id: string, status: CommunicationStatus) => void
}

/**
 * Демо-коммуникации не хранятся в localStorage: их даты считаются от текущего дня
 * при каждой загрузке. Сохраняются только созданные пользователем коммуникации
 * и ручные изменения статуса.
 */
export const useCommunicationsStore = create<CommunicationsState>()(
  persist(
    (set) => ({
      userCommunications: [],
      statusOverrides: {},
      addCommunication: (comm) =>
        set((state) => ({ userCommunications: [comm, ...state.userCommunications] })),
      updateStatus: (id, status) =>
        set((state) => ({ statusOverrides: { ...state.statusOverrides, [id]: status } })),
    }),
    { name: 'kaskad-communications-v2' },
  ),
)

export function useAllCommunications(): Communication[] {
  const user = useCommunicationsStore((s) => s.userCommunications)
  const overrides = useCommunicationsStore((s) => s.statusOverrides)
  return useMemo(
    () => [...user, ...seedCommunications].map((c) => (overrides[c.id] ? { ...c, status: overrides[c.id] } : c)),
    [user, overrides],
  )
}
