import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, role_id }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />

    // role_id from JWT (signed server-side, cannot be tampered with)
    if (role_id && Number(user.role_id) !== role_id) {
        return <Navigate to="/" replace />
    }

    // If used as a layout route (no children), render nested routes via Outlet
    return children || <Outlet />
}
