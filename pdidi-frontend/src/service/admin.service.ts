import type { BalanceRequest, BalanceResponse } from "@/dtos/balance.dto"
import type { OrderResponse } from "@/dtos/order.dto"
import { api } from "@/lib/axios"
import type { Ingredient } from "@/model/ingredient.model"
import type { Menu } from "@/model/menu.model"

export async function getBalance(): Promise<BalanceResponse> {
    const res = await api.get("/balance")
    return res.data
}

export async function addBalance(req: BalanceRequest): Promise<BalanceResponse> {
    try {
        const res = await api.post("/balance", { amount: req.amount })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function subtractBalance(req: BalanceRequest): Promise<BalanceResponse> {
    try {
        const res = await api.post("/balance/subtract", { amount: req.amount })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getOrders(): Promise<OrderResponse[]> {
    const res = await api.get("/order")
    return res.data
}

export async function toggleOrder(order_id: number){
    try {
        const res = await api.patch(`/order/${order_id}/toggle`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function deleteOrder(order_id: number){
    try{
        const res = await api.delete(`/order/${order_id}`)
        return res.data
    }catch(error) {
        throw error
    }
}

export async function mapIngredientToMenu(ingredient: Ingredient, menu: Menu) {
    try {
        const res = await api.post('/menu-ingredients', { menu_id: menu.id, ingredients_id: ingredient.id })
        return res.data
    } catch (error) {
        throw error
    }
}