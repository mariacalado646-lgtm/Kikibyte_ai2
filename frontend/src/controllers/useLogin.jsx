import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login as apiLogin } from '../services/authService'

export function useLogin() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) =>
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e, redirectByRole = {}) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            const { token, user } = await apiLogin(credentials.email, credentials.password)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            // role-based redirect
            const path = redirectByRole[user.role_id] ?? '/'
            navigate(path)
        } catch (err) {
            setError(err.response?.data?.error || 'Credenciais inválidas.')
        } finally {
            setIsLoading(false)
        }
    }

    return { credentials, handleChange, handleSubmit, isLoading, error }
}
