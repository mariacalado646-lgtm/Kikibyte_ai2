import { Routes, Route } from 'react-router'
import { publicRoutes } from './PublicRoutes'
import { authRoutes }   from './AuthRoutes'
import { adminRoutes }  from './AdminRoutes'
import { gestorRoutes }  from './GestorRoutes'
import { clientRoutes }  from './ClientRoutes'
import { ChangePassword } from '../pages/ChangePassword'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { NotFound }     from '../pages/NotFound'

export function AppRoutes() {
    return (
        <Routes>
        {publicRoutes}
        {authRoutes}
        {adminRoutes}
        {gestorRoutes}
        {clientRoutes}
        <Route path="/change-password" element={<ProtectedRoute role_id={null}><ChangePassword /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
