import { getIngredients } from "@/service/ingredients.service";

export type Ingredient = {
    name: string,
    available: boolean
}

export const ingredients:Ingredient[] = await getIngredients()