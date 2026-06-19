import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Lock, LogIn, User, UserCog, ArrowLeft } from 'lucide-react'
import { useLogin } from '../controllers/useLogin'
import logoImg from '../assets/logo.png'

const USER_TYPES = [
  { id: 'admin',  icon: Lock,    title: 'Administrador', desc: 'Acesso total ao sistema' },
{ id: 'gestor', icon: UserCog, title: 'Gestor',        desc: 'Gestão de clientes e documentos' },
{ id: 'client', icon: User,    title: 'Cliente',       desc: 'Acesso à área de cliente' },
]

// role_id → redirect path (adjust to match your DB roles)
const REDIRECT_BY_ROLE = { 1: '/admin', 2: '/gestor', 3: '/' }

export function LoginExisting() {
  const navigate = useNavigate()
  const [step, setStep] = useState('type')
  const [userType, setUserType] = useState('admin')
  const { credentials, handleChange, handleSubmit, isLoading, error } = useLogin()

  const onSubmit = (e) => handleSubmit(e, REDIRECT_BY_ROLE)
  const selectedType = USER_TYPES.find(t => t.id === userType)

  return (
    <div className="kb-auth-wrap d-flex align-items-center justify-content-center p-3">
    <div className="w-100" style={{ maxWidth: 440 }}>

    <div className="text-center mb-4">
    <div className="d-inline-flex align-items-center gap-2 mb-3">
    <img src={logoImg} alt="KikiByte Logo" style={{ height: 56, width: 56 }} />
    <span className="kb-logo-text" style={{ fontSize: '1.75rem' }}>KikiByte</span>
    </div>
    <p className="text-muted mb-0">Login - Conta Existente</p>
    </div>

    {step === 'type' ? (
      <>
      <div className="kb-form-box rounded-4 p-4 shadow-sm">
      <h2 className="fs-5 fw-bold text-center mb-4">Selecione o Tipo de Utilizador</h2>
      <div className="d-flex flex-column gap-3">
      {USER_TYPES.map(t => (
        <button
        key={t.id}
        onClick={() => { setUserType(t.id); setStep('credentials') }}
        className="kb-type-btn d-flex align-items-center gap-3 text-start p-3 rounded-3"
        >
        <div className="kb-icon-box flex-shrink-0">
        <t.icon size={22} className="kb-icon" />
        </div>
        <div>
        <div className="fw-semibold">{t.title}</div>
        <small className="text-muted">{t.desc}</small>
        </div>
        </button>
      ))}
      </div>
      </div>

      <div className="text-center mt-3">
      <button onClick={() => navigate('/login')} className="kb-back-btn text-muted small d-inline-flex align-items-center gap-1">
      <ArrowLeft size={14} /> Voltar
      </button>
      </div>
      </>
    ) : (
      <form onSubmit={onSubmit} className="kb-form-box rounded-4 p-4 shadow-sm">

      <div className="text-center mb-4">
      <div className="kb-icon-box mx-auto mb-2">
      <selectedType.icon size={26} className="kb-icon" />
      </div>
      <h3 className="fs-5 fw-semibold mb-0">Login como {selectedType.title}</h3>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      <div className="mb-3">
      <label htmlFor="email" className="form-label small fw-medium">
      Email
      </label>
      <input
      type="email"
      id="email" name="email" required
      value={credentials.email} onChange={handleChange}
      className="form-control kb-input"
      placeholder={
        userType === 'admin'  ? 'admin@kikibyte.pt' :
        userType === 'gestor' ? 'gestor@kikibyte.pt' :
        'o_seu@email.pt'
      }
      />
      </div>

      <div className="mb-3">
      <label htmlFor="password" className="form-label small fw-medium">Palavra-passe</label>
      <input
      type="password" id="password" name="password" required
      value={credentials.password} onChange={handleChange}
      className="form-control kb-input"
      placeholder="••••••••"
      />
      </div>

      <button type="submit" disabled={isLoading} className="btn-kb-primary w-100 justify-content-center mb-3">
      <LogIn size={18} /> {isLoading ? 'A entrar...' : 'Entrar'}
      </button>

      <div className="text-center">
      <button
      type="button"
      onClick={() => setStep('type')}
      className="kb-back-btn text-muted small d-inline-flex align-items-center gap-1"
      >
      <ArrowLeft size={14} /> Voltar
      </button>
      </div>
      </form>
    )}
    </div>
    </div>
  )
}
