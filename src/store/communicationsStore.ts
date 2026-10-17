import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Communication, Confirmations, TrackedCommunication } from '../types/communication'
import { seedCommunications, seedConfirmations } from '../data/timelineEvents'
import { useNow } from '../hooks/useNow'
import { trackCommunication } from '../utils/assignments'
import { PERSIST_VERSION, migratePersistedState, sanitizePersistedState, type PersistedState } from './persistedState'

interface CommunicationsState extends PersistedState {
  addCommunication: (comm: Communication) => void
  /** Руководитель подтверждает, что довёл информацию до команды */
  confirmDelivery: (commId: string, managerId: string) => void
  /** Отменяет подтверждение, сделанное пользователем */
  undoConfirmation: (commId: string, managerId: string) => void
  /** Удаляет созданные пользователем коммуникации и его подтверждения */
  resetUserData: () => void
}

/**
 * Демо-коммуникации и их подтверждения не хранятся в localStorage: даты считаются от текущего дня
 * при каждой загрузке. Сохраняются только созданные пользователем коммуникации и его подтверждения.
 */
export const useCommunicationsStore = create<CommunicationsState>()(
  persist(
    (set) => ({
      userCommunications: [],
      confirmations: {},
      addCommunication: (comm) => set((state) => ({ userCommunications: [comm, ...state.userCommunications] })),
      confirmDelivery: (commId, managerId) =>
        set((state) => ({
          confirmations: {
            ...state.confirmations,
            [commId]: { ...state.confirmations[commId], [managerId]: new Date().toISOString() },
          },
        })),
      undoConfirmation: (commId, managerId) =>
        set((state) => {
          const confirmations = { ...state.confirmations, [commId]: { ...state.confirmations[commId] } }
          delete confirmations[commId][managerId]
          if (Object.keys(confirmations[commId]).length === 0) delete confirmations[commId]
          return { confirmations }
        }),
      resetUserData: () => set({ userCommunications: [], confirmations: {} }),
    }),
    {
      name: 'kaskad-communications-v2',
      partialize: ({ userCommunications, confirmations }): PersistedState => ({ userCommunications, confirmations }),
      // При изменении формата записей или id справочников — увеличить версию и дописать миграцию
      version: PERSIST_VERSION,
      migrate: (persisted, version) => sanitizePersistedState(migratePersistedState(persisted, version)),
      merge: (persisted, current) => ({ ...current, ...sanitizePersistedState(persisted) }),
    },
  ),
)

/** Подтверждения демо-данных вместе с подтверждениями пользователя */
export function useConfirmations(): Confirmations {
  const user = useCommunicationsStore((s) => s.confirmations)
  return useMemo(() => {
    const merged: Confirmations = { ...seedConfirmations }
    for (const [commId, byManager] of Object.entries(user)) merged[commId] = { ...merged[commId], ...byManager }
    return merged
  }, [user])
}

/** Все коммуникации с ходом доведения: созданные пользователем — первыми */
export function useAllCommunications(): TrackedCommunication[] {
  const user = useCommunicationsStore((s) => s.userCommunications)
  const confirmations = useConfirmations()
  const now = useNow()
  return useMemo(
    () => [...user, ...seedCommunications].map((c) => trackCommunication(c, now, confirmations[c.id])),
    [user, confirmations, now],
  )
}
