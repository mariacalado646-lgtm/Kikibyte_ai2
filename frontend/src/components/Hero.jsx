import { useNavigate } from 'react-router'
import { ChevronDown } from 'lucide-react'
import mascotImg from '../assets/hero.png'

export function Hero() {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="kb-hero d-flex align-items-center justify-content-center">
    <div className="container kb-content py-5">
    <div className="row align-items-center g-5">
    <div className="col-md-6">
    <div className="d-flex flex-column gap-4">
    <h1 className="kb-h1">
    Proteja o seu negócio com <span className="kb-brand">KikiByte</span>
    </h1>
    <p className="kb-lead">
    Soluções de cibersegurança especializadas em conformidade NIS2 e CNCS para empresas portuguesas
    </p>
    <div className="d-flex flex-column flex-sm-row gap-3">
    <button className="btn-kb-primary" onClick={() => scrollToSection('services')}>
    Conheça os nossos serviços
    </button>
    <button className="btn-kb-outline" onClick={() => scrollToSection('contact')}>
    Fale connosco
    </button>
    </div>
    </div>
    </div>
    <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
    <div className="kb-mascot-wrap">
    <div className="kb-glow" />
    <img src={mascotImg} alt="Kiki Mascot" className="kb-mascot-img" />
    </div>
    </div>
    </div>
    </div>
    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 2 }}>
    <button className="kb-scroll-btn" onClick={() => scrollToSection('about')} aria-label="Scroll down">
    <span>Descubra mais</span>
    <ChevronDown size={22} />
    </button>
    </div>
    </section>
  )
}
