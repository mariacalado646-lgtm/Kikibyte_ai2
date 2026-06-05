import { FileText, Mail, MapPin, Phone, Send, Upload, X } from 'lucide-react'
import { useContact } from '../controllers/useContact'

const contactInfo = [
  { icon: Mail,   title: 'Email',       content: 'contato@kiki.pt',  link: 'mailto:contato@kiki.pt' },
{ icon: Phone,  title: 'Telefone',    content: '+351 210 123 456', link: 'tel:+351210123456' },
{ icon: MapPin, title: 'Localização', content: 'Viseu, Portugal',  link: null },
]

export function Contact() {
  const {
    formData, uploadedFiles, isSubmitted, isLoading, error,
      fileInputRef, handleChange, handleFileSelect, removeFile,
      handleSubmit, formatFileSize
  } = useContact()

  const getFileIcon = () => <FileText size={18} className="kb-icon" />

  return (
    <section id="contact" className="py-5 bg-white">
    <div className="container py-4">
    <div className="text-center mb-5">
    <h2 className="kb-section-title">Entre em <span className="kb-brand">Contacto</span></h2>
    <p className="kb-section-sub">Tem alguma questão ou precisa de uma solução de cibersegurança? A nossa equipa está pronta para ajudar.</p>
    </div>

    <div className="row g-5">
    {/* Contact Info */}
    <div className="col-lg-6">
    <h3 className="fw-semibold mb-3">Fale connosco</h3>
    <p className="text-muted mb-4">Estamos disponíveis para esclarecer todas as suas dúvidas e apresentar as melhores soluções para o seu negócio.</p>

    <div className="d-flex flex-column gap-4 mb-4">
    {contactInfo.map((info, i) => (
      <div key={i} className="d-flex align-items-start gap-3">
      <div className="kb-icon-box flex-shrink-0">
      <info.icon size={22} className="kb-icon" />
      </div>
      <div>
      <div className="fw-semibold mb-1">{info.title}</div>
      {info.link
        ? <a href={info.link} className="text-muted text-decoration-none kb-hover-primary">{info.content}</a>
        : <span className="text-muted">{info.content}</span>
      }
      </div>
      </div>
    ))}
    </div>

    <div className="kb-hours-box p-4 rounded-3">
    <div className="fw-semibold mb-2">Horário de Atendimento</div>
    <div className="text-muted small">
    <p className="mb-1">Segunda a Sexta: 9h00 - 18h00</p>
    <p className="mb-1">Sábado e Domingo: Fechado</p>
    <p className="kb-brand fw-medium mt-2 mb-0">Suporte 24/7 para clientes premium</p>
    </div>
    </div>
    </div>

    {/* Form */}
    <div className="col-lg-6">
    <div className="kb-form-box p-4 p-md-5 rounded-4">
    {isSubmitted ? (
      <div className="text-center py-5">
      <div className="kb-icon-box-lg mx-auto mb-4">
      <Send size={40} className="kb-icon" />
      </div>
      <h3 className="fw-semibold mb-2">Mensagem Enviada!</h3>
      <p className="text-muted">Obrigado pelo seu contacto. Responderemos brevemente.</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger py-2 small mb-3">{error}</div>
      )}

      <div className="mb-3">
      <label htmlFor="nome" className="form-label">Nome Completo *</label>
      <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="form-control kb-input" placeholder="João Silva" />
      </div>

      <div className="mb-3">
      <label htmlFor="email" className="form-label">Email *</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-control kb-input" placeholder="joao@empresa.pt" />
      </div>

      <div className="row g-3 mb-3">
      <div className="col-sm-6">
      <label htmlFor="telefone" className="form-label">Telefone</label>
      <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className="form-control kb-input" placeholder="+351 912 345 678" />
      </div>
      <div className="col-sm-6">
      <label htmlFor="empresa" className="form-label">Empresa *</label>
      <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} className="form-control kb-input" placeholder="Nome da empresa" />
      </div>
      </div>

      <div className="mb-3">
      <label htmlFor="mensagem" className="form-label">Mensagem *</label>
      <textarea id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} required rows={4} className="form-control kb-input" placeholder="Como podemos ajudar?" style={{ resize: 'none' }} />
      </div>

      <div className="mb-3">
      <label className="form-label fw-medium">Ficheiros (PDF, Word, Excel)</label>
      <div className="kb-dropzone" onClick={() => fileInputRef.current?.click()}>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.xls,.xlsx" multiple className="d-none" />
      <Upload size={40} className="kb-icon mb-2" />
      <p className="fw-medium mb-1">Clique para selecionar ficheiros</p>
      <p className="text-muted small mb-0">PDF, Word (.doc, .docx), Excel (.xls, .xlsx)</p>
      </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="d-flex flex-column gap-2 mb-3">
        <p className="small fw-medium mb-1">Ficheiros selecionados ({uploadedFiles.length}):</p>
        {uploadedFiles.map((file, i) => (
          <div key={i} className="d-flex align-items-center justify-content-between bg-white px-3 py-2 rounded-3 border">
          <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
          {getFileIcon()}
          <div className="overflow-hidden">
          <p className="small fw-medium mb-0 text-truncate">{file.name}</p>
          <p className="x-small text-muted mb-0">{formatFileSize(file.size)}</p>
          </div>
          </div>
          <button type="button" onClick={() => removeFile(i)} className="btn btn-sm btn-link text-danger p-1 ms-2">
          <X size={14} />
          </button>
          </div>
        ))}
        </div>
      )}

      <button type="submit" disabled={isLoading} className="btn-kb-primary w-100 d-flex align-items-center justify-content-center gap-2">
      <Send size={18} />
      {isLoading ? 'A enviar...' : 'Enviar Mensagem'}
      </button>
      </form>
    )}
    </div>
    </div>
    </div>
    </div>
    </section>
  )
}
