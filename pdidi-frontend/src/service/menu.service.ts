import type { MenuIngredientResponse } from '@/dtos/menu-ingredient.dto'
import { api } from '@/lib/axios'
import type { Ingredient } from '@/model/ingredient.model'
import { type Menu } from '@/model/menu.model'

export async function getAllMenus(): Promise<Menu[]> {
  try {
    const response = await api.get('/menu')
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getIngredientsForMenu(menu: Menu): Promise<Ingredient[]> {
    try{
        const response = await api.get(`/menu-ingredients/menu/${menu.id}`)
        return response.data.map((item: MenuIngredientResponse) => item.ingredient)
    }catch(error) {
        throw error
    }
}

export async function createMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
    try {
        const response = await api.post('/menu', menu)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateMenu(id: number, menu: Partial<Menu>): Promise<Menu> {
    try {
        const response = await api.put(`/menu/${id}`, menu)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function deleteMenu(id: number): Promise<void> {
    try {
        await api.delete(`/menu/${id}`)
    } catch (error) {
        throw error
    }
}