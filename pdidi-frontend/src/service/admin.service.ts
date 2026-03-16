import type { BalanceRequest, BalanceResponse } from "@/dtos/balance.dto"
import type { OrderResponse } from "@/dtos/order.dto"
import { api } from "@/lib/axios"

export async function getBalance(): Promise<BalanceResponse> {
    const res = await api.get("/balance")
    return res.data
}

export async function addBalance(req: BalanceRequest): Promise<BalanceResponse> {
    const res = await api.post("/balance", { amount: req.amount })
    return res.data
}

export async function subtractBalance(req: BalanceRequest): Promise<BalanceResponse> {
    const res = await api.post("/balance/subtract", { amount: req.amount })
    return res.data
}

export async function getOrders(): Promise<OrderResponse[]> {
    const res = await api.get("/order")
    return res.data
}

export async function toggleOrder(order_id: number){
    const res = await api.patch(`/order/${order_id}/toggle`)
    return res.data
}