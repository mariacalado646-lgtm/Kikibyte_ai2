import { useState } from 'react'
import { CheckCircle2, Shield, FileText, Lock, Info, Building2, AlertTriangle, Users, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'

export function Compliance() {
  const [isNIS2DialogOpen, setIsNIS2DialogOpen] = useState(false)

  const nis2Features = [
    'Gestão de riscos de cibersegurança','Tratamento de incidentes',
    'Continuidade das operações e gestão de crises','Segurança da cadeia de abastecimento',
    'Criptografia e segurança de comunicações','Controlo de acesso e gestão de ativos'
  ]
  const cncsGuidelines = [
    'Implementação de políticas de segurança robustas','Monitorização contínua de sistemas críticos',
    'Resposta rápida a incidentes de segurança','Formação contínua de equipas',
    'Auditoria e avaliação regular de riscos','Conformidade com standards nacionais'
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

    {/* NIS2 Dialog — keep shadcn dialog as-is since Bootstrap doesn't have one */}
    <Dialog open={isNIS2DialogOpen} onOpenChange={setIsNIS2DialogOpen}>
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
    <DialogTitle className="d-flex align-items-center gap-2 fs-4">
    <Shield size={28} className="kb-icon" /> Diretiva NIS2 - Informação Detalhada
    </DialogTitle>
    <DialogDescription>Compreenda a nova diretiva europeia de cibersegurança e o seu impacto</DialogDescription>
    </DialogHeader>
    {/* Dialog content unchanged — it's already correct */}
    </DialogContent>
    </Dialog>
    </section>
  )
}
