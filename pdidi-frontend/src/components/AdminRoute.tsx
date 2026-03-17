import { Navigate } from 'react-router-dom'
import { useUser } from '@/context/user-storage'
import type { ReactNode } from 'react'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/menu" replace />
  }

  return children
}