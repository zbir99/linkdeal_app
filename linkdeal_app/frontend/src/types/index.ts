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
<<<<<<< HEAD
    response?: any
=======
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
}
