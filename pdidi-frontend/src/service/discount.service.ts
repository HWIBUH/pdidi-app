import type { DiscountRequest, DiscountResponse } from "@/dtos/discount.dto";
import { api } from "@/lib/axios";

export async function getActiveDiscount(): Promise<DiscountResponse | null> {
    try {
        const res = await api.get('/discount')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getAllDiscounts(): Promise<DiscountResponse[]> {
    try {
        const res = await api.get('/discount/all')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getDiscountById(id: number): Promise<DiscountResponse> {
    try {
        const res = await api.get(`/discount/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function createDiscount(
    discount: DiscountRequest
): Promise<DiscountResponse> {
    try {
        const res = await api.post('/discount', discount)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function updateDiscount(
    id: number,
    discount: Partial<DiscountRequest>
): Promise<DiscountResponse> {
    try {
        const res = await api.put(`/discount/${id}`, discount)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function deleteDiscount(id: number): Promise<{ message: string }> {
    try {
        const res = await api.delete(`/discount/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}