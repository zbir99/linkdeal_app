/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_AUTH0_DOMAIN: string
    readonly VITE_AUTH0_CLIENT_ID: string
    readonly VITE_AUTH0_CLIENT_SECRET: string
    readonly VITE_AUTH0_AUDIENCE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
