import { useState, useEffect } from 'react'
import { CheckCircle2, Shield, FileText, Lock, Info, Building2, AlertTriangle, Users, Calendar } from 'lucide-react'
import { api } from '../services/api'

export function Compliance() {
  const [isNIS2DialogOpen, setIsNIS2DialogOpen] = useState(false)
  const [complianceData, setComplianceData] = useState(null)

  useEffect(() => {
    api.get('/empresas/public')
      .then(r => {
        const cfg = r.data?.site_config
        if (cfg?.compliance) setComplianceData(cfg.compliance)
      })
      .catch(() => {})
  }, [])

  const nis2Features = complianceData?.features ?? [
    'Gestão de riscos de cibersegurança', 'Tratamento de incidentes',
    'Continuidade das operações e gestão de crises', 'Segurança da cadeia de abastecimento',
    'Criptografia e segurança de comunicações', 'Controlo de acesso e gestão de ativos'
  ]
  const cncsGuidelines = complianceData?.guidelines ?? [
    'Implementação de políticas de segurança robustas', 'Monitorização contínua de sistemas críticos',
    'Resposta rápida a incidentes de segurança', 'Formação contínua de equipas',
    'Auditoria e avaliação regular de riscos', 'Conformidade com standards nacionais'
  ]

  return (
    <section id="compliance" className="py-5 bg-white">
    <div className="container py-4">
    <div className="text-center mb-5">
    <h2 className="kb-section-title">Conformidade & <span className="kb-brand">Certificações</span></h2>
    <p className="kb-section-sub">
    Estamos totalmente alinhados com as diretrizes europeias e nacionais de cibersegurança, garantindo que os seus sistemas cumpram todos os requisitos legais e regulamentares.
    </p>
    </div>

    <div className="row g-4 mb-4">
    {/* NIS2 Card */}
    <div className="col-lg-6">
    <div className="kb-compliance-card h-100">
    <div className="d-flex align-items-start gap-3 mb-4">
    <div className="kb-icon-box-primary flex-shrink-0">
    <Shield size={32} color="white" />
    </div>
    <div className="flex-grow-1">
    <div className="d-flex align-items-center justify-content-between gap-2">
    <div>
    <h3 className="kb-card-title mb-0">Diretiva NIS2</h3>
    <small className="text-muted">Diretiva (UE) 2022/2555</small>
    </div>
    <button className="btn-kb-outline-sm d-flex align-items-center gap-1" onClick={() => setIsNIS2DialogOpen(true)}>
    <Info size={14} /> Ver mais
    </button>
    </div>
    </div>
    </div>
    <p className="text-muted mb-4">A Diretiva NIS2 estabelece medidas para um elevado nível comum de cibersegurança em toda a União Europeia. Ajudamos a sua empresa a cumprir todos os requisitos:</p>
    <ul className="list-unstyled d-flex flex-column gap-2">
    {nis2Features.map((f, i) => (
      <li key={i} className="d-flex align-items-start gap-2">
      <CheckCircle2 size={18} className="kb-icon flex-shrink-0 mt-1" />
      <span>{f}</span>
      </li>
    ))}
    </ul>
    </div>
    </div>

    {/* CNCS Card */}
    <div className="col-lg-6">
    <div className="kb-compliance-card-accent h-100">
    <div className="d-flex align-items-start gap-3 mb-4">
    <div className="kb-icon-box-accent flex-shrink-0">
    <FileText size={32} color="white" />
    </div>
    <div>
    <h3 className="kb-card-title mb-0">CNCS</h3>
    <small className="text-muted">Centro Nacional de Cibersegurança</small>
    </div>
    </div>
    <p className="text-muted mb-4">Seguimos rigorosamente as orientações do CNCS, a autoridade nacional competente em matéria de cibersegurança em Portugal:</p>
    <ul className="list-unstyled d-flex flex-column gap-2">
    {cncsGuidelines.map((g, i) => (
      <li key={i} className="d-flex align-items-start gap-2">
      <CheckCircle2 size={18} style={{ color: 'var(--kb-accent)' }} className="flex-shrink-0 mt-1" />
      <span>{g}</span>
      </li>
    ))}
    </ul>
    </div>
    </div>
    </div>

    {/* Banner */}
    <div className="kb-banner text-center text-white p-5 rounded-4">
    <Lock size={48} className="mb-3" />
    <h3 className="fw-bold mb-3">Conformidade Garantida</h3>
    <p className="mb-4 opacity-90 mx-auto" style={{ maxWidth: 600 }}>
    Com a KikiByte, a sua empresa está sempre em conformidade com as mais recentes regulamentações de cibersegurança, evitando multas e protegendo a sua reputação.
    </p>
    <button className="kb-banner-btn" onClick={() => {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }}>
    Agende uma auditoria
    </button>
    </div>
    </div>

    {/* NIS2 Bootstrap Modal */}
    {isNIS2DialogOpen && (
      <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }} onClick={() => setIsNIS2DialogOpen(false)}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
      <div className="modal-content">

      <div className="modal-header">
      <h5 className="modal-title d-flex align-items-center gap-2">
      <Shield size={24} className="kb-icon" /> Diretiva NIS2 - Informação Detalhada
      </h5>
      <button className="btn-close" onClick={() => setIsNIS2DialogOpen(false)} />
      </div>

      <div className="modal-body">
      {/* Introduction */}
      <div className="p-4 rounded-3 mb-4" style={{ background: 'rgba(194,65,12,.05)', border: '1px solid rgba(194,65,12,.2)' }}>
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Info size={16} className="kb-icon" /> O que é a NIS2?</h6>
      <p>A <strong>Diretiva NIS2 (Network and Information Security Directive 2)</strong> é a atualização da diretiva original NIS de 2016, estabelecendo um quadro legislativo mais robusto para garantir a cibersegurança em toda a União Europeia.</p>
      <p className="mb-0">Publicada em <strong>27 de dezembro de 2022</strong>, a NIS2 entrou em vigor a <strong>16 de janeiro de 2023</strong>, e os Estados-Membros têm até <strong>17 de outubro de 2024</strong> para transpor a diretiva para a legislação nacional.</p>
      </div>

      {/* Objectives */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><AlertTriangle size={16} className="kb-icon" /> Objetivos Principais</h6>
      <div className="row g-3 mb-4">
      {[
        { title: 'Harmonização', desc: 'Criar um nível uniforme de cibersegurança em todos os Estados-Membros da UE' },
        { title: 'Resiliência',  desc: 'Aumentar a resiliência das infraestruturas críticas e serviços essenciais' },
        { title: 'Cooperação',  desc: 'Reforçar a cooperação entre Estados-Membros e autoridades competentes' },
        { title: 'Responsabilização', desc: 'Aumentar a responsabilidade dos órgãos de gestão e administração' },
      ].map((obj, i) => (
        <div key={i} className="col-md-6">
        <div className="border rounded-3 p-3">
        <CheckCircle2 size={20} className="kb-icon mb-2" />
        <div className="fw-semibold mb-1">{obj.title}</div>
        <p className="text-muted small mb-0">{obj.desc}</p>
        </div>
        </div>
      ))}
      </div>

      {/* Affected entities */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Building2 size={16} className="kb-icon" /> Quem é Afetado?</h6>
      <div className="p-4 rounded-3 mb-4" style={{ background: 'rgba(194,65,12,.03)' }}>
      <p>A NIS2 expande significativamente o âmbito da diretiva original, abrangendo agora <strong>18 setores críticos</strong>:</p>
      <div className="row g-3">
      {[
        { title: 'Alta Criticidade', items: ['Energia','Transportes','Saúde','Infraestrutura digital','Água potável','Águas residuais','Espaço','Administração Pública'] },
        { title: 'Outros Setores',   items: ['Serviços postais','Gestão de resíduos','Produção química','Produção alimentar','Dispositivos médicos'] },
        { title: 'Setores Digitais', items: ['Fornecedores de serviços digitais','Mercados online','Motores de pesquisa','Redes sociais','Cloud computing'] },
      ].map((col, i) => (
        <div key={i} className="col-md-4">
        <div className="bg-white border rounded-3 p-3 small">
        <strong>{col.title}:</strong>
        <ul className="mt-2 mb-0 text-muted ps-3">
        {col.items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
        </div>
        </div>
      ))}
      </div>
      </div>

      {/* Requirements */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Users size={16} className="kb-icon" /> Principais Requisitos</h6>
      <div className="d-flex flex-column gap-3 mb-4">
      {[
        { title: '1. Medidas de Gestão de Riscos', desc: 'Implementação de medidas técnicas, operacionais e organizacionais adequadas e proporcionadas para gerir riscos de cibersegurança, incluindo políticas de análise de risco, gestão de incidentes, continuidade de negócio, segurança da cadeia de abastecimento, e criptografia.' },
        { title: '2. Notificação de Incidentes',   desc: 'Obrigação de reportar incidentes significativos às autoridades competentes: alerta inicial em 24 horas, notificação em 72 horas, e relatório final em 1 mês.' },
        { title: '3. Responsabilidade da Gestão', desc: 'Os membros dos órgãos de gestão são diretamente responsáveis pela supervisão das medidas de cibersegurança, devendo aprovar medidas, supervisar a sua implementação, e participar em formações.' },
        { title: '4. Segurança da Cadeia de Abastecimento', desc: 'Avaliação de riscos de cibersegurança relacionados com fornecedores e prestadores de serviços, garantindo a segurança de toda a cadeia de fornecimento.' },
      ].map((req, i) => (
        <div key={i} className="p-3 rounded-3 border-start border-3 bg-white" style={{ borderColor: 'var(--kb-primary) !important' }}>
        <div className="fw-semibold mb-1">{req.title}</div>
        <p className="text-muted small mb-0">{req.desc}</p>
        </div>
      ))}
      </div>

      {/* Penalties */}
      <div className="p-4 rounded-3 mb-4 border" style={{ background: '#fff5f5', borderColor: '#fca5a5' }}>
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-danger"><AlertTriangle size={16} /> Sanções por Incumprimento</h6>
      <p>A NIS2 estabelece penalizações significativas para entidades que não cumpram os requisitos:</p>
      <div className="row g-3">
      <div className="col-md-6">
      <div className="bg-white border border-danger rounded-3 p-3">
      <div className="fw-semibold text-danger mb-1">Entidades Essenciais</div>
      <p className="small text-muted mb-0">Multas até <strong>€10 milhões</strong> ou <strong>2% do volume de negócios anual global</strong></p>
      </div>
      </div>
      <div className="col-md-6">
      <div className="bg-white border border-danger rounded-3 p-3">
      <div className="fw-semibold text-danger mb-1">Entidades Importantes</div>
      <p className="small text-muted mb-0">Multas até <strong>€7 milhões</strong> ou <strong>1,4% do volume de negócios anual global</strong></p>
      </div>
      </div>
      </div>
      </div>

      {/* Timeline */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Calendar size={16} className="kb-icon" /> Cronologia de Implementação</h6>
      <div className="d-flex flex-column gap-3 mb-4">
      {[
        { date: 'Jan 2023', text: 'Entrada em vigor da Diretiva NIS2', primary: true },
        { date: 'Out 2024', text: 'Prazo limite para transposição nos Estados-Membros', primary: false },
        { date: 'Out 2024', text: 'Início da aplicação efetiva das obrigações', primary: true },
      ].map((t, i) => (
        <div key={i} className="d-flex gap-3 align-items-center">
        <div className="px-3 py-2 rounded-3 text-white text-center fw-semibold flex-shrink-0" style={{ background: t.primary ? 'var(--kb-primary)' : 'var(--kb-accent)', minWidth: 90 }}>{t.date}</div>
        <div className="p-3 rounded-3 flex-grow-1" style={{ background: 'rgba(0,0,0,.03)' }}><p className="small mb-0">{t.text}</p></div>
        </div>
      ))}
      </div>

      {/* CTA */}
      <div className="kb-banner p-4 rounded-3 text-white text-center">
      <h6 className="fw-bold mb-2">Como a KikiByte Pode Ajudar</h6>
      <p className="small mb-3 opacity-90">A nossa equipa especializada está pronta para ajudar a sua empresa a alcançar total conformidade com a NIS2, desde a avaliação inicial até à implementação completa.</p>
      <button className="kb-banner-btn" onClick={() => {
        setIsNIS2DialogOpen(false)
        setTimeout(() => {
          const el = document.getElementById('contact')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }}>
      Fale connosco sobre NIS2
      </button>
      </div>
      </div>

      </div>
      </div>
      </div>
    )}
    </section>
  )
}
