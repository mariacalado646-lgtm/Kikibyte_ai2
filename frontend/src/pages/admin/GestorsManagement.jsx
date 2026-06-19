import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Mail, Phone, UserCog, Eye, EyeOff } from 'lucide-react'

const INITIAL_FORM = { name: '', email: '', phone: '', username: '', password: '' }

export function GestorsManagement() {
  const [gestors, setGestors]             = useState([])
  const [searchTerm, setSearchTerm]       = useState('')
  const [isDialogOpen, setIsDialogOpen]   = useState(false)
  const [editingGestor, setEditingGestor] = useState(null)
  const [showPassword, setShowPassword]   = useState(false)
  const [formData, setFormData]           = useState(INITIAL_FORM)

  useEffect(() => {
    const stored = localStorage.getItem('gestors')
    if (stored) {
      setGestors(JSON.parse(stored).filter(g => !g.isDeleted))
    } else {
      const defaults = [{
        id: 1, name: 'Gestor Principal', email: 'gestor@kikibyte.pt',
        phone: '+351 910000000', username: 'gestor', password: 'gestor123',
        createdAt: '2026-01-01', lastLogin: '2026-05-29'
      }]
      setGestors(defaults)
      localStorage.setItem('gestors', JSON.stringify(defaults))
    }
  }, [])

  const resetForm = () => {
    setFormData(INITIAL_FORM)
    setShowPassword(false)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingGestor(null)
    resetForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const all = JSON.parse(localStorage.getItem('gestors') || '[]')

    if (editingGestor) {
      const updated = all.map(g => {
        if (g.id !== editingGestor.id) return g
          const merged = { ...g, ...formData }
          if (!formData.password) merged.password = g.password
            return merged
      })
      localStorage.setItem('gestors', JSON.stringify(updated))
      setGestors(updated.filter(g => !g.isDeleted))
      // toast.success('Gestor atualizado com sucesso!')
    } else {
      const newGestor = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      const updated = [...all, newGestor]
      localStorage.setItem('gestors', JSON.stringify(updated))
      setGestors(updated.filter(g => !g.isDeleted))
      // toast.success('Gestor criado com sucesso!')
    }
    closeDialog()
  }

  const handleEdit = (gestor) => {
    setEditingGestor(gestor)
    setFormData({
      name: gestor.name, email: gestor.email,
      phone: gestor.phone, username: gestor.username, password: ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja eliminar este gestor?')) return
      const all = JSON.parse(localStorage.getItem('gestors') || '[]')
      const updated = all.map(g => g.id === id ? { ...g, isDeleted: true } : g)
      localStorage.setItem('gestors', JSON.stringify(updated))
      setGestors(updated.filter(g => !g.isDeleted))
      // toast.success('Gestor eliminado com sucesso!')
  }

  const filteredGestors = gestors.filter(g => {
    const q = searchTerm.toLowerCase()
    return g.name.toLowerCase().includes(q)
    || g.email.toLowerCase().includes(q)
    || g.username.toLowerCase().includes(q)
  })

  return (
    <div className="p-4">

    <div className="mb-4">
    <h1 className="kb-section-title mb-2">Gestão de Gestores</h1>
    <p className="text-muted">Gerir contas de gestores do sistema</p>
    </div>

    {/* Header Actions */}
    <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
    <div className="kb-search-wrap flex-grow-1" style={{ maxWidth: 'none' }}>
    <Search size={18} className="kb-search-icon" />
    <input
    type="text"
    placeholder="Pesquisar gestores..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="form-control kb-input kb-search-input"
    />
    </div>
    <button onClick={() => setIsDialogOpen(true)} className="btn-kb-primary text-nowrap">
    <Plus size={18} /> Novo Gestor
    </button>
    </div>

    {/* Gestors Table */}
    <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
    <div className="table-responsive">
    <table className="table mb-0">
    <thead className="bg-light">
    <tr>
    <th className="small fw-medium text-muted text-uppercase">Gestor</th>
    <th className="small fw-medium text-muted text-uppercase">Contacto</th>
    <th className="small fw-medium text-muted text-uppercase">Utilizador</th>
    <th className="small fw-medium text-muted text-uppercase">Último Login</th>
    <th className="small fw-medium text-muted text-uppercase text-end">Ações</th>
    </tr>
    </thead>
    <tbody>
    {filteredGestors.length === 0 ? (
      <tr>
      <td colSpan={5} className="text-center text-muted py-5">
      <UserCog size={42} className="mb-2 opacity-25" />
      <p className="mb-0">Nenhum gestor encontrado</p>
      </td>
      </tr>
    ) : (
      filteredGestors.map(gestor => (
        <tr key={gestor.id}>
        <td>
        <div className="fw-semibold">{gestor.name}</div>
        <div className="x-small text-muted">Desde {gestor.createdAt}</div>
        </td>
        <td>
        <div className="d-flex align-items-center gap-2 small mb-1">
        <Mail size={14} className="text-muted" /> {gestor.email}
        </div>
        <div className="d-flex align-items-center gap-2 small">
        <Phone size={14} className="text-muted" /> {gestor.phone}
        </div>
        </td>
        <td>
        <span className="d-inline-flex align-items-center gap-1 rounded-pill small fw-bold px-2 py-1"
        style={{ background: 'rgba(194,65,12,.1)', color: 'var(--kb-primary)' }}>
        <UserCog size={12} /> {gestor.username}
        </span>
        </td>
        <td className="small text-muted">{gestor.lastLogin || 'Nunca'}</td>
        <td>
        <div className="d-flex align-items-center justify-content-end gap-1">
        <button
        onClick={() => handleEdit(gestor)}
        className="btn btn-sm btn-link kb-icon p-1"
        title="Editar"
        >
        <Edit2 size={16} />
        </button>
        <button
        onClick={() => handleDelete(gestor.id)}
        className="btn btn-sm btn-link text-danger p-1"
        title="Eliminar"
        >
        <Trash2 size={16} />
        </button>
        </div>
        </td>
        </tr>
      ))
    )}
    </tbody>
    </table>
    </div>
    </div>

    {/* Summary Stats */}
    <div className="row g-3 mt-1">
    <div className="col-sm-4">
    <div className="bg-white border rounded-3 p-3">
    <div className="small text-muted mb-1">Total de Gestores</div>
    <div className="fs-3 fw-bold">{gestors.length}</div>
    </div>
    </div>
    <div className="col-sm-4">
    <div className="bg-white border rounded-3 p-3">
    <div className="small text-muted mb-1">Gestores Ativos</div>
    <div className="fs-3 fw-bold" style={{ color: '#16a34a' }}>
    {gestors.filter(g => g.lastLogin).length}
    </div>
    </div>
    </div>
    <div className="col-sm-4">
    <div className="bg-white border rounded-3 p-3">
    <div className="small text-muted mb-1">Novos este Mês</div>
    <div className="fs-3 fw-bold kb-brand">
    {gestors.filter(g => {
      const created = new Date(g.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length}
    </div>
    </div>
    </div>
    </div>

    {/* Modal */}
    {isDialogOpen && (
      <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={closeDialog}>
      <div className="modal-dialog modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
      <div className="modal-content">

      <div className="modal-header">
      <div>
      <h5 className="modal-title">{editingGestor ? 'Editar Gestor' : 'Novo Gestor'}</h5>
      <small className="text-muted">
      {editingGestor ? 'Atualize as informações do gestor' : 'Adicione um novo gestor ao sistema'}
      </small>
      </div>
      <button className="btn-close" onClick={closeDialog} />
      </div>

      <form onSubmit={handleSubmit}>
      <div className="modal-body">

      <div className="mb-3">
      <label className="form-label small fw-medium">Nome Completo *</label>
      <input
      type="text" required
      value={formData.name}
      onChange={e => setFormData({ ...formData, name: e.target.value })}
      className="form-control kb-input"
      placeholder="Nome do gestor"
      />
      </div>

      <div className="mb-3">
      <label className="form-label small fw-medium">Email *</label>
      <input
      type="email" required
      value={formData.email}
      onChange={e => setFormData({ ...formData, email: e.target.value })}
      className="form-control kb-input"
      placeholder="email@kikibyte.pt"
      />
      </div>

      <div className="mb-3">
      <label className="form-label small fw-medium">Telefone *</label>
      <input
      type="tel" required
      value={formData.phone}
      onChange={e => setFormData({ ...formData, phone: e.target.value })}
      className="form-control kb-input"
      placeholder="+351 912 345 678"
      />
      </div>

      <div className="mb-3">
      <label className="form-label small fw-medium">Nome de Utilizador *</label>
      <input
      type="text"
      required={!editingGestor}
      value={formData.username}
      onChange={e => setFormData({ ...formData, username: e.target.value })}
      className="form-control kb-input"
      placeholder="utilizador"
      disabled={!!editingGestor}
      />
      {editingGestor && (
        <small className="text-muted">O nome de utilizador não pode ser alterado</small>
      )}
      </div>

      <div className="mb-3">
      <label className="form-label small fw-medium">
      Palavra-passe {editingGestor ? '(deixe vazio para manter a atual)' : '*'}
      </label>
      <div className="position-relative">
      <input
      type={showPassword ? 'text' : 'password'}
      required={!editingGestor}
      value={formData.password}
      onChange={e => setFormData({ ...formData, password: e.target.value })}
      className="form-control kb-input"
      style={{ paddingRight: '2.5rem' }}
      placeholder="••••••••"
      />
      <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="btn btn-link position-absolute top-50 translate-middle-y text-muted p-0"
      style={{ right: '0.75rem' }}
      >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      </div>
      </div>

      </div>

      <div className="modal-footer">
      <button type="button" onClick={closeDialog} className="btn btn-outline-secondary flex-grow-1">
      Cancelar
      </button>
      <button type="submit" className="btn-kb-primary flex-grow-1 justify-content-center">
      {editingGestor ? 'Atualizar' : 'Criar'}
      </button>
      </div>
      </form>

      </div>
      </div>
      </div>
    )}
    </div>
  )
}
