<<<<<<< HEAD
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LinkDeal'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Auth0 Configuration
export const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || ''
export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
export const AUTH0_CLIENT_SECRET = import.meta.env.VITE_AUTH0_CLIENT_SECRET || ''
export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || ''

=======
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LinkDeal'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
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
