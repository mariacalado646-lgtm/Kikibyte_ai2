import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import {
  LayoutDashboard, FileText, MessageSquare,
  ClipboardList, Upload,
  LogOut, Menu, X, User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import logoImg from '../assets/logo.png'

const ALL_NAV_ITEMS = [
  { label: 'Visão Geral',  funcionalidade: 'dashboard',  icon: LayoutDashboard, path: '/cliente' },
  { label: 'Pedidos',      funcionalidade: 'pedidos',    icon: ClipboardList,   path: '/cliente/pedidos' },
  { label: 'Submissões',   funcionalidade: 'submissoes', icon: Upload,           path: '/cliente/submissoes' },
  { label: 'Documentos',   funcionalidade: 'documentos',  icon: FileText,         path: '/cliente/documentos' },
  { label: 'Mensagens',    funcionalidade: 'mensagens',   icon: MessageSquare,    path: '/cliente/mensagens' },
]

export function ClienteLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [permissoesCarregadas, setPermissoesCarregadas] = useState(false)
  const [permissoes, setPermissoes] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    api.get('/permissoes/me')
      .then(res => setPermissoes(res.data.permissoes))
      .catch(() => setPermissoes([]))
      .finally(() => setPermissoesCarregadas(true))
  }, [])

  // Filter nav items based on permissions
  const navItems = permissoesCarregadas
    ? ALL_NAV_ITEMS.filter(item => {
        const p = permissoes.find(pp => pp.funcionalidade === item.funcionalidade)
        return p ? p.ativo : true
      })
    : ALL_NAV_ITEMS

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo" onClick={() => navigate('/')}>
            <img src={logoImg} alt="KikiByte Logo" />
            {sidebarOpen && (
              <div className="admin-sidebar-brand">
                <span className="admin-brand-name">KikiByte</span>
                <span className="admin-brand-role">Área Cliente</span>
              </div>
            )}
          </div>
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            {sidebarOpen && (
              <div className="admin-user-info">
                <span className="admin-user-name">{user?.nome || 'Cliente'}</span>
                <span className="admin-user-email">{user?.email || ''}</span>
              </div>
            )}
          </div>
          <button className="admin-nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        <Outlet />
      </div>
    </div>
  )
}
