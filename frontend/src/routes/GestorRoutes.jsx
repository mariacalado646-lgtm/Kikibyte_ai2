import { Route } from 'react-router'
import { GestorLayout }          from '../components/GestorLayout'
import { GestorDashboard }       from '../pages/gestor/GestorDashboard'
import { GestorClientes }        from '../pages/gestor/GestorClientes'
import { GestorClienteDetalhes } from '../pages/gestor/GestorClienteDetalhes'
import { GestorDocumentos }      from '../pages/gestor/GestorDocumentos'
import { GestorMensagens }       from '../pages/gestor/GestorMensagens'
import { GestorPedidos }         from '../pages/gestor/GestorPedidos'
import { LogsView }              from '../pages/admin/LogsView'
import { ProtectedRoute }        from '../components/ProtectedRoute'

export const gestorRoutes = (
    <Route element={<ProtectedRoute role_id={2} />}>
        <Route element={<GestorLayout />}>
            <Route path="/gestor"               element={<GestorDashboard />} />
            <Route path="/gestor/clientes"       element={<GestorClientes />} />
            <Route path="/gestor/clientes/:id"   element={<GestorClienteDetalhes />} />
            <Route path="/gestor/documentos"     element={<GestorDocumentos />} />
            <Route path="/gestor/mensagens"      element={<GestorMensagens />} />
            <Route path="/gestor/pedidos"        element={<GestorPedidos />} />
            <Route path="/gestor/logs"          element={<LogsView />} />
        </Route>
    </Route>
)