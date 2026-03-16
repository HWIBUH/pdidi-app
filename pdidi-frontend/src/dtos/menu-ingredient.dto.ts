import type { Ingredient } from "@/model/ingredient.model"
import type { Menu } from "@/model/menu.model"

export interface MenuIngredientResponse {
    id: number 
    menu_id: number
    ingredients_id: number
    createdAt: Date,
    updatedAt: Date,
    menu?: Menu,
    ingredient?: Ingredient
}