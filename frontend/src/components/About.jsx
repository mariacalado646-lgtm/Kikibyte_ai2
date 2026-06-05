import { Target, Eye, Award } from 'lucide-react'

export function About() {
  const values = [
    { icon: Target, title: 'Missão', description: 'Proteger empresas e organizações através de soluções de cibersegurança inovadoras e personalizadas, garantindo a continuidade dos negócios num mundo digital em constante evolução.' },
    { icon: Eye,    title: 'Visão',  description: 'Ser a referência nacional em cibersegurança, reconhecida pela excelência técnica, inovação contínua e compromisso com a proteção dos dados dos nossos clientes.' },
    { icon: Award,  title: 'Valores',description: 'Integridade, confiança, inovação e excelência. Comprometemo-nos com os mais altos padrões de ética e profissionalismo em todas as nossas ações.' },
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
