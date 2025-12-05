import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { LandingPage, AboutUs, Signup, ForgotPassword } from '@/pages/shared'
import Login from '@/pages/shared/Login'
import Validation from '@/apps/admin/pages/Validation'
import SupportTickets from '@/apps/admin/pages/Support_tickets'
import UserManagement from '@/apps/admin/pages/User_Management'
import Settings from '@/apps/admin/pages/Settings'
import { menteeRoutes, adminRoutes, mentorRoutes } from '@/apps'

function App() {
    const { setTheme } = useAppStore()

    // Initialize theme on mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('app-storage')
        if (storedTheme) {
            try {
                const { state } = JSON.parse(storedTheme)
                if (state?.theme) {
                    setTheme(state.theme)
                }
            } catch (error) {
                console.error('Error parsing stored theme:', error)
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [setTheme])

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/validation" element={<Validation />} />
                <Route path="/admin/support-tickets" element={<SupportTickets />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
                <Route path="/admin/settings" element={<Settings />} />
                {menteeRoutes.map((route, index) => (
                    <Route key={`mentee-${index}`} path={route.path} element={route.element} />
                ))}
                {mentorRoutes.map((route, index) => (
                    <Route key={`mentor-${index}`} path={route.path} element={route.element} />
                ))}
                {adminRoutes.map((route, index) => (
                    <Route key={`admin-${index}`} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default App
