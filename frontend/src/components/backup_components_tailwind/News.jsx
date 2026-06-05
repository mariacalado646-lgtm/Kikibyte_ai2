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
    <section
    id="news"
    className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30"
    >
    <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
    <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
    Notícias & <span className="text-primary">Artigos Técnicos</span>
    </h2>
    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
    Mantenha-se atualizado com as últimas tendências, ameaças e soluções
    no mundo da cibersegurança.
    </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {articles.map((article, index) => (
      <Link
      key={index}
      to={`/noticias/${article.slug}`}
      className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <Calendar className="w-4 h-4" />
      <time>{article.date}</time>
      </div>
      <h3 className="text-xl !font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
      {article.title}
      </h3>
      <p className="text-muted-foreground mb-4 line-clamp-2">
      {article.excerpt}
      </p>
      <span className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
      <span>Ler mais</span>
      <ArrowRight className="w-4 h-4" />
      </span>
      </div>
      </Link>
    ))}
    </div>

    <div className="mt-12 text-center">
    <Link
    to="/noticias"
    className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all"
    >
    Ver todos os artigos
    </Link>
    </div>
    </div>
    </section>
  )
}
