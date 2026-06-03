import { Shield, Lock, Search, FileCheck, Users, CloudCog } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Shield,
      title: "Avaliação de Maturidade de TI",
      description:
        "Análise completa do nível de maturidade da sua infraestrutura tecnológica, identificando pontos fortes e áreas de melhoria.",
    },
    {
      icon: Search,
      title: "PenTest & Testes de Intrusão",
      description:
        "Testes de penetração avançados para identificar vulnerabilidades antes que sejam exploradas por agentes maliciosos.",
    },
    {
      icon: FileCheck,
      title: "Compliance NIS2",
      description:
        "Consultoria especializada para garantir conformidade com a Diretiva NIS2, incluindo implementação de medidas de segurança obrigatórias.",
    },
    {
      icon: Lock,
      title: "Gestão de Segurança",
      description:
        "Monitorização contínua de sistemas, deteção de ameaças em tempo real e resposta rápida a incidentes de segurança.",
    },
    {
      icon: Users,
      title: "Formação & Sensibilização",
      description:
        "Programas de formação para equipas, promovendo boas práticas de segurança e consciencialização sobre ciberameaças.",
    },
    {
      icon: CloudCog,
      title: "Gestão de Documentos",
      description:
        "Plataforma segura para gestão, armazenamento e partilha de documentação sensível com controlo total de acessos.",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 to-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
            Os Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços de cibersegurança,
            adaptados às necessidades específicas de cada cliente e alinhados
            com as melhores práticas internacionais.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg !font-semibold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Precisa de uma solução personalizada?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-accent transition-all shadow-md hover:shadow-lg"
          >
            Solicite um orçamento
          </button>
        </div>
      </div>
    </section>
  );
}
