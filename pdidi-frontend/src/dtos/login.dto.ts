export interface LoginRequest {
    username: string
}

export interface LoginResponse {
    message: string
    userId: number
    username: string
    role: 'user' | 'admin'
}