import { create } from 'zustand'

interface User {
  username: string | null
  setUsername: (username: string | null) => void
}

export const useUser = create<User>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
}))