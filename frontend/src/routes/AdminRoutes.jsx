import { Route } from 'react-router'
import { AdminLayout }        from '../components/AdminLayout'
import { Dashboard }          from '../pages/admin/Dashboard'
import { ClientsManagement }  from '../pages/admin/ClientsManagement'
import { GestorsManagement }  from '../pages/admin/GestorsManagement'
import { DataImport }        from '../pages/admin/DataImport'
import { ReportsView }      from '../pages/admin/ReportsView'
import { SiteContent }      from '../pages/admin/SiteContent'
import { ArticlesManagement } from '../pages/admin/ArticlesManagement'
import { LogsView }         from '../pages/admin/LogsView'
import { ClientPermissions }  from '../pages/admin/ClientPermissions'
import { ProtectedRoute }     from '../components/ProtectedRoute'

export const adminRoutes = (
    <Route element={<ProtectedRoute role_id={1} />}>
        <Route element={<AdminLayout />}>
            <Route path="/admin"          element={<Dashboard />} />
            <Route path="/admin/clients"  element={<ClientsManagement />} />
            <Route path="/admin/gestors"  element={<GestorsManagement />} />
            <Route path="/admin/imports"  element={<DataImport />} />
            <Route path="/admin/reports"  element={<ReportsView />} />
            <Route path="/admin/content"  element={<SiteContent />} />
            <Route path="/admin/artigos"  element={<ArticlesManagement />} />
            <Route path="/admin/logs"         element={<LogsView />} />
            <Route path="/admin/permissoes"   element={<ClientPermissions />} />
        </Route>
    </Route>
)
