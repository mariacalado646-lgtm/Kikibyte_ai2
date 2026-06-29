import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import {
  LayoutDashboard, Users, FileText, ClipboardList,
  MessageSquare, History, LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

const navItems = [
  { label: 'Visão Geral',  icon: LayoutDashboard, path: '/gestor' },
  { label: 'Clientes',     icon: Users,           path: '/gestor/clientes' },
  { label: 'Documentos',   icon: FileText,         path: '/gestor/documentos' },
  { label: 'Pedidos',      icon: ClipboardList,   path: '/gestor/pedidos' },
  { label: 'Mensagens',    icon: MessageSquare,    path: '/gestor/mensagens' },
  { label: 'Logs Sistema', icon: History,          path: '/gestor/logs' },
]

export function GestorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

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
                <span className="admin-brand-role">Painel Gestor</span>
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
                <span className="admin-user-name">{user?.nome || 'Gestor'}</span>
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
