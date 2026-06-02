import { useState } from 'react';
import { CheckCircle2, Shield, FileText, Lock, Info, Building2, AlertTriangle, Users, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export function Compliance() {
  const [isNIS2DialogOpen, setIsNIS2DialogOpen] = useState(false);

  const nis2Features = [
    'Gestão de riscos de cibersegurança',
    'Tratamento de incidentes',
    'Continuidade das operações e gestão de crises',
    'Segurança da cadeia de abastecimento',
    'Criptografia e segurança de comunicações',
    'Controlo de acesso e gestão de ativos'
  ];

  const cncsGuidelines = [
    'Implementação de políticas de segurança robustas',
    'Monitorização contínua de sistemas críticos',
    'Resposta rápida a incidentes de segurança',
    'Formação contínua de equipas',
    'Auditoria e avaliação regular de riscos',
    'Conformidade com standards nacionais'
  ];

  return (
    <section id="compliance" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
            Conformidade & <span className="text-primary">Certificações</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Estamos totalmente alinhados com as diretrizes europeias e nacionais de cibersegurança, 
            garantindo que os seus sistemas cumpram todos os requisitos legais e regulamentares.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* NIS2 Card */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/10 p-8 rounded-2xl border-2 border-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary w-16 h-16 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl !font-bold text-foreground">Diretiva NIS2</h3>
                    <p className="text-sm text-muted-foreground">Diretiva (UE) 2022/2555</p>
                  </div>
                  <button
                    onClick={() => setIsNIS2DialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm !font-semibold"
                  >
                    <Info size={16} />
                    Ver mais
                  </button>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              A Diretiva NIS2 estabelece medidas para um elevado nível comum de cibersegurança 
              em toda a União Europeia. Ajudamos a sua empresa a cumprir todos os requisitos:
            </p>
            <ul className="space-y-3">
              {nis2Features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CNCS Card */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/5 p-8 rounded-2xl border-2 border-accent/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-accent w-16 h-16 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl !font-bold text-foreground">CNCS</h3>
                <p className="text-sm text-muted-foreground">Centro Nacional de Cibersegurança</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Seguimos rigorosamente as orientações do CNCS, a autoridade nacional competente 
              em matéria de cibersegurança em Portugal:
            </p>
            <ul className="space-y-3">
              {cncsGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-center text-white">
          <Lock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl !font-bold mb-3">Conformidade Garantida</h3>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            Com a KikiByte, a sua empresa está sempre em conformidade com as mais recentes 
            regulamentações de cibersegurança, evitando multas e protegendo a sua reputação.
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-muted transition-all shadow-lg"
          >
            Agende uma auditoria
          </button>
        </div>
      </div>

      {/* NIS2 Detailed Information Dialog */}
      <Dialog open={isNIS2DialogOpen} onOpenChange={setIsNIS2DialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Shield className="w-8 h-8 text-primary" />
              Diretiva NIS2 - Informação Detalhada
            </DialogTitle>
            <DialogDescription>
              Compreenda a nova diretiva europeia de cibersegurança e o seu impacto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Introduction */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="text-xl !font-bold text-foreground mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                O que é a NIS2?
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                A <strong>Diretiva NIS2 (Network and Information Security Directive 2)</strong> é a atualização da diretiva original NIS de 2016,
                estabelecendo um quadro legislativo mais robusto para garantir a cibersegurança em toda a União Europeia.
              </p>
              <p className="text-foreground leading-relaxed">
                Publicada em <strong>27 de dezembro de 2022</strong>, a NIS2 entrou em vigor a <strong>16 de janeiro de 2023</strong>,
                e os Estados-Membros têm até <strong>17 de outubro de 2024</strong> para transpor a diretiva para a legislação nacional.
              </p>
            </div>

            {/* Key Objectives */}
            <div>
              <h3 className="text-xl !font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Objetivos Principais
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-border p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
                  <h4 className="!font-semibold text-foreground mb-2">Harmonização</h4>
                  <p className="text-sm text-muted-foreground">
                    Criar um nível uniforme de cibersegurança em todos os Estados-Membros da UE
                  </p>
                </div>
                <div className="bg-white border border-border p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
                  <h4 className="!font-semibold text-foreground mb-2">Resiliência</h4>
                  <p className="text-sm text-muted-foreground">
                    Aumentar a resiliência das infraestruturas críticas e serviços essenciais
                  </p>
                </div>
                <div className="bg-white border border-border p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
                  <h4 className="!font-semibold text-foreground mb-2">Cooperação</h4>
                  <p className="text-sm text-muted-foreground">
                    Reforçar a cooperação entre Estados-Membros e autoridades competentes
                  </p>
                </div>
                <div className="bg-white border border-border p-4 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
                  <h4 className="!font-semibold text-foreground mb-2">Responsabilização</h4>
                  <p className="text-sm text-muted-foreground">
                    Aumentar a responsabilidade dos órgãos de gestão e administração
                  </p>
                </div>
              </div>
            </div>

            {/* Affected Entities */}
            <div>
              <h3 className="text-xl !font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Quem é Afetado?
              </h3>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl">
                <p className="text-foreground mb-4">
                  A NIS2 expande significativamente o âmbito da diretiva original, abrangendo agora <strong>18 setores críticos</strong>:
                </p>
                <div className="grid md:grid-cols-1 gap-3">
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <strong>Alta Criticidade:</strong>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Energia</li>
                      <li>• Transportes</li>
                      <li>• Saúde</li>
                      <li>• Infraestrutura digital</li>
                      <li>• Água potável</li>
                      <li>• Águas residuais</li>
                      <li>• Espaço</li>
                      <li>• Administração Pública</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <strong>Outros Setores Críticos:</strong>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Serviços postais</li>
                      <li>• Gestão de resíduos</li>
                      <li>• Produção química</li>
                      <li>• Produção alimentar</li>
                      <li>• Dispositivos médicos</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <strong>Setores Digitais:</strong>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Fornecedores de serviços digitais</li>
                      <li>• Mercados online</li>
                      <li>• Motores de pesquisa</li>
                      <li>• Plataformas de redes sociais</li>
                      <li>• Cloud computing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl !font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Principais Requisitos
              </h3>
              <div className="space-y-3">
                <div className="bg-white border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="!font-semibold text-foreground mb-2">1. Medidas de Gestão de Riscos</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementação de medidas técnicas, operacionais e organizacionais adequadas e proporcionadas para gerir riscos
                    de cibersegurança, incluindo políticas de análise de risco, gestão de incidentes, continuidade de negócio,
                    segurança da cadeia de abastecimento, e criptografia.
                  </p>
                </div>
                <div className="bg-white border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="!font-semibold text-foreground mb-2">2. Notificação de Incidentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Obrigação de reportar incidentes significativos de cibersegurança às autoridades competentes em prazos rigorosos:
                    alerta inicial em <strong>24 horas</strong>, notificação em <strong>72 horas</strong>, e relatório final em <strong>1 mês</strong>.
                  </p>
                </div>
                <div className="bg-white border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="!font-semibold text-foreground mb-2">3. Responsabilidade da Gestão</h4>
                  <p className="text-sm text-muted-foreground">
                    Os membros dos órgãos de gestão são diretamente responsáveis pela supervisão das medidas de cibersegurança,
                    devendo aprovar medidas, supervisar a sua implementação, e participar em formações.
                  </p>
                </div>
                <div className="bg-white border-l-4 border-primary p-4 rounded-r-lg">
                  <h4 className="!font-semibold text-foreground mb-2">4. Segurança da Cadeia de Abastecimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Avaliação de riscos de cibersegurança relacionados com fornecedores e prestadores de serviços,
                    garantindo a segurança de toda a cadeia de fornecimento.
                  </p>
                </div>
              </div>
            </div>

            {/* Penalties */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-xl !font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Sanções por Incumprimento
              </h3>
              <p className="text-foreground mb-4">
                A NIS2 estabelece penalizações significativas para entidades que não cumpram os requisitos:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <p className="!font-semibold text-red-600 mb-2">Entidades Essenciais</p>
                  <p className="text-sm text-muted-foreground">
                    Multas até <strong>€10 milhões</strong> ou <strong>2% do volume de negócios anual global</strong>
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <p className="!font-semibold text-red-600 mb-2">Entidades Importantes</p>
                  <p className="text-sm text-muted-foreground">
                    Multas até <strong>€7 milhões</strong> ou <strong>1,4% do volume de negócios anual global</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-xl !font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Cronologia de Implementação
              </h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-32 px-4 py-2 rounded-lg text-center !font-semibold flex-shrink-0">
                    Jan 2023
                  </div>
                  <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-foreground">Entrada em vigor da Diretiva NIS2</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-accent text-white w-32 px-4 py-2 rounded-lg text-center !font-semibold flex-shrink-0">
                    Out 2024
                  </div>
                  <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-foreground">Prazo limite para transposição nos Estados-Membros</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-32 px-4 py-2 rounded-lg text-center !font-semibold flex-shrink-0">
                    Out 2024
                  </div>
                  <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-foreground">Início da aplicação efetiva das obrigações</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white text-center">
              <h3 className="text-xl !font-bold mb-3">Como a KikiByte Pode Ajudar</h3>
              <p className="mb-4 opacity-90">
                A nossa equipa especializada está pronta para ajudar a sua empresa a alcançar total conformidade com a NIS2,
                desde a avaliação inicial até à implementação completa das medidas necessárias.
              </p>
              <button
                onClick={() => {
                  setIsNIS2DialogOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-muted transition-all !font-semibold"
              >
                Fale connosco sobre NIS2
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}