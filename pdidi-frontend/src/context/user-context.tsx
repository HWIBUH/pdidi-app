import { create } from 'zustand'
import type { User } from '@/model/user.model'

interface UserContext {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useUser = create<UserContext>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))