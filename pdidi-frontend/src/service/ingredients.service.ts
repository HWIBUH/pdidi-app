import { api } from "@/lib/utils";
import type { Ingredient } from "@/model/ingredient.model";

export async function getIngredients():Promise<Ingredient[]> {
    const res = await api.get("/api/menu/")
    console.log(res)
    return [{name: "Ayam", available: true}, {name: "Tahu", available: true}]
}
