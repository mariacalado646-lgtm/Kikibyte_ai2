import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { fetchArtigoPorSlug } from '../services/newsService'

export function ArticlePage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchArtigoPorSlug(slug)
        .then(setArticle)
        .catch(() => setError('Artigo não encontrado.'))
        .finally(() => setLoading(false))
    }, [slug])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        A carregar...
        </div>
    )

        if (error) return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">{error}</p>
            <button onClick={() => navigate('/noticias')} className="text-primary hover:underline">
            Voltar às notícias
            </button>
            </div>
        )

            return (
                <div className="min-h-screen bg-background pt-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <button
                onClick={() => navigate('/noticias')}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                <ArrowLeft className="w-4 h-4" /> Voltar às notícias
                </button>

                {article.imagem_capa_base64 && (
                    <img
                    src={article.imagem_capa_base64}
                    alt={article.titulo}
                    className="w-full h-64 object-cover rounded-2xl mb-8"
                    />
                )}

                <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                {article.categoria_artigo?.nome ?? 'Geral'}
                </span>
                </div>

                <h1 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
                {article.titulo}
                </h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.published_at
                    ? new Date(article.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
                    : new Date(article.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
                }
                </span>
                <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 5 min de leitura
                </span>
                </div>

                <div className="prose prose-neutral max-w-none text-foreground leading-relaxed">
                {article.conteudo}
                </div>

                </div>
                </div>
            )
}
