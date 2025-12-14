<<<<<<< HEAD
import { defineConfig, loadEnv } from 'vite'
=======
import { defineConfig } from 'vite'
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
<<<<<<< HEAD
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 5173,
            open: true,
            proxy: {
                // Proxy Auth0 token requests to bypass CORS
                '/auth0': {
                    target: `https://${env.VITE_AUTH0_DOMAIN}`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/auth0/, ''),
                    secure: true,
                },
            },
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
        },
    }
=======
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    },
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
})
