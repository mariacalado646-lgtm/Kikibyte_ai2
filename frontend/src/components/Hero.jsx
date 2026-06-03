import { useNavigate } from "react-router";
import { Shield, ChevronDown } from "lucide-react";
import mascotImg from "../assets/hero.png";

export function Hero() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-accent/10 -z-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzc4MzUwRiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl">
              Proteja o seu negócio com{" "}
              <span className="text-primary">KikiByte</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Soluções de cibersegurança especializadas em conformidade NIS2 e
              CNCS para empresas portuguesas
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection("services")}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl"
              >
                Conheça os nossos serviços
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Fale connosco
              </button>
            </div>
          </div>

          {/* Right Content - Mascot */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <img
                src={mascotImg}
                alt="Kiki Mascot"
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-sm">Descubra mais</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
