import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Calendar, Clock, ArrowRight, Search, Tag, Loader2 } from "lucide-react"
import { fetchArtigosPublicados } from "../services/newsService"

function artigoToDisplay(a) {
    return {
        id:       a.id_artigo,
        slug:     a.slug,
        image:    a.imagem_capa_base64 ??
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        title:    a.titulo,
        excerpt:  a.resumo,
        date:     a.published_at
        ? new Date(a.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date(a.created_at).toLocaleDateString('pt-PT',  { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: '5 min de leitura',
        category: a.categoria_artigo?.nome ?? 'Geral'
    }
}

const ALL_CATEGORIES = ['Todos', 'Compliance', 'Segurança', 'Ameaças', 'Cloud', 'Geral']

export function NewsPage() {
    const [search, setSearch]               = useState('')
    const [activeCategory, setActiveCategory] = useState('Todos')
    const [articles, setArticles]           = useState([])
    const [loading, setLoading]             = useState(true)
    const [error, setError]                 = useState(null)

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
        <div className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl !font-bold text-foreground mb-4">
        Notícias & <span className="text-primary">Artigos Técnicos</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
        Mantenha-se atualizado com as últimas tendências, ameaças e soluções
        no mundo da cibersegurança.
        </p>
        <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
        type="text"
        placeholder="Pesquisar artigos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
        />
        </div>
        </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
        {ALL_CATEGORIES.map(cat => (
            <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
            >
            {cat !== 'Todos' && <Tag className="w-3 h-3" />}
            {cat}
            </button>
        ))}
        </div>

        {loading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> A carregar artigos…
            </div>
        )}

        {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
            Nenhum artigo encontrado para os filtros selecionados.
            </div>
        )}

        {/* Featured */}
        {featured && (
            <Link
            to={`/noticias/${featured.slug}`}
            className="group block mb-12 rounded-2xl overflow-hidden border border-border bg-white hover:shadow-xl transition-all duration-300"
            >
            <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto overflow-hidden">
            <img
            src={featured.image}
            alt={featured.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
            {featured.category}
            </span>
            </div>
            <div className="absolute top-4 right-4">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            Destaque
            </span>
            </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {featured.date}
            </span>
            <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {featured.readTime}
            </span>
            </div>
            <h2 className="text-2xl !font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {featured.title}
            </h2>
            <p className="text-muted-foreground mb-6 line-clamp-3">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
            Ler artigo completo <ArrowRight className="w-4 h-4" />
            </span>
            </div>
            </div>
            </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map(article => (
                <Link
                key={article.id}
                to={`/noticias/${article.slug}`}
                className="group block rounded-xl overflow-hidden border border-border bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                <div className="relative h-48 overflow-hidden">
                <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                {article.category}
                </span>
                </div>
                </div>
                <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
                </div>
                <h3 className="text-lg !font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary group-hover:gap-2.5 transition-all">
                Ler mais <ArrowRight className="w-3.5 h-3.5" />
                </span>
                </div>
                </Link>
            ))}
            </div>
        )}
        </div>
        </div>
    )
}
