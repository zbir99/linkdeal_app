import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AppState {
    // Theme
    theme: 'light' | 'dark'
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void

    // User
    user: User | null
    setUser: (user: User | null) => void
    isAuthenticated: boolean

    // UI State
    isSidebarOpen: boolean
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Theme
            theme: 'light',
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light'
                    // Update HTML class for dark mode
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                    return { theme: newTheme }
                }),
            setTheme: (theme) =>
                set(() => {
                    // Update HTML class for dark mode
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                    return { theme }
                }),

            // User
            user: null,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            isAuthenticated: false,

            // UI State
            isSidebarOpen: true,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                theme: state.theme,
                user: state.user,
                isSidebarOpen: state.isSidebarOpen,
            }),
        }
    )
)
