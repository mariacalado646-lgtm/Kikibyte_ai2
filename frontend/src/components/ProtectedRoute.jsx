import { Navigate } from 'react-router'

export function ProtectedRoute({ children, role_id }) {
    const token   = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) return <Navigate to="/login" replace />

        const user = JSON.parse(userStr)
        if (role_id && Number(user.role_id) !== role_id) {
            return <Navigate to="/" replace />
        }

        return children
}
