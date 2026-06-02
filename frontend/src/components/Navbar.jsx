import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import logoImg from '../assets/logo.png';
// import { ClientNotifications } from './ClientNotifications';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const userType = localStorage.getItem('user_type');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_type');
    localStorage.removeItem('username');
    localStorage.removeItem('client_id');
    navigate('/');
  };

  const scrollToSection = id => {
  // If not on home page, navigate there first
  if (location.pathname !== "/") {
    navigate("/")
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: "smooth" })
    }, 100)
  } else {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }
  setIsMenuOpen(false)
}


  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
            <img src={logoImg} alt="KikiByte Logo" className="h-12 w-12" />
            <span className="text-2xl text-primary font-semibold">KikiByte</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors">
              Sobre
            </button>
            <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('compliance')} className="text-foreground hover:text-primary transition-colors">
              Conformidade
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Contacto
            </button>
            
            {isAuthenticated ? (
              <>
                {userType === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Administração
                  </button>
                )}
                {userType === 'gestor' && (
                  <button
                    onClick={() => navigate('/gestor')}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Painel Gestor
                  </button>
                )}
                <div className="flex items-center gap-3">
                  {/* {userType === 'client' && <ClientNotifications />} */}
                  <div className="flex items-center gap-2 text-foreground">
                    <User size={18} />
                    <span className="text-sm">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <button
                // inert since there is no login page working yet
                // onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <LogIn size={18} />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => scrollToSection('about')} 
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('compliance')} 
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Conformidade
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Contacto
            </button>
            
            {isAuthenticated ? (
              <>
                {userType === 'admin' && (
                  <button
                    onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Administração
                  </button>
                )}
                {userType === 'gestor' && (
                  <button
                    onClick={() => { navigate('/gestor'); setIsMenuOpen(false); }}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Painel Gestor
                  </button>
                )}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-3 py-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <User size={18} />
                      <span className="text-sm">{username}</span>
                    </div>
                    {userType === 'client' && <ClientNotifications />}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <LogIn size={18} />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}