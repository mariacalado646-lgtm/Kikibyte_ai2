import { Calendar, ArrowRight } from 'lucide-react';

export function News() {
  const articles = [
    {
      image: 'https://images.unsplash.com/photo-1762340916350-ad5a3d620c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbmV0d29yayUyMHNlY3VyZXxlbnwxfHx8fDE3NzM2NTU2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'NIS2: O que mudou e como se preparar',
      excerpt: 'A nova Diretiva NIS2 traz requisitos mais rigorosos para empresas. Descubra como garantir conformidade total.',
      date: '10 de Março, 2026',
      category: 'Compliance'
    },
    {
      image: 'https://images.unsplash.com/photo-1698668975271-2ba9a323be6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwcHJvdGVjdGlvbiUyMHNlcnZlcnxlbnwxfHx8fDE3NzM2NTU2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Proteção de dados: Melhores práticas 2026',
      excerpt: 'Estratégias essenciais para proteger os dados da sua empresa contra ameaças cibernéticas emergentes.',
      date: '5 de Março, 2026',
      category: 'Segurança'
    },
    {
      image: 'https://images.unsplash.com/photo-1772439788893-2e51506757b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHRlY2hub2xvZ3klMjBkaWdpdGFsfGVufDF8fHx8MTc3MzY1NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Ransomware: Como proteger a sua empresa',
      excerpt: 'Conheça as técnicas mais eficazes para prevenir ataques de ransomware e manter os seus dados seguros.',
      date: '28 de Fevereiro, 2026',
      category: 'Ameaças'
    }
  ];

  return (
    <section id="news" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
            Notícias & <span className="text-primary">Artigos Técnicos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Mantenha-se atualizado com as últimas tendências, ameaças e soluções 
            no mundo da cibersegurança.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={index}
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
                
                <button className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                  <span>Ler mais</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all">
            Ver todos os artigos
          </button>
        </div>
      </div>
    </section>
  );
}
