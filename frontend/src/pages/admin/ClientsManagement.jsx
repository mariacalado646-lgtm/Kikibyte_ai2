import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Mail, Phone } from 'lucide-react'
import { adminClienteService } from '../../services/adminservice'
import { utilizadorService } from '../../services/adminservice'

const INITIAL_FORM = { nome: '', email: '', telefone: '', nif: '', setor: '', morada: '' }

export function ClientsManagement() {
  const [clients, setClients]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [searchTerm, setSearchTerm]       = useState('')
  const [isDialogOpen, setIsDialogOpen]   = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData]           = useState(INITIAL_FORM)
  const [submitting, setSubmitting]       = useState(false)

  const carregarClientes = () => {
    setLoading(true)
    adminClienteService.listar({ ativo: true })
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregarClientes() }, [])

  const resetForm = () => {
    setEditingClient(null)
    setFormData(INITIAL_FORM)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingClient) {
        await adminClienteService.atualizar(editingClient.id_cliente, formData)
      } else {
        await adminClienteService.criar(formData)
      }
      carregarClientes()
      closeDialog()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao salvar cliente')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      nome:     client.nome || '',
      email:    client.email || '',
      telefone: client.telefone || '',
      nif:      client.nif || '',
      setor:    client.setor || '',
      morada:   client.morada || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (clientId) => {
    if (!confirm('Tem a certeza que deseja arquivar este cliente?')) return
    try {
      await adminClienteService.remover(clientId)
      carregarClientes()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao arquivar cliente')
    }
  }

  const filteredClients = clients.filter(c => {
    const q = searchTerm.toLowerCase()
    return (c.nome || '').toLowerCase().includes(q)
    || (c.email || '').toLowerCase().includes(q)
    || (c.nif || '').toLowerCase().includes(q)
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
    <th className="small fw-medium">Setor</th>
    <th className="small fw-medium">Email</th>
    <th className="small fw-medium">Telefone</th>
    <th className="small fw-medium">Estado</th>
    <th className="small fw-medium">Ações</th>
    </tr>
    </thead>
    <tbody>
    {loading ? (
      <tr><td colSpan={6} className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary" role="status"><span className="visually-hidden">A carregar...</span></div></td></tr>
    ) : (filteredClients.map(client => (
      <tr key={client.id_cliente}>
      <td>
      <div className="fw-medium">{client.nome}</div>
      <div className="small text-muted">NIF: {client.nif}</div>
      </td>
      <td>{client.setor || '-'}</td>
      <td>
      <a href={`mailto:${client.email}`} className="kb-brand text-decoration-none d-inline-flex align-items-center gap-1">
      <Mail size={13} /> {client.email}
      </a>
      </td>
      <td>
      <a href={`tel:${client.telefone}`} className="text-body text-decoration-none d-inline-flex align-items-center gap-1">
      <Phone size={13} /> {client.telefone}
      </a>
      </td>
      <td>
      <span className="d-inline-block rounded-pill small fw-medium px-2 py-1"
      style={{ background: client.ativo ? 'rgba(22,163,74,.1)' : 'rgba(239,68,68,.1)', color: client.ativo ? '#16a34a' : '#ef4444' }}>
      {client.ativo ? 'Ativo' : 'Inativo'}
      </span>
      </td>
      <td>
      <div className="d-flex align-items-center gap-1">
      <button onClick={() => handleEdit(client)} className="btn btn-sm btn-link kb-icon p-1" title="Editar">
      <Edit2 size={16} />
      </button>
      <button onClick={() => handleDelete(client.id_cliente)} className="btn btn-sm btn-link text-danger p-1" title="Arquivar">
      <Trash2 size={16} />
      </button>
      </div>
      </td>
      </tr>
    )))}
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
      type="text" required value={formData.nome}
      onChange={e => setFormData({ ...formData, nome: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Email</label>
      <input
      type="email" value={formData.email}
      onChange={e => setFormData({ ...formData, email: e.target.value })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Telefone</label>
      <input
      type="tel" value={formData.telefone}
      onChange={e => setFormData({ ...formData, telefone: e.target.value })}
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
      <label className="form-label small fw-medium">Setor</label>
      <input
      type="text" value={formData.setor}
      onChange={e => setFormData({ ...formData, setor: e.target.value })}
      className="form-control kb-input"
      placeholder="Ex: Banca, Saúde, Tecnologia"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Morada</label>
      <input
      type="text" value={formData.morada}
      onChange={e => setFormData({ ...formData, morada: e.target.value })}
      className="form-control kb-input"
      />
      </div>
    </div>

    </div>

    <div className="modal-footer">
    <button type="button" onClick={closeDialog} className="btn btn-outline-secondary flex-grow-1">
    Cancelar
    </button>
    <button type="submit" disabled={submitting} className="btn-kb-primary flex-grow-1 justify-content-center">
    {submitting ? 'A salvar...' : (editingClient ? 'Atualizar' : 'Criar Cliente')}
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
