import { useState, useEffect } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { fetchArtigosPublicados } from '../services/newsService'

export function News() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetchArtigosPublicados()
    .then(rows => {
      const mapped = rows.slice(0, 3).map(a => ({
        slug:     a.slug,
        image:    a.imagem_capa_base64 ?? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        title:    a.titulo,
        excerpt:  a.resumo,
        date:     a.published_at
        ? new Date(a.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date(a.created_at).toLocaleDateString('pt-PT',  { day: 'numeric', month: 'long', year: 'numeric' }),
                                                category: a.categoria_artigo?.nome ?? 'Geral'
      }))
      setArticles(mapped)
    })
    .catch(err => console.error('Erro ao carregar artigos:', err))
  }, [])

  return (
    <section id="news" className="py-5 kb-bg-light">
    <div className="container py-4">
    <div className="text-center mb-5">
    <h2 className="kb-section-title">Notícias & <span className="kb-brand">Artigos Técnicos</span></h2>
    <p className="kb-section-sub">Mantenha-se atualizado com as últimas tendências, ameaças e soluções no mundo da cibersegurança.</p>
    </div>

    <div className="row g-4">
    {articles.map((article, i) => (
      <div key={i} className="col-md-6 col-lg-4">
      <Link to={`/noticias/${article.slug}`} className="text-decoration-none">
      <div className="kb-news-card h-100">
      <div className="kb-news-img-wrap">
      <img src={article.image} alt={article.title} className="kb-news-img" />
      <span className="kb-news-badge">{article.category}</span>
      </div>
      <div className="p-4">
      <div className="d-flex align-items-center gap-2 text-muted small mb-3">
      <Calendar size={14} /><time>{article.date}</time>
      </div>
      <h3 className="kb-card-title">{article.title}</h3>
      <p className="text-muted small kb-clamp-2">{article.excerpt}</p>
      <span className="kb-read-more">Ler mais <ArrowRight size={14} /></span>
      </div>
      </div>
      </Link>
      </div>
    ))}
    </div>

    <div className="text-center mt-5">
    <Link to="/noticias" className="btn-kb-outline">Ver todos os artigos</Link>
    </div>
    </div>
    </section>
  )
}
