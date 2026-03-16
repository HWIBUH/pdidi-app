import { api } from "@/lib/axios"

export async function getIngredients() {
    const res = await api.get("/menu/")
    console.log(res)
}

export function getBalance() {

}

export function getTransaction() {
    
}