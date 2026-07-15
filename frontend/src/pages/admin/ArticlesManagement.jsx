import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, FileText, Eye, EyeOff, Image } from 'lucide-react'
import { artigoAdminService } from '../../services/adminservice'
import { fetchCategorias } from '../../services/newsService'
import { toast } from 'sonner'

const INITIAL_FORM = {
  titulo: '',
  resumo: '',
  conteudo: '',
  id_categoria: '',
  imagem_capa_base64: '',
  estado: 'rascunho'
}

export function ArticlesManagement() {
  const [artigos, setArtigos]             = useState([])
  const [categorias, setCategorias]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [searchTerm, setSearchTerm]       = useState('')
  const [filterEstado, setFilterEstado]   = useState('')
  const [isDialogOpen, setIsDialogOpen]   = useState(false)
  const [editingArtigo, setEditingArtigo] = useState(null)
  const [formData, setFormData]           = useState(INITIAL_FORM)
  const [submitting, setSubmitting]       = useState(false)
  const [showPreview, setShowPreview]     = useState(false)

  const carregarArtigos = () => {
    setLoading(true)
    const params = {}
    if (filterEstado) params.estado = filterEstado
    artigoAdminService.listar(params)
      .then(setArtigos)
      .catch(() => { toast.error('Erro ao carregar artigos'); setArtigos([]) })
      .finally(() => setLoading(false))
  }

  const carregarCategorias = () => {
    fetchCategorias()
      .then(setCategorias)
      .catch(() => {})
  }

  useEffect(() => {
    carregarArtigos()
    carregarCategorias()
  }, [filterEstado])

  const resetForm = () => {
    setFormData(INITIAL_FORM)
    setShowPreview(false)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingArtigo(null)
    resetForm()
  }

  const handleEdit = (artigo) => {
    setEditingArtigo(artigo)
    setFormData({
      titulo: artigo.titulo || '',
      resumo: artigo.resumo || '',
      conteudo: artigo.conteudo || '',
      id_categoria: artigo.id_categoria || '',
      imagem_capa_base64: artigo.imagem_capa_base64 || '',
      estado: artigo.estado || 'rascunho'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja eliminar este artigo?')) return
    try {
      await artigoAdminService.remover(id)
      toast.success('Artigo eliminado com sucesso')
      carregarArtigos()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao eliminar artigo')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titulo.trim() || !formData.conteudo.trim()) {
      toast.error('Título e conteúdo são obrigatórios')
      return
    }
    setSubmitting(true)
    try {
      if (editingArtigo) {
        await artigoAdminService.atualizar(editingArtigo.id_artigo, formData)
        toast.success('Artigo atualizado com sucesso!')
      } else {
        await artigoAdminService.criar(formData)
        toast.success('Artigo criado com sucesso!')
      }
      carregarArtigos()
      closeDialog()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar artigo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem não pode exceder 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormData({ ...formData, imagem_capa_base64: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const filteredArtigos = artigos.filter(a => {
    const q = searchTerm.toLowerCase()
    return (a.titulo || '').toLowerCase().includes(q) ||
           (a.resumo || '').toLowerCase().includes(q)
  })

  const getEstadoBadge = (estado) => {
    if (estado === 'publicado') {
      return <span className="badge" style={{ background: '#16a34a' }}>Publicado</span>
    }
    return <span className="badge bg-secondary">Rascunho</span>
  }

  return (
    <div className="p-4">

      <div className="mb-4">
        <h1 className="kb-section-title mb-2">Gestão de Artigos / Notícias</h1>
        <p className="text-muted">Gerir artigos e notícias do site</p>
      </div>

      {/* Header Actions */}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="kb-search-wrap flex-grow-1" style={{ maxWidth: 'none' }}>
          <Search size={18} className="kb-search-icon" />
          <input
            type="text"
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-control kb-input kb-search-input"
          />
        </div>
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="form-select kb-input"
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="">Todos os estados</option>
          <option value="rascunho">Rascunho</option>
          <option value="publicado">Publicado</option>
        </select>
        <button onClick={() => { resetForm(); setIsDialogOpen(true) }} className="btn-kb-primary text-nowrap">
          <Plus size={18} /> Novo Artigo
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th className="small fw-medium text-muted text-uppercase">Artigo</th>
                <th className="small fw-medium text-muted text-uppercase">Categoria</th>
                <th className="small fw-medium text-muted text-uppercase">Estado</th>
                <th className="small fw-medium text-muted text-uppercase">Publicado em</th>
                <th className="small fw-medium text-muted text-uppercase text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary" role="status"><span className="visually-hidden">A carregar...</span></div></td></tr>
              ) : (filteredArtigos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-5">
                    <FileText size={42} className="mb-2 opacity-25" />
                    <p className="mb-0">Nenhum artigo encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredArtigos.map(artigo => (
                  <tr key={artigo.id_artigo}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {artigo.imagem_capa_base64 ? (
                          <img
                            src={artigo.imagem_capa_base64}
                            alt=""
                            style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 28, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image size={14} className="text-muted" />
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{artigo.titulo}</div>
                          <div className="small text-muted">{artigo.resumo ? artigo.resumo.substring(0, 60) + (artigo.resumo.length > 60 ? '...' : '') : '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="small text-muted">
                        {artigo.categoria_artigo?.nome || '-'}
                      </span>
                    </td>
                    <td>{getEstadoBadge(artigo.estado)}</td>
                    <td className="small text-muted">
                      {artigo.published_at ? new Date(artigo.published_at).toLocaleDateString('pt-PT') : '-'}
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <button
                          onClick={() => handleEdit(artigo)}
                          className="btn btn-sm btn-link kb-icon p-1"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(artigo.id_artigo)}
                          className="btn btn-sm btn-link text-danger p-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="row g-3 mt-1">
        <div className="col-sm-4">
          <div className="bg-white border rounded-3 p-3">
            <div className="small text-muted mb-1">Total de Artigos</div>
            <div className="fs-3 fw-bold">{artigos.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="bg-white border rounded-3 p-3">
            <div className="small text-muted mb-1">Publicados</div>
            <div className="fs-3 fw-bold" style={{ color: '#16a34a' }}>
              {artigos.filter(a => a.estado === 'publicado').length}
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="bg-white border rounded-3 p-3">
            <div className="small text-muted mb-1">Rascunhos</div>
            <div className="fs-3 fw-bold" style={{ color: '#c2410c' }}>
              {artigos.filter(a => a.estado === 'rascunho').length}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={closeDialog}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">

              <div className="modal-header">
                <div>
                  <h5 className="modal-title">{editingArtigo ? 'Editar Artigo' : 'Novo Artigo'}</h5>
                  <small className="text-muted">
                    {editingArtigo ? 'Atualize as informações do artigo' : 'Crie um novo artigo ou notícia'}
                  </small>
                </div>
                <button className="btn-close" onClick={closeDialog} />
              </div>

              <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Título *</label>
                    <input
                      type="text" required
                      value={formData.titulo}
                      onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                      className="form-control kb-input"
                      placeholder="Título do artigo"
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Categoria</label>
                      <select
                        value={formData.id_categoria}
                        onChange={e => setFormData({ ...formData, id_categoria: e.target.value })}
                        className="form-select kb-input"
                      >
                        <option value="">Sem categoria</option>
                        {categorias.map(cat => (
                          <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Estado</label>
                      <select
                        value={formData.estado}
                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                        className="form-select kb-input"
                      >
                        <option value="rascunho">Rascunho</option>
                        <option value="publicado">Publicado</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Resumo</label>
                    <textarea
                      value={formData.resumo}
                      onChange={e => setFormData({ ...formData, resumo: e.target.value })}
                      className="form-control kb-input"
                      rows={2}
                      placeholder="Breve resumo do artigo (opcional)"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Conteúdo *</label>
                    <textarea
                      required
                      value={formData.conteudo}
                      onChange={e => setFormData({ ...formData, conteudo: e.target.value })}
                      className="form-control kb-input"
                      rows={8}
                      placeholder="Escreva o conteúdo do artigo aqui... Pode usar HTML básico."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Imagem de Capa</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control kb-input"
                    />
                    <small className="text-muted">Formatos: PNG, JPG. Máx: 5MB</small>
                    {formData.imagem_capa_base64 && (
                      <div className="mt-2 position-relative d-inline-block">
                        <img
                          src={formData.imagem_capa_base64}
                          alt="Preview"
                          style={{ maxHeight: 120, borderRadius: 6, border: '1px solid #ddd' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imagem_capa_base64: '' })}
                          className="btn btn-sm btn-outline-danger ms-2"
                          style={{ verticalAlign: 'top' }}
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button type="button" onClick={closeDialog} className="btn btn-outline-secondary flex-grow-1">
                      Cancelar
                    </button>
                    <button type="submit" disabled={submitting} className="btn-kb-primary flex-grow-1 justify-content-center">
                      {submitting ? 'A salvar...' : (editingArtigo ? 'Atualizar' : 'Criar')}
                    </button>
                  </div>
                </form>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
