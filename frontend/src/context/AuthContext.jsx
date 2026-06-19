import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token')
        if (!token) return null
            // decode payload without verifying (verification happens on server)
            return JSON.parse(atob(token.split('.')[1]))
    })

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password })
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return data.user
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    // attach token to every axios request automatically
    axios.defaults.headers.common['Authorization'] =
    user ? `Bearer ${localStorage.getItem('token')}` : ''

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
