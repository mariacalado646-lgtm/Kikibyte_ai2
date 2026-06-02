import { Target, Eye, Award } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Missão',
      description: 'Proteger empresas e organizações através de soluções de cibersegurança inovadoras e personalizadas, garantindo a continuidade dos negócios num mundo digital em constante evolução.'
    },
    {
      icon: Eye,
      title: 'Visão',
      description: 'Ser a referência nacional em cibersegurança, reconhecida pela excelência técnica, inovação contínua e compromisso com a proteção dos dados dos nossos clientes.'
    },
    {
      icon: Award,
      title: 'Valores',
      description: 'Integridade, confiança, inovação e excelência. Comprometemo-nos com os mais altos padrões de ética e profissionalismo em todas as nossas ações.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
            Sobre a <span className="text-primary">KikiByte</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Somos uma empresa portuguesa especializada em cibersegurança, dedicada a proteger 
            o seu negócio contra as ameaças digitais mais sofisticadas.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-muted/50 to-accent/10 p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl !font-semibold mb-4 text-foreground">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Clientes Protegidos' },
            { value: '99.9%', label: 'Uptime Garantido' },
            { value: '24/7', label: 'Suporte Técnico' },
            { value: '10+', label: 'Anos de Experiência' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl !font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}