export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface ApiError {
    message: string
    code?: string
    status?: number
    response?: any
}
