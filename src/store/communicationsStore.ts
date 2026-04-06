import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Communication } from '../types/communication'
import { seedCommunications } from '../data/timelineEvents'

interface CommunicationsState {
  communications: Communication[]
  addCommunication: (comm: Communication) => void
  updateStatus: (id: string, status: Communication['status']) => void
}

export const useCommunicationsStore = create<CommunicationsState>()(
  persist(
    (set) => ({
      communications: seedCommunications,
      addCommunication: (comm) =>
        set((state) => ({
          communications: [comm, ...state.communications],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          communications: state.communications.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })),
    }),
    {
      name: 'kaskad-communications',
    }
  )
)
