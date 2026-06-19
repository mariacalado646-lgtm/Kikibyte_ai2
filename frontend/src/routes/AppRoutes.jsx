import { Routes } from 'react-router'
import { publicRoutes } from './PublicRoutes'
import { authRoutes }   from './AuthRoutes'
import { adminRoutes }  from './AdminRoutes'
import { gestorRoutes }  from './GestorRoutes'

export function AppRoutes() {
    return (
        <Routes>
        {publicRoutes}
        {authRoutes}
        {adminRoutes}
        {gestorRoutes}
        </Routes>
    )
}
