import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // if (config.url.startsWith('/admin')) {
    //     config.headers['X-Admin-Access'] = 'true'
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)