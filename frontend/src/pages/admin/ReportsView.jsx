import { useState, useEffect } from 'react'
import { Search, Eye, Download, FileText, Calendar, Plus } from 'lucide-react'
import { relatorioAnualService, adminClienteService } from '../../services/adminservice'

export function ReportsView() {
  const [reports, setReports]                 = useState([])
  const [clients, setClients]                 = useState([])
  const [loading, setLoading]                 = useState(true)
  const [searchTerm, setSearchTerm]           = useState('')
  const [filterYear, setFilterYear]           = useState('all')
  const [selectedReport, setSelectedReport]   = useState(null)
  const [isDialogOpen, setIsDialogOpen]       = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [submitting, setSubmitting]           = useState(false)
  const [formData, setFormData] = useState({
    cliente_id: '', ano: new Date().getFullYear(), periodo: 'annual',
    resumo: '', auditorias: 0, problemas_encontrados: 0,
    problemas_resolvidos: 0, ficheiros_processados: 0, recomendacoes: ''
  })

  useEffect(() => {
    Promise.all([
      relatorioAnualService.listar(),
      adminClienteService.listar({ ativo: true })
    ])
    .then(([reportsData, clientsData]) => {
      setReports(reportsData)
      setClients(clientsData)
    })
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const resetForm = () => setFormData({
    cliente_id: '', ano: new Date().getFullYear(), periodo: 'annual',
    resumo: '', auditorias: 0, problemas_encontrados: 0,
    problemas_resolvidos: 0, ficheiros_processados: 0, recomendacoes: ''
  })

  const handleCreateReport = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await relatorioAnualService.criar(formData)
      const updated = await relatorioAnualService.listar()
      setReports(updated)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar relatório')
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const handleDownloadReport = (report) => {
    const text = `
    RELATÓRIO ANUAL DE CIBERSEGURANÇA - ${report.ano}
    KikiByte - Soluções de Cibersegurança

    Cliente: ${report.cliente?.nome || 'N/A'}
    Período: ${report.periodo === 'annual' ? 'Anual' : report.periodo}
    Data: ${report.created_at ? new Date(report.created_at).toLocaleDateString('pt-PT') : '-'}

    RESUMO EXECUTIVO
    ${report.resumo}

    ESTATÍSTICAS
    - Auditorias Realizadas: ${report.auditorias}
    - Problemas Identificados: ${report.problemas_encontrados}
    - Problemas Resolvidos: ${report.problemas_resolvidos}
    - Ficheiros Processados: ${report.ficheiros_processados}
    - Taxa de Resolução: ${report.problemas_encontrados > 0 ? ((report.problemas_resolvidos / report.problemas_encontrados) * 100).toFixed(1) : 0}%

    RECOMENDAÇÕES
    ${report.recomendacoes}

    ---
    Data de geração: ${new Date().toLocaleDateString('pt-PT')}
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${report.cliente?.nome?.replace(/\s+/g, '_') || 'cliente'}_${report.ano}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredReports = reports.filter(r => {
    const nomeCliente = r.cliente?.nome || ''
    const matchesSearch = nomeCliente.toLowerCase().includes(searchTerm.toLowerCase())
    || (r.resumo || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = filterYear === 'all' || r.ano === Number(filterYear)
    return matchesSearch && matchesYear
  })

  const availableYears = [...new Set(reports.map(r => r.ano))].sort((a, b) => b - a)

  return (
    <div className="p-4">

    <div className="mb-4">
    <h1 className="kb-section-title mb-2">Relatórios Anuais</h1>
    <p className="text-muted">Síntese anual do trabalho realizado com cada cliente</p>
    </div>

    {/* Filters and Actions */}
    <div className="bg-white border rounded-3 shadow-sm p-3 mb-4">
    <div className="d-flex flex-column flex-sm-row gap-3">

    <div className="kb-search-wrap flex-grow-1" style={{ maxWidth: 'none' }}>
    <Search size={18} className="kb-search-icon" />
    <input
    type="text"
    placeholder="Pesquisar relatórios..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="form-control kb-input kb-search-input"
    />
    </div>

    <select
    value={filterYear}
    onChange={e => setFilterYear(e.target.value)}
    className="form-select kb-input"
    style={{ width: 'auto' }}
    >
    <option value="all">Todos os Anos</option>
    {availableYears.map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
    </select>

    <button
    onClick={() => setIsCreateDialogOpen(true)}
    className="btn-kb-primary text-nowrap"
    >
    <Plus size={18} /> Novo Relatório
    </button>

    </div>
    </div>

    {loading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-2 mb-0">A carregar relatórios...</p>
      </div>
    ) : (
    <>
    {/* Reports Grid */}
    <div className="row g-3">
    {filteredReports.map(report => (
      <div key={report.id_relatorio_anual} className="col-md-6">
      <div className="bg-white border rounded-3 shadow-sm p-3 h-100">

      <div className="d-flex align-items-start justify-content-between mb-3">
      <div className="d-flex align-items-center gap-3">
      <div className="kb-icon-box flex-shrink-0">
      <FileText size={22} className="kb-icon" />
      </div>
      <div>
      <h3 className="kb-card-title mb-1">{report.cliente?.nome || 'N/A'}</h3>
      <p className="small text-muted d-flex align-items-center gap-1 mb-0">
      <Calendar size={13} />
      {report.ano} • {report.periodo === 'annual' ? 'Anual' : report.periodo}
      </p>
      </div>
      </div>
      </div>

      <p className="small text-muted kb-clamp-2 mb-3">{report.resumo}</p>

      <div className="row g-2 mb-3">
      <div className="col-6">
      <div className="rounded-3 p-2 bg-light">
      <p className="small text-muted mb-0">Auditorias</p>
      <p className="fw-bold mb-0">{report.auditorias}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2 bg-light">
      <p className="small text-muted mb-0">Ficheiros</p>
      <p className="fw-bold mb-0">{report.ficheiros_processados}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2" style={{ background: '#f0fdf4' }}>
      <p className="small mb-0" style={{ color: '#15803d' }}>Resolvidos</p>
      <p className="fw-bold mb-0" style={{ color: '#15803d' }}>{report.problemas_resolvidos}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2" style={{ background: '#eff6ff' }}>
      <p className="small mb-0" style={{ color: '#1d4ed8' }}>Taxa</p>
      <p className="fw-bold mb-0" style={{ color: '#1d4ed8' }}>
      {report.problemas_encontrados > 0
        ? ((report.problemas_resolvidos / report.problemas_encontrados) * 100).toFixed(0)
        : 0}%
        </p>
        </div>
        </div>
        </div>

        <div className="d-flex gap-2">
        <button
        onClick={() => handleViewReport(report)}
        className="btn btn-outline-secondary btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
        >
        <Eye size={14} /> Ver Detalhes
        </button>
        <button
        onClick={() => handleDownloadReport(report)}
        className="btn-kb-primary flex-grow-1 justify-content-center"
        style={{ padding: '.375rem .75rem', fontSize: '.875rem' }}
        >
        <Download size={14} /> Descarregar
        </button>
        </div>

        </div>
        </div>
    ))}
    </div>

    {filteredReports.length === 0 && !loading && (
      <div className="bg-white border rounded-3 shadow-sm text-center p-5">
      <FileText size={48} className="text-muted mx-auto mb-3" />
      <p className="text-muted mb-0">Nenhum relatório encontrado</p>
      </div>
    )}
    </>
    )}

    {/* Create Report Modal */}
    {isCreateDialogOpen && (
      <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={() => { setIsCreateDialogOpen(false); resetForm() }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
      <div className="modal-content">

      <div className="modal-header">
      <div>
      <h5 className="modal-title">Criar Relatório Anual</h5>
      <small className="text-muted">Preencha as informações para gerar um novo relatório anual</small>
      </div>
      <button className="btn-close" onClick={() => { setIsCreateDialogOpen(false); resetForm() }} />
      </div>

      <form onSubmit={handleCreateReport}>
      <div className="modal-body">

      <div className="row g-3">
      <div className="col-md-6">
      <label className="form-label small fw-medium">Cliente *</label>
      <select
      required value={formData.cliente_id}
      onChange={e => setFormData({ ...formData, cliente_id: e.target.value })}
      className="form-select kb-input"
      >
      <option value="">Selecione um cliente</option>
      {clients.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nome}</option>)}
      </select>
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Ano *</label>
      <input
      type="number" required min="2020" max="2030"
      value={formData.ano}
      onChange={e => setFormData({ ...formData, ano: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Período *</label>
      <select
      required value={formData.periodo}
      onChange={e => setFormData({ ...formData, periodo: e.target.value })}
      className="form-select kb-input"
      >
      <option value="annual">Anual</option>
      <option value="Q1">1º Trimestre</option>
      <option value="Q2">2º Trimestre</option>
      <option value="Q3">3º Trimestre</option>
      <option value="Q4">4º Trimestre</option>
      </select>
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Auditorias Realizadas</label>
      <input
      type="number" min="0" value={formData.auditorias}
      onChange={e => setFormData({ ...formData, auditorias: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Problemas Identificados</label>
      <input
      type="number" min="0" value={formData.problemas_encontrados}
      onChange={e => setFormData({ ...formData, problemas_encontrados: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Problemas Resolvidos</label>
      <input
      type="number" min="0" value={formData.problemas_resolvidos}
      onChange={e => setFormData({ ...formData, problemas_resolvidos: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Ficheiros Processados</label>
      <input
      type="number" min="0" value={formData.ficheiros_processados}
      onChange={e => setFormData({ ...formData, ficheiros_processados: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      </div>

      <div className="mt-3">
      <label className="form-label small fw-medium">Resumo Executivo *</label>
      <textarea
      required rows={4} value={formData.resumo}
      onChange={e => setFormData({ ...formData, resumo: e.target.value })}
      placeholder="Descreva os principais resultados e conquistas do período..."
      className="form-control kb-input"
      style={{ resize: 'none' }}
      />
      </div>

      <div className="mt-3">
      <label className="form-label small fw-medium">Recomendações *</label>
      <textarea
      required rows={4} value={formData.recomendacoes}
      onChange={e => setFormData({ ...formData, recomendacoes: e.target.value })}
      placeholder="Adicione recomendações para o próximo período..."
      className="form-control kb-input"
      style={{ resize: 'none' }}
      />
      </div>

      </div>

      <div className="modal-footer">
      <button
      type="button"
      onClick={() => { setIsCreateDialogOpen(false); resetForm() }}
      className="btn btn-outline-secondary flex-grow-1"
      >
      Cancelar
      </button>
      <button type="submit" disabled={submitting} className="btn-kb-primary flex-grow-1 justify-content-center">
      {submitting ? 'A salvar...' : 'Criar Relatório'}
      </button>
      </div>
      </form>

      </div>
      </div>
      </div>
    )}

    {/* View Report Modal */}
    {isDialogOpen && selectedReport && (
      <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={() => setIsDialogOpen(false)}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
      <div className="modal-content">

      <div className="modal-header">
      <div>
      <h5 className="modal-title">Relatório Anual - {selectedReport.cliente?.nome || 'N/A'}</h5>
      <small className="text-muted">Detalhes completos do relatório anual de segurança</small>
      </div>
      <button className="btn-close" onClick={() => setIsDialogOpen(false)} />
      </div>

      <div className="modal-body">

      <div className="bg-light rounded-3 p-3 mb-4">
      <div className="row g-3">
      <div className="col-md-4">
      <p className="small text-muted mb-1">Ano</p>
      <p className="fw-bold mb-0">{selectedReport.ano}</p>
      </div>
      <div className="col-md-4">
      <p className="small text-muted mb-1">Período</p>
      <p className="fw-bold mb-0">{selectedReport.periodo === 'annual' ? 'Anual' : selectedReport.periodo}</p>
      </div>
      <div className="col-md-4">
      <p className="small text-muted mb-1">Criado em</p>
      <p className="fw-bold mb-0">{selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleDateString('pt-PT') : '-'}</p>
      </div>
      </div>
      </div>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Estatísticas</h6>
      <div className="row g-2 mb-4">
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#eff6ff' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#1d4ed8' }}>{selectedReport.auditorias}</p>
      <p className="small mb-0" style={{ color: '#2563eb' }}>Auditorias</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#fef2f2' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#b91c1c' }}>{selectedReport.problemas_encontrados}</p>
      <p className="small mb-0" style={{ color: '#dc2626' }}>Problemas</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#f0fdf4' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#15803d' }}>{selectedReport.problemas_resolvidos}</p>
      <p className="small mb-0" style={{ color: '#16a34a' }}>Resolvidos</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#faf5ff' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#6b21a8' }}>{selectedReport.ficheiros_processados}</p>
      <p className="small mb-0" style={{ color: '#7e22ce' }}>Ficheiros</p>
      </div>
      </div>
      </div>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Resumo Executivo</h6>
      <p className="bg-light rounded-3 p-3 mb-4" style={{ lineHeight: 1.6 }}>{selectedReport.resumo}</p>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Recomendações</h6>
      <p className="bg-light rounded-3 p-3" style={{ lineHeight: 1.6 }}>{selectedReport.recomendacoes}</p>

      </div>

      <div className="modal-footer">
      <button
      onClick={() => handleDownloadReport(selectedReport)}
      className="btn-kb-primary flex-grow-1 justify-content-center"
      >
      <Download size={18} /> Descarregar Relatório
      </button>
      <button
      onClick={() => setIsDialogOpen(false)}
      className="btn btn-outline-secondary flex-grow-1"
      >
      Fechar
      </button>
      </div>

      </div>
      </div>
      </div>
    )}
    </div>
  )
}
