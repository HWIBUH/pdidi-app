import { useState, type ReactNode } from "react"
import { UserContext } from "./user-hook"


interface Props {
  children: ReactNode
}

export function UserProvider({ children }: Props) {
  const [username, setUsername] = useState<string | null>(null)

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  )
}