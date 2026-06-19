import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return null
            // decode payload without verifying (verification happens on server)
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload
        } catch {
            localStorage.removeItem('token')
            return null
        }
    })

    const isAuthenticated = !!localStorage.getItem('token')

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const refreshUser = () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setUser(null)
                return
            }
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser(payload)
        } catch {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

