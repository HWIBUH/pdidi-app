import { Navigate } from 'react-router-dom'
import { useUser } from '@/context/user-storage'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}
