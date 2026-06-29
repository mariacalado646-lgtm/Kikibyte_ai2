import { useState, useEffect } from 'react'
import { Target, Eye, Award } from 'lucide-react'
import { api } from '../services/api'

export function About() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    api.get('/empresas/public')
      .then(r => setContent(r.data))
      .catch(() => {}) // silencia erro, fallback para hardcoded
  }, [])

  const values = [
    { icon: Target, title: 'Missão', description: content?.missao || 'Carregando...' },
    { icon: Eye,    title: 'Visão',  description: content?.visao || 'Carregando...' },
    { icon: Award,  title: 'Valores',description: content?.valores || 'Carregando...' },
  ]

  const stats = [
    { value: '500+', label: 'Clientes Protegidos' },
    { value: '99.9%', label: 'Uptime Garantido' },
    { value: '24/7', label: 'Suporte Técnico' },
    { value: '10+', label: 'Anos de Experiência' },
  ]

  return (
    <section id="about" className="py-5 bg-white">
    <div className="container py-4">
    <div className="text-center mb-5">
    <h2 className="kb-section-title">Sobre a <span className="kb-brand">KikiByte</span></h2>
    <p className="kb-section-sub">
    Somos uma empresa portuguesa especializada em cibersegurança, dedicada a proteger o seu negócio contra as ameaças digitais mais sofisticadas.
    </p>
    </div>

    <div className="row g-4 mb-5">
    {values.map((v, i) => (
      <div key={i} className="col-md-4">
      <div className="kb-card h-100">
      <div className="kb-icon-box mb-4">
      <v.icon size={32} className="kb-icon" />
      </div>
      <h3 className="kb-card-title">{v.title}</h3>
      <p className="text-muted">{v.description}</p>
      </div>
      </div>
    ))}
    </div>

    <div className="row g-4">
    {stats.map((s, i) => (
      <div key={i} className="col-6 col-md-3 text-center">
      <div className="kb-stat-value">{s.value}</div>
      <div className="kb-stat-label">{s.label}</div>
      </div>
    ))}
    </div>
    </div>
    </section>
  )
}
