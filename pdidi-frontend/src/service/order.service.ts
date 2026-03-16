import type { OrderRequest, OrderResponse } from "@/dtos/order.dto";
import { api } from "@/lib/axios";

export async function createOrder(req: OrderRequest): Promise<OrderResponse> {
    try {
        const res = await api.post('/order', { req })
        return res.data
    }catch(error) {
        throw error
    }
}

export async function getOrdersByUserId(user_id: number): Promise<OrderResponse[]> {
    try{
        const res = await api.get(`/order/user/${user_id}`)
        return res.data
    }catch(error) {
        throw error
    }
}