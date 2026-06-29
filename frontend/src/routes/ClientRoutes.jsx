import { Route } from 'react-router'
import { ClienteLayout }       from '../components/ClienteLayout'
import { ClienteDashboard }    from '../pages/cliente/ClienteDashboard'
import { ClientePedidos }      from '../pages/cliente/ClientePedidos'
import { ClienteSubmissoes }   from '../pages/cliente/ClienteSubmissoes'
import { ClienteDocumentos }   from '../pages/cliente/ClienteDocumentos'
import { ClienteMensagens }    from '../pages/cliente/ClienteMensagens'
import { ProtectedRoute }      from '../components/ProtectedRoute'

export const clientRoutes = (
    <Route element={<ProtectedRoute role_id={3} />}>
        <Route element={<ClienteLayout />}>
            <Route path="/cliente"              element={<ClienteDashboard />} />
            <Route path="/cliente/pedidos"      element={<ClientePedidos />} />
            <Route path="/cliente/submissoes"   element={<ClienteSubmissoes />} />
            <Route path="/cliente/documentos"   element={<ClienteDocumentos />} />
            <Route path="/cliente/mensagens"    element={<ClienteMensagens />} />
        </Route>
    </Route>
)
