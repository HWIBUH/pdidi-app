import { api } from "@/lib/utils";

export async function getIngredients() {
    const res = await api.get("/api/menu/")
    console.log(res)
}

export function getBalance() {

}

export function getTransaction() {
    
}