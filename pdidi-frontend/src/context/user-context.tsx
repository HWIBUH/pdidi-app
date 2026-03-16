import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/model/user.model'

interface UserContext {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useUser = create<UserContext>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)