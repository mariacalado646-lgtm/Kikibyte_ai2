import { useState, useEffect } from 'react'
import { Search, Eye, Download, FileText, Calendar, Plus, X } from 'lucide-react'

export function ReportsView() {
  const [reports, setReports]                 = useState([])
  const [clients, setClients]                 = useState([])
  const [searchTerm, setSearchTerm]           = useState('')
  const [filterYear, setFilterYear]           = useState('all')
  const [selectedReport, setSelectedReport]   = useState(null)
  const [isDialogOpen, setIsDialogOpen]       = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: '', year: new Date().getFullYear(), period: 'annual',
                                           summary: '', auditsCompleted: 0, issuesFound: 0,
                                           issuesResolved: 0, filesProcessed: 0, recommendations: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem('annual_reports')
    if (stored) setReports(JSON.parse(stored))
      const storedClients = localStorage.getItem('clients')
      if (storedClients) setClients(JSON.parse(storedClients).filter(c => !c.isDeleted))
  }, [])

  const resetForm = () => setFormData({
    clientId: '', year: new Date().getFullYear(), period: 'annual',
                                      summary: '', auditsCompleted: 0, issuesFound: 0,
                                      issuesResolved: 0, filesProcessed: 0, recommendations: ''
  })

  const handleCreateReport = (e) => {
    e.preventDefault()
    const client = clients.find(c => c.id === Number(formData.clientId))
    if (!client) {
      // toast.error('Cliente não encontrado')
      return
    }
    const newReport = {
      id: Date.now(),
      clientId: Number(formData.clientId),
      clientName: client.name,
      year: formData.year,
      period: formData.period,
      summary: formData.summary,
      auditsCompleted: formData.auditsCompleted,
      issuesFound: formData.issuesFound,
      issuesResolved: formData.issuesResolved,
      filesProcessed: formData.filesProcessed,
      recommendations: formData.recommendations,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: localStorage.getItem('admin_username') || 'admin'
    }
    const updated = [...reports, newReport]
    setReports(updated)
    localStorage.setItem('annual_reports', JSON.stringify(updated))
    // toast.success('Relatório criado com sucesso!')
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const handleDownloadReport = (report) => {
    const text = `
    RELATÓRIO ANUAL DE CIBERSEGURANÇA - ${report.year}
    KikiByte - Soluções de Cibersegurança

    Cliente: ${report.clientName}
    Período: ${report.period === 'annual' ? 'Anual' : report.period}
    Data: ${report.createdAt}

    RESUMO EXECUTIVO
    ${report.summary}

    ESTATÍSTICAS
    - Auditorias Realizadas: ${report.auditsCompleted}
    - Problemas Identificados: ${report.issuesFound}
    - Problemas Resolvidos: ${report.issuesResolved}
    - Ficheiros Processados: ${report.filesProcessed}
    - Taxa de Resolução: ${report.issuesFound > 0 ? ((report.issuesResolved / report.issuesFound) * 100).toFixed(1) : 0}%

    RECOMENDAÇÕES
    ${report.recommendations}

    ---
    Relatório gerado por: ${report.createdBy}
    Data de geração: ${new Date().toLocaleDateString('pt-PT')}
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${report.clientName.replace(/\s+/g, '_')}_${report.year}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    // toast.success('Relatório descarregado!')
  }

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    || r.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = filterYear === 'all' || r.year === Number(filterYear)
    return matchesSearch && matchesYear
  })

  const availableYears = Array.from(new Set(reports.map(r => r.year))).sort((a, b) => b - a)

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

    {/* Reports Grid */}
    <div className="row g-3">
    {filteredReports.map(report => (
      <div key={report.id} className="col-md-6">
      <div className="bg-white border rounded-3 shadow-sm p-3 h-100">

      <div className="d-flex align-items-start justify-content-between mb-3">
      <div className="d-flex align-items-center gap-3">
      <div className="kb-icon-box flex-shrink-0">
      <FileText size={22} className="kb-icon" />
      </div>
      <div>
      <h3 className="kb-card-title mb-1">{report.clientName}</h3>
      <p className="small text-muted d-flex align-items-center gap-1 mb-0">
      <Calendar size={13} />
      {report.year} • {report.period === 'annual' ? 'Anual' : report.period}
      </p>
      </div>
      </div>
      </div>

      <p className="small text-muted kb-clamp-2 mb-3">{report.summary}</p>

      <div className="row g-2 mb-3">
      <div className="col-6">
      <div className="rounded-3 p-2 bg-light">
      <p className="x-small text-muted mb-0">Auditorias</p>
      <p className="fw-bold mb-0">{report.auditsCompleted}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2 bg-light">
      <p className="x-small text-muted mb-0">Ficheiros</p>
      <p className="fw-bold mb-0">{report.filesProcessed}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2" style={{ background: '#f0fdf4' }}>
      <p className="x-small mb-0" style={{ color: '#15803d' }}>Resolvidos</p>
      <p className="fw-bold mb-0" style={{ color: '#15803d' }}>{report.issuesResolved}</p>
      </div>
      </div>
      <div className="col-6">
      <div className="rounded-3 p-2" style={{ background: '#eff6ff' }}>
      <p className="x-small mb-0" style={{ color: '#1d4ed8' }}>Taxa</p>
      <p className="fw-bold mb-0" style={{ color: '#1d4ed8' }}>
      {report.issuesFound > 0
        ? ((report.issuesResolved / report.issuesFound) * 100).toFixed(0)
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

    {filteredReports.length === 0 && (
      <div className="bg-white border rounded-3 shadow-sm text-center p-5">
      <FileText size={48} className="text-muted mx-auto mb-3" />
      <p className="text-muted mb-0">Nenhum relatório encontrado</p>
      </div>
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
      required value={formData.clientId}
      onChange={e => setFormData({ ...formData, clientId: e.target.value })}
      className="form-select kb-input"
      >
      <option value="">Selecione um cliente</option>
      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Ano *</label>
      <input
      type="number" required min="2020" max="2030"
      value={formData.year}
      onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Período *</label>
      <select
      required value={formData.period}
      onChange={e => setFormData({ ...formData, period: e.target.value })}
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
      type="number" min="0" value={formData.auditsCompleted}
      onChange={e => setFormData({ ...formData, auditsCompleted: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Problemas Identificados</label>
      <input
      type="number" min="0" value={formData.issuesFound}
      onChange={e => setFormData({ ...formData, issuesFound: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Problemas Resolvidos</label>
      <input
      type="number" min="0" value={formData.issuesResolved}
      onChange={e => setFormData({ ...formData, issuesResolved: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      <div className="col-md-6">
      <label className="form-label small fw-medium">Ficheiros Processados</label>
      <input
      type="number" min="0" value={formData.filesProcessed}
      onChange={e => setFormData({ ...formData, filesProcessed: Number(e.target.value) })}
      className="form-control kb-input"
      />
      </div>
      </div>

      <div className="mt-3">
      <label className="form-label small fw-medium">Resumo Executivo *</label>
      <textarea
      required rows={4} value={formData.summary}
      onChange={e => setFormData({ ...formData, summary: e.target.value })}
      placeholder="Descreva os principais resultados e conquistas do período..."
      className="form-control kb-input"
      style={{ resize: 'none' }}
      />
      </div>

      <div className="mt-3">
      <label className="form-label small fw-medium">Recomendações *</label>
      <textarea
      required rows={4} value={formData.recommendations}
      onChange={e => setFormData({ ...formData, recommendations: e.target.value })}
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
      <button type="submit" className="btn-kb-primary flex-grow-1 justify-content-center">
      Criar Relatório
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
      <h5 className="modal-title">Relatório Anual - {selectedReport.clientName}</h5>
      <small className="text-muted">Detalhes completos do relatório anual de segurança</small>
      </div>
      <button className="btn-close" onClick={() => setIsDialogOpen(false)} />
      </div>

      <div className="modal-body">

      <div className="bg-light rounded-3 p-3 mb-4">
      <div className="row g-3">
      <div className="col-md-4">
      <p className="small text-muted mb-1">Ano</p>
      <p className="fw-bold mb-0">{selectedReport.year}</p>
      </div>
      <div className="col-md-4">
      <p className="small text-muted mb-1">Período</p>
      <p className="fw-bold mb-0">{selectedReport.period === 'annual' ? 'Anual' : selectedReport.period}</p>
      </div>
      <div className="col-md-4">
      <p className="small text-muted mb-1">Criado em</p>
      <p className="fw-bold mb-0">{new Date(selectedReport.createdAt).toLocaleDateString('pt-PT')}</p>
      </div>
      </div>
      </div>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Estatísticas</h6>
      <div className="row g-2 mb-4">
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#eff6ff' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#1d4ed8' }}>{selectedReport.auditsCompleted}</p>
      <p className="small mb-0" style={{ color: '#2563eb' }}>Auditorias</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#fef2f2' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#b91c1c' }}>{selectedReport.issuesFound}</p>
      <p className="small mb-0" style={{ color: '#dc2626' }}>Problemas</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#f0fdf4' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#15803d' }}>{selectedReport.issuesResolved}</p>
      <p className="small mb-0" style={{ color: '#16a34a' }}>Resolvidos</p>
      </div>
      </div>
      <div className="col-6 col-md-3">
      <div className="text-center rounded-3 p-3" style={{ background: '#faf5ff' }}>
      <p className="fs-3 fw-bold mb-0" style={{ color: '#6b21a8' }}>{selectedReport.filesProcessed}</p>
      <p className="small mb-0" style={{ color: '#7e22ce' }}>Ficheiros</p>
      </div>
      </div>
      </div>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Resumo Executivo</h6>
      <p className="bg-light rounded-3 p-3 mb-4" style={{ lineHeight: 1.6 }}>{selectedReport.summary}</p>

      <h6 className="fw-bold border-bottom pb-2 mb-3">Recomendações</h6>
      <p className="bg-light rounded-3 p-3" style={{ lineHeight: 1.6 }}>{selectedReport.recommendations}</p>

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
