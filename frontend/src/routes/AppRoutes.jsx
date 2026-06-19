import { Routes } from 'react-router'
import { publicRoutes } from './PublicRoutes'
import { authRoutes }   from './AuthRoutes'
import { adminRoutes }  from './AdminRoutes'

export function AppRoutes() {
    return (
        <Routes>
        {publicRoutes}
        {authRoutes}
        {adminRoutes}
        </Routes>
    )
}
