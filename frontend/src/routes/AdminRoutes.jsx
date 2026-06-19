import { Route } from 'react-router'
import { Dashboard }          from '../pages/admin/Dashboard'
import { ClientsManagement }  from '../pages/admin/ClientsManagement'
import { GestorsManagement }  from '../pages/admin/GestorsManagement'
import { DataImport }        from '../pages/admin/DataImport'
import { ReportsView }      from '../pages/admin/ReportsView'
import { ProtectedRoute }     from '../components/ProtectedRoute'

const guard = (Component) => (
    <ProtectedRoute role_id={1}><Component /></ProtectedRoute>
)

export const adminRoutes = [
    <Route key="admin-dash"     path="/admin"          element={guard(Dashboard)} />,
    <Route key="admin-clients"  path="/admin/clients"  element={guard(ClientsManagement)} />,
    <Route key="admin-gestors"  path="/admin/gestors"  element={guard(GestorsManagement)} />,
    <Route key="admin-imports"  path="/admin/imports"  element={guard(DataImport)} />,
    <Route key="admin-reports"  path="/admin/reports"  element={guard(ReportsView)} />,
]
