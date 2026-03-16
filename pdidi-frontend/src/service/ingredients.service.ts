import { api } from "@/lib/axios";
import type { Ingredient } from "@/model/ingredient.model";

export async function getIngredients(): Promise<Ingredient[]> {
    const res = await api.get("/ingredients")
    console.log(res)
    return res.data
}
