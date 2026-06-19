import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Menu, X, LogIn, LogOut, User } from 'lucide-react'
import logoImg from '../assets/logo.png'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true'
  const userType = localStorage.getItem('user_type')
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated')
    localStorage.removeItem('user_type')
    localStorage.removeItem('username')
    localStorage.removeItem('client_id')
    navigate('/')
  }

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleLogoClick = () => {
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }

  return (
    <nav className="kb-navbar">
    <div className="container">
    <div className="d-flex align-items-center justify-content-between" style={{ height: 64 }}>
    <div className="d-flex align-items-center gap-2 kb-logo" onClick={handleLogoClick}>
    <img src={logoImg} alt="KikiByte Logo" style={{ height: 48, width: 48 }} />
    <span className="kb-logo-text">KikiByte</span>
    </div>

    <div className="d-none d-md-flex align-items-center gap-4">
    {['about','services','compliance','contact'].map((id, i) => (
      <button key={id} className="kb-nav-link" onClick={() => scrollToSection(id)}>
      {['Sobre','Serviços','Conformidade','Contacto'][i]}
      </button>
    ))}
    {isAuthenticated ? (
      <div className="d-flex align-items-center gap-3">
      {userType === 'admin' && (
        <button className="kb-nav-link" onClick={() => navigate('/admin')}>Administração</button>
      )}
      {userType === 'gestor' && (
        <button className="kb-nav-link" onClick={() => navigate('/gestor')}>Painel Gestor</button>
      )}
      <div className="d-flex align-items-center gap-2 text-muted">
      <User size={18} /><span style={{ fontSize: '0.875rem' }}>{username}</span>
      </div>
      <button className="btn-kb-outline-sm" onClick={handleLogout}>
      <LogOut size={16} /> Sair
      </button>
      </div>
    ) : (
      <button className="btn-kb-primary-sm" onClick={() => navigate('/login')}>
      <LogIn size={16} /> Login
      </button>
    )}
    </div>

    <button className="kb-hamburger d-md-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
    </div>
    </div>

    {isMenuOpen && (
      <div className="kb-mobile-menu">
      <div className="container py-3 d-flex flex-column gap-2">
      {['about','services','compliance','contact'].map((id, i) => (
        <button key={id} className="kb-nav-link text-start" onClick={() => scrollToSection(id)}>
        {['Sobre','Serviços','Conformidade','Contacto'][i]}
        </button>
      ))}
      {isAuthenticated ? (
        <div className="pt-3 border-top mt-2">
        {userType === 'admin' && (
          <button className="kb-nav-link d-block mb-2" onClick={() => { navigate('/admin'); setIsMenuOpen(false) }}>
          Administração
          </button>
        )}
        <div className="d-flex align-items-center gap-2 mb-3 text-muted">
        <User size={18} /><span style={{ fontSize: '0.875rem' }}>{username}</span>
        </div>
        <button className="btn-kb-outline w-100" onClick={handleLogout}>
        <LogOut size={16} /> Sair
        </button>
        </div>
      ) : (
        <button className="btn-kb-primary w-100 mt-2" onClick={() => { navigate('/login'); setIsMenuOpen(false) }}>
        <LogIn size={16} /> Login
        </button>
      )}
      </div>
      </div>
    )}
    </nav>
  )
}
