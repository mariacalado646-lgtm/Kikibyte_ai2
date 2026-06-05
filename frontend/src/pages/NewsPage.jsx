import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Calendar, Clock, ArrowRight, Search, Tag, Loader2 } from 'lucide-react'
import { fetchArtigosPublicados, fetchCategorias } from '../services/newsService'

function artigoToDisplay(a) {
    return {
        id:       a.id_artigo,
        slug:     a.slug,
        image:    a.imagem_capa_base64 ?? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        title:    a.titulo,
        excerpt:  a.resumo,
        date:     a.published_at
        ? new Date(a.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date(a.created_at).toLocaleDateString('pt-PT',  { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: '5 min de leitura',
        category: a.categoria_artigo?.nome ?? 'Geral'
    }
}


export function NewsPage() {
    const [search, setSearch]                 = useState('')
    const [activeCategory, setActiveCategory] = useState('Todos')
    const [articles, setArticles]             = useState([])
    const [loading, setLoading]               = useState(true)
    const [error, setError]                   = useState(null)

    const [categories, setCategories] = useState(['Todos'])
    useEffect(() => {
        fetchCategorias()
        .then(rows => setCategories(['Todos', ...rows.map(c => c.nome)]))
        .catch(() => setCategories(['Todos']))
    }, [])

    useEffect(() => {
        fetchArtigosPublicados()
        .then(rows => setArticles(rows.map(artigoToDisplay)))
        .catch(() => setError('Erro ao carregar artigos.'))
        .finally(() => setLoading(false))
    }, [])

    const filtered = articles.filter(a => {
        const matchesCategory = activeCategory === 'Todos' || a.category === activeCategory
        const q = search.toLowerCase()
        const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
        return matchesCategory && matchesSearch
    })

    const [featured, ...rest] = filtered

    return (
        <div className="kb-page-wrap">

        {/* Hero */}
        <section className="kb-news-hero border-bottom">
        <div className="container text-center py-5">
        <h1 className="kb-section-title mb-3">
        Notícias & <span className="kb-brand">Artigos Técnicos</span>
        </h1>
        <p className="kb-section-sub mb-5">
        Mantenha-se atualizado com as últimas tendências, ameaças e soluções no mundo da cibersegurança.
        </p>
        <div className="kb-search-wrap mx-auto">
        <Search size={18} className="kb-search-icon" />
        <input
        type="text"
        placeholder="Pesquisar artigos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="form-control kb-search-input"
        />
        </div>
        </div>
        </section>

        <div className="container py-5">

        {/* Category filters */}
        <div className="d-flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
            <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`kb-cat-btn ${activeCategory === cat ? 'kb-cat-btn-active' : ''}`}
            >
            {cat !== 'Todos' && <Tag size={11} />}
            {cat}
            </button>
        ))}
        </div>

        {loading && (
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted py-4">
            <Loader2 size={16} className="kb-spin" /> A carregar artigos…
            </div>
        )}

        {error && <div className="text-center py-5 text-danger">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-5 text-muted">
            Nenhum artigo encontrado para os filtros selecionados.
            </div>
        )}

        {/* Featured */}
        {featured && (
            <Link to={`/noticias/${featured.slug}`} className="text-decoration-none kb-featured-card d-block mb-5 rounded-4 overflow-hidden border bg-white">
            <div className="row g-0">
            <div className="col-md-6 kb-featured-img-wrap">
            <img src={featured.image} alt={featured.title} className="kb-featured-img" />
            <span className="kb-news-badge">{featured.category}</span>
            <span className="kb-news-badge-dark">Destaque</span>
            </div>
            <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center gap-3 text-muted small mb-3">
            <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {featured.date}</span>
            <span className="d-flex align-items-center gap-1"><Clock size={14} /> {featured.readTime}</span>
            </div>
            <h2 className="kb-card-title fs-4 mb-3">{featured.title}</h2>
            <p className="text-muted kb-clamp-3 mb-4">{featured.excerpt}</p>
            <span className="kb-read-more">Ler artigo completo <ArrowRight size={14} /></span>
            </div>
            </div>
            </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
            <div className="row g-4">
            {rest.map(article => (
                <div key={article.id} className="col-md-6 col-lg-4">
                <Link to={`/noticias/${article.slug}`} className="text-decoration-none">
                <div className="kb-news-card h-100">
                <div className="kb-news-img-wrap">
                <img src={article.image} alt={article.title} className="kb-news-img" />
                <span className="kb-news-badge">{article.category}</span>
                </div>
                <div className="p-4">
                <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                <span className="d-flex align-items-center gap-1"><Calendar size={13} /> {article.date}</span>
                <span className="d-flex align-items-center gap-1"><Clock size={13} /> {article.readTime}</span>
                </div>
                <h3 className="kb-card-title kb-clamp-2 mb-2">{article.title}</h3>
                <p className="text-muted small kb-clamp-2 mb-3">{article.excerpt}</p>
                <span className="kb-read-more">Ler mais <ArrowRight size={13} /></span>
                </div>
                </div>
                </Link>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    )
}
