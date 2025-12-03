import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '@/constants'
import type { ApiError } from '@/types'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            code: error.code,
            status: error.response?.status,
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
            // You can add navigation logic here
        }

        return Promise.reject(apiError)
    }
)

export default api
