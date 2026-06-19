import { Route } from 'react-router'
import { GestorDashboard }       from '../pages/gestor/GestorDashboard'
import { GestorClientes }        from '../pages/gestor/GestorClientes'
import { GestorClienteDetalhes } from '../pages/gestor/GestorClienteDetalhes'
import { GestorDocumentos }      from '../pages/gestor/GestorDocumentos'
import { GestorMensagens }       from '../pages/gestor/GestorMensagens'
import { GestorPedidos }         from '../pages/gestor/GestorPedidos'
import { ProtectedRoute }        from '../components/ProtectedRoute'

const guard = (Component) => (
    <ProtectedRoute role_id={2}>
        <Component />
    </ProtectedRoute>
)

export const gestorRoutes = [
    <Route
        key="gestor-dash"
        path="/gestor"
        element={guard(GestorDashboard)}
    />,
    <Route
        key="gestor-clientes"
        path="/gestor/clientes"
        element={guard(GestorClientes)}
    />,
    <Route
        key="gestor-cliente-detalhes"
        path="/gestor/clientes/:id"
        element={guard(GestorClienteDetalhes)}
    />,
    <Route
        key="gestor-documentos"
        path="/gestor/documentos"
        element={guard(GestorDocumentos)}
    />,
    <Route
        key="gestor-mensagens"
        path="/gestor/mensagens"
        element={guard(GestorMensagens)}
    />,
    <Route
        key="gestor-pedidos"
        path="/gestor/pedidos"
        element={guard(GestorPedidos)}
    />,
]