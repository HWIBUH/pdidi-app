import type { MenuIngredientResponse } from "@/dtos/menu-ingredient.dto";
import { api } from "@/lib/axios";
import type { Ingredient } from "@/model/ingredient.model";
import type { Menu } from "@/model/menu.model";

export async function getAllIngredients(): Promise<Ingredient[]> {
    const res = await api.get("/ingredients")
    console.log(res)
    return res.data
}


export async function createIngredient(ingredient: Omit<Ingredient, 'id'>): Promise<Ingredient> {
    try {
        const response = await api.post('/ingredients', ingredient)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateIngredient(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    try {
        const response = await api.put(`/ingredients/${id}`, ingredient)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function deleteIngredient(id: number): Promise<void> {
    try {
        await api.delete(`/ingredients/${id}`)
    } catch (error) {
        throw error
    }
}

export async function getMenuForIngredient(ingredient: Ingredient): Promise<Menu[]> {
    try{
        const response = await api.get(`/menu-ingredients/ingredient/${ingredient.id}`)
        return response.data.map((item: MenuIngredientResponse) => item.menu)
    }catch(error) {
        throw error
    }
}

export async function toggleIngredientAvailability(ingredient_id: number) {
    try {
        const response = await api.put(`ingredients/${ingredient_id}`)
        return response.data
    }catch(error) {
        throw error
    }
}