import { api } from '@/lib/axios'
import { type Menu } from '@/model/menu.model'

export async function getAllMenus(): Promise<Menu[]> {
  try {
    const response = await api.get('/menu')
    console.log(response)
    return response.data
  } catch (error) {
    throw error
  }
}