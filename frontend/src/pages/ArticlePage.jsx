import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { fetchArtigoPorSlug } from '../services/newsService'

export function ArticlePage() {
    const { slug }   = useParams()
    const navigate   = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    useEffect(() => {
        fetchArtigoPorSlug(slug)
        .then(setArticle)
        .catch(() => setError('Artigo não encontrado.'))
        .finally(() => setLoading(false))
    }, [slug])

    if (loading) return (
        <div className="kb-page-wrap d-flex align-items-center justify-content-center text-muted">
        A carregar...
        </div>
    )

        if (error) return (
            <div className="kb-page-wrap d-flex flex-column align-items-center justify-content-center gap-3">
            <p className="text-muted">{error}</p>
            <button onClick={() => navigate('/noticias')} className="kb-nav-link">
            Voltar às notícias
            </button>
            </div>
        )

            return (
                <div className="kb-page-wrap">
                <div className="container py-5" style={{ maxWidth: 768 }}>

                <button
                onClick={() => navigate('/noticias')}
                className="d-flex align-items-center gap-2 text-muted kb-back-btn mb-4"
                >
                <ArrowLeft size={16} /> Voltar às notícias
                </button>

                {article.imagem_capa_base64 && (
                    <img
                    src={article.imagem_capa_base64}
                    alt={article.titulo}
                    className="w-100 rounded-4 mb-4 kb-article-img"
                    />
                )}

                <div className="mb-3">
                <span className="kb-news-badge position-static">
                {article.categoria_artigo?.nome ?? 'Geral'}
                </span>
                </div>

                <h1 className="kb-section-title mb-3">{article.titulo}</h1>

                <div className="d-flex align-items-center gap-4 text-muted small mb-4 pb-4 border-bottom">
                <span className="d-flex align-items-center gap-1">
                <Calendar size={14} />
                {article.published_at
                    ? new Date(article.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
                    : new Date(article.created_at).toLocaleDateString('pt-PT',  { day: 'numeric', month: 'long', year: 'numeric' })
                }
                </span>
                <span className="d-flex align-items-center gap-1">
                <Clock size={14} /> 5 min de leitura
                </span>
                </div>

                <div className="kb-article-body">
                {article.conteudo}
                </div>

                </div>
                </div>
            )
}
