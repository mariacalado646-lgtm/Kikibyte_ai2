import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Mail, Phone } from 'lucide-react'

const INITIAL_FORM = { name: '', contact: '', email: '', phone: '', plan: 'Basic', nif: '', password: '' }

const MOCK_CLIENTS = [
  { id: 1, name: 'TechCorp SA',     contact: 'João Silva',   email: 'joao@techcorp.pt',     phone: '+351 912345678', plan: 'Enterprise',   nif: '501234567', password: 'demo123', createdAt: '2026-01-15' },
{ id: 2, name: 'DataSystems Ltd', contact: 'Maria Santos', email: 'maria@datasystems.pt', phone: '+351 923456789', plan: 'Professional', nif: '502345678', password: 'demo123', createdAt: '2026-02-10' },
{ id: 3, name: 'SecureBank',      contact: 'Pedro Costa',  email: 'pedro@securebank.pt',  phone: '+351 934567890', plan: 'Enterprise',   nif: '503456789', password: 'demo123', createdAt: '2026-03-01' },
]

export function ClientsManagement() {
  const [clients, setClients]             = useState([])
  const [searchTerm, setSearchTerm]       = useState('')
  const [isDialogOpen, setIsDialogOpen]   = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData]           = useState(INITIAL_FORM)

  useEffect(() => {
    const stored = localStorage.getItem('clients')
    if (stored) {
      setClients(JSON.parse(stored).filter(c => !c.isDeleted))
    } else {
      setClients(MOCK_CLIENTS)
      localStorage.setItem('clients', JSON.stringify(MOCK_CLIENTS))
    }
  }, [])

  const resetForm = () => {
    setEditingClient(null)
    setFormData(INITIAL_FORM)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const all = JSON.parse(localStorage.getItem('clients') || '[]')

    if (editingClient) {
      const updated = all.map(c => {
        if (c.id !== editingClient.id) return c
          const merged = { ...c, ...formData }
          if (!formData.password) merged.password = c.password
            return merged
      })
      localStorage.setItem('clients', JSON.stringify(updated))
      setClients(updated.filter(c => !c.isDeleted))
      // toast.success('Cliente atualizado com sucesso!')
    } else {
      const newClient = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      const updated = [...all, newClient]
      localStorage.setItem('clients', JSON.stringify(updated))
      setClients(updated.filter(c => !c.isDeleted))
      // toast.success('Cliente criado com sucesso!')
    }
    closeDialog()
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name:     client.name,
      contact:  client.contact,
      email:    client.email,
      phone:    client.phone,
      plan:     client.plan,
      nif:      client.nif,
      password: ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (clientId) => {
    if (!confirm('Tem a certeza que deseja arquivar este cliente?')) return
      const all = JSON.parse(localStorage.getItem('clients') || '[]')
      const updated = all.map(c => c.id === clientId ? { ...c, isDeleted: true } : c)
      localStorage.setItem('clients', JSON.stringify(updated))
      setClients(updated.filter(c => !c.isDeleted))
      // toast.success('Cliente arquivado com sucesso!')
  }

  const filteredClients = clients.filter(c => {
    const q = searchTerm.toLowerCase()
    return c.name.toLowerCase().includes(q)
    || c.contact.toLowerCase().includes(q)
    || c.email.toLowerCase().includes(q)
  })

  return (
    <div className="p-4">

    <div className="mb-4">
    <h1 className="kb-section-title mb-2">Gestão de Clientes</h1>
    <p className="text-muted">Gerir e contactar clientes da KikiByte</p>
    </div>

    {/* Actions Bar */}
    <div className="bg-white border rounded-3 shadow-sm p-3 mb-4">
    <div className="d-flex flex-column flex-sm-row align-items-stretch gap-3">

    <div className="kb-search-wrap flex-grow-1" style={{ maxWidth: 'none' }}>
    <Search size={18} className="kb-search-icon" />
    <input
    type="text"
    placeholder="Pesquisar clientes..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="form-control kb-input kb-search-input"
    />
    </div>

    <button onClick={() => setIsDialogOpen(true)} className="btn-kb-primary text-nowrap">
    <Plus size={18} /> Novo Cliente
    </button>

    </div>
    </div>

    {/* Clients Table */}
    <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
    <div className="table-responsive">
    <table className="table mb-0 align-middle">
    <thead className="bg-light">
    <tr>
    <th className="small fw-medium">Empresa</th>
    <th className="small fw-medium">Contacto</th>
    <th className="small fw-medium">Email</th>
    <th className="small fw-medium">Telefone</th>
    <th className="small fw-medium">Plano</th>
    <th className="small fw-medium">Ações</th>
    </tr>
    </thead>
    <tbody>
    {filteredClients.map(client => (
      <tr key={client.id}>
      <td>
      <div className="fw-medium">{client.name}</div>
      <div className="x-small text-muted">NIF: {client.nif}</div>
      </td>
      <td>{client.contact}</td>
      <td>
      <a href={`mailto:${client.email}`} className="kb-brand text-decoration-none d-inline-flex align-items-center gap-1">
      <Mail size={13} /> {client.email}
      </a>
      </td>
      <td>
      <a href={`tel:${client.phone}`} className="text-body text-decoration-none d-inline-flex align-items-center gap-1">
      <Phone size={13} /> {client.phone}
      </a>
      </td>
      <td>
      <span className="d-inline-block rounded-pill small fw-medium px-2 py-1"
      style={{ background: 'rgba(194,65,12,.1)', color: 'var(--kb-primary)' }}>
      {client.plan}
      </span>
      </td>
      <td>
      <div className="d-flex align-items-center gap-1">
      <button onClick={() => handleEdit(client)} className="btn btn-sm btn-link kb-icon p-1" title="Editar">
      <Edit2 size={16} />
      </button>
      <button onClick={() => handleDelete(client.id)} className="btn btn-sm btn-link text-danger p-1" title="Arquivar">
      <Trash2 size={16} />
      </button>
      </div>
      </td>
      </tr>
    ))}
    </tbody>
    </table>
    </div>

    {filteredClients.length === 0 && (
      <div className="text-center py-5">
      <p className="text-muted mb-0">Nenhum cliente encontrado</p>
      </div>
    )}
    </div>

    {/* Modal */}
    {isDialogOpen && (
      <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={closeDialog}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
      <div className="modal-content">

      <div className="modal-header">
      <div>
      <h5 className="modal-title">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h5>
      <small className="text-muted">
      {editingClient ? 'Atualize as informações do cliente' : 'Adicione um novo cliente ao sistema'}
      </small>
      </div>
      <button className="btn-close" onClick={closeDialog} />
      </div>

      <form onSubmit={handleSubmit}>
      <div className="modal-body">

      <div className="row g-3">
      <div className="col-md-6">
      <label className="form-label small fw-medium">Nome da Empresa *</label>
      <input
      type="text" required value={formData.name}
      onChange={e => setFormData({ ...formData, name: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Pessoa de Contacto *</label>
      <input
      type="text" required value={formData.contact}
      onChange={e => setFormData({ ...formData, contact: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Email *</label>
      <input
      type="email" required value={formData.email}
      onChange={e => setFormData({ ...formData, email: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Telefone *</label>
      <input
      type="tel" required value={formData.phone}
      onChange={e => setFormData({ ...formData, phone: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">NIF</label>
      <input
      type="text" value={formData.nif}
      onChange={e => setFormData({ ...formData, nif: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Plano *</label>
      <select
      required value={formData.plan}
      onChange={e => setFormData({ ...formData, plan: e.target.value })}
      className="form-select kb-input"
      >
      <option value="Basic">Basic</option>
      <option value="Professional">Professional</option>
      <option value="Enterprise">Enterprise</option>
      </select>
      </div>
      <div className="col-12">
      <label className="form-label small fw-medium">
      Palavra-passe {!editingClient && '*'}
      </label>
      <input
      type="password"
      required={!editingClient}
      value={formData.password}
      onChange={e => setFormData({ ...formData, password: e.target.value })}
      placeholder={editingClient ? 'Deixar em branco para manter' : ''}
      className="form-control kb-input"
      />
      <small className="text-muted">
      {editingClient
        ? 'Deixe em branco para manter a palavra-passe atual'
    : 'Para acesso ao portal de cliente'}
    </small>
    </div>
    </div>

    </div>

    <div className="modal-footer">
    <button type="button" onClick={closeDialog} className="btn btn-outline-secondary flex-grow-1">
    Cancelar
    </button>
    <button type="submit" className="btn-kb-primary flex-grow-1 justify-content-center">
    {editingClient ? 'Atualizar' : 'Criar Cliente'}
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
