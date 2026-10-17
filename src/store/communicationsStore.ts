import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Communication, CommunicationStatus } from '../types/communication'
import { seedCommunications } from '../data/timelineEvents'
import { PERSIST_VERSION, migratePersistedState, sanitizePersistedState, type PersistedState } from './persistedState'

interface CommunicationsState extends PersistedState {
  addCommunication: (comm: Communication) => void
  updateStatus: (id: string, status: CommunicationStatus) => void
  /** Удаляет созданные пользователем коммуникации и ручные статусы */
  resetUserData: () => void
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
      addCommunication: (comm) => set((state) => ({ userCommunications: [comm, ...state.userCommunications] })),
      updateStatus: (id, status) => set((state) => ({ statusOverrides: { ...state.statusOverrides, [id]: status } })),
      resetUserData: () => set({ userCommunications: [], statusOverrides: {} }),
    }),
    {
      name: 'kaskad-communications-v2',
      partialize: ({ userCommunications, statusOverrides }): PersistedState => ({
        userCommunications,
        statusOverrides,
      }),
      // При изменении формата записей или id справочников — увеличить версию и дописать миграцию
      version: PERSIST_VERSION,
      migrate: (persisted, version) => sanitizePersistedState(migratePersistedState(persisted, version)),
      merge: (persisted, current) => ({ ...current, ...sanitizePersistedState(persisted) }),
    },
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
