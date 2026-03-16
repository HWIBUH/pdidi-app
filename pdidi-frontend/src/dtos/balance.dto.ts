export interface BalanceResponse {
    id: number,
    balance: number,
    createdAt: Date,
    updatedAt: Date
}

export interface BalanceRequest {
    amount: number
}