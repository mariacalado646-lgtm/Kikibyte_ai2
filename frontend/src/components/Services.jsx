import { Shield, Lock, Search, FileCheck, Users, CloudCog } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../services/api'

const FALLBACK_SERVICES = [
  { icon: Shield,   title: 'Avaliação de Maturidade de TI',  description: 'Análise completa do nível de maturidade da sua infraestrutura tecnológica, identificando pontos fortes e áreas de melhoria.' },
  { icon: Search,   title: 'PenTest & Testes de Intrusão',   description: 'Testes de penetração avançados para identificar vulnerabilidades antes que sejam exploradas por agentes maliciosos.' },
  { icon: FileCheck,title: 'Compliance NIS2',                description: 'Consultoria especializada para garantir conformidade com a Diretiva NIS2, incluindo implementação de medidas de segurança obrigatórias.' },
  { icon: Lock,     title: 'Gestão de Segurança',            description: 'Monitorização contínua de sistemas, deteção de ameaças em tempo real e resposta rápida a incidentes de segurança.' },
  { icon: Users,    title: 'Formação & Sensibilização',      description: 'Programas de formação para equipas, promovendo boas práticas de segurança e consciencialização sobre ciberameaças.' },
  { icon: CloudCog, title: 'Gestão de Documentos',           description: 'Plataforma segura para gestão, armazenamento e partilha de documentação sensível com controlo total de acessos.' },
]

const ICON_MAP = { Shield, Lock, Search, FileCheck, Users, CloudCog }

export function Services() {
  const [servicesData, setServicesData] = useState(null)

  useEffect(() => {
    api.get('/empresas/public')
      .then(r => {
        const raw = r.data?.site_config
        if (raw?.services?.length) {
          setServicesData(raw.services.map(s => ({
            ...s,
            icon: ICON_MAP[s.icon] || Shield
          })))
        }
      })
      .catch(() => {})
  }, [])

  const services = servicesData ?? FALLBACK_SERVICES

  return (
    <section id="services" className="py-5 kb-bg-light">
    <div className="container py-4">
    <div className="text-center mb-5">
    <h2 className="kb-section-title">Os Nossos <span className="kb-brand">Serviços</span></h2>
    <p className="kb-section-sub">
    Oferecemos uma gama completa de serviços de cibersegurança, adaptados às necessidades específicas de cada cliente e alinhados com as melhores práticas internacionais.
    </p>
    </div>

    <div className="row g-4">
    {services.map((s, i) => (
      <div key={i} className="col-sm-6 col-lg-4">
      <div className="kb-service-card h-100">
      <div className="kb-service-icon-box mb-3">
      <s.icon size={28} className="kb-icon" />
      </div>
      <h3 className="kb-card-title">{s.title}</h3>
      <p className="text-muted small">{s.description}</p>
      </div>
      </div>
    ))}
    </div>

    <div className="text-center mt-5">
    <p className="text-muted mb-3">Precisa de uma solução personalizada?</p>
    <button className="btn-kb-primary" onClick={() => {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }}>
    Solicite um orçamento
    </button>
    </div>
    </div>
    </section>
  )
}
