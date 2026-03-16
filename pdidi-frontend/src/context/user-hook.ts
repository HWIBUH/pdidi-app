import { useContext } from "react"
import { createContext } from "react"

export interface UserContextType {
  username: string | null
  setUsername: (name: string | null) => void
}

export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {}
})


export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used inside UserProvider")
  }

  return context
}