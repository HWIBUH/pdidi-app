import { api } from '@/lib/axios'
import { useUser } from '@/context/user-context'
import type { LoginRequest, LoginResponse } from '@/dtos/login.dto'
import type { RegisterRequest, RegisterResponse } from '@/dtos/register.dto'
import { redirect } from 'react-router'

export async function login(req: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/login', { username: req.username })
    
    const { setUsername } = useUser.getState()
    setUsername(req.username)
    
    return response.data
  } catch (error) {
    throw error
  }
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await api.post('/auth/register', { username: req.username })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function logout() {
  const { setUsername } = useUser.getState()
  setUsername(null)
  redirect('/')
}