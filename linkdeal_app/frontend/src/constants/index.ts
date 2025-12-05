export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LinkDeal'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    DASHBOARD: '/dashboard',
    NOT_FOUND: '/404',
} as const

export const LOCAL_STORAGE_KEYS = {
    THEME: 'theme',
    USER: 'user',
    TOKEN: 'token',
} as const
