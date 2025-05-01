import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const PricingFeature = ({ included, title }: { included: boolean; title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      {included ? (
        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      <span className={`text-sm ${included ? "text-gray-700 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}`}>{title}</span>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Grátis",
      price: "0",
      description: "Para pequenos escritórios e advogados autônomos.",
      features: [
        { title: "3 análises por mês", included: true },
        { title: "Identificação de riscos básicos", included: true },
        { title: "Dashboard simples", included: true },
        { title: "Exportação para PDF", included: false },
        { title: "Histórico de análises", included: false },
        { title: "Envio por e-mail", included: false },
      ],
      buttonText: "Começar Grátis",
      buttonLink: "/register",
      highlighted: false
    },
    {
      name: "Pro",
      price: "29",
      period: "/mês",
      description: "Ideal para escritórios de advocacia em crescimento.",
      features: [
        { title: "20 análises por mês", included: true },
        { title: "Análise detalhada de riscos", included: true },
        { title: "Dashboard completo", included: true },
        { title: "Exportação para PDF", included: true },
        { title: "Histórico de 30 dias", included: true },
        { title: "Envio por e-mail", included: false },
      ],
      buttonText: "Assinar Pro",
      buttonLink: "/register",
      highlighted: true
    },
    {
      name: "Business",
      price: "99",
      period: "/mês",
      description: "Para departamentos jurídicos e escritórios de grande porte.",
      features: [
        { title: "Análises ilimitadas", included: true },
        { title: "Análise avançada de riscos", included: true },
        { title: "Dashboard personalizado", included: true },
        { title: "Exportação para PDF", included: true },
        { title: "Histórico completo", included: true },
        { title: "Envio por e-mail", included: true },
      ],
      buttonText: "Contratar Business",
      buttonLink: "/register",
      highlighted: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Planos e Preços</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Escolha o plano perfeito para atender às necessidades do seu escritório ou departamento jurídico.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div key={index} className={`rounded-2xl border ${plan.highlighted ? 'border-contrato-600 dark:border-contrato-400 shadow-lg ring-2 ring-contrato-600 dark:ring-contrato-400' : 'border-gray-200 dark:border-gray-700 shadow-sm'} overflow-hidden flex flex-col dark:bg-gray-900`}>
                  <div className="p-8 flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2 dark:text-white">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold dark:text-white">R${plan.price}</span>
                        {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{plan.description}</p>
                    
                    <div className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <PricingFeature 
                          key={featureIndex} 
                          included={feature.included} 
                          title={feature.title} 
                        />
                      ))}
                    </div>
                    
                    <Button 
                      asChild 
                      className={`w-full ${plan.highlighted ? 'bg-contrato-600 hover:bg-contrato-700 dark:bg-contrato-500 dark:hover:bg-contrato-600' : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800'}`}
                    >
                      <Link to={plan.buttonLink} className="flex items-center justify-center">
                        {plan.buttonText} 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Perguntas Frequentes</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Como funciona o período de teste?</h3>
                <p className="text-gray-600 dark:text-gray-300">Todos os planos pagos incluem um período de teste de 7 dias, sem a necessidade de cartão de crédito. Você pode experimentar todos os recursos antes de decidir.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Posso mudar de plano depois?</h3>
                <p className="text-gray-600 dark:text-gray-300">Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de faturamento.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">O que acontece se eu exceder o limite de análises?</h3>
                <p className="text-gray-600 dark:text-gray-300">No plano Pro, você será notificado quando estiver próximo do limite. Você pode comprar análises adicionais ou fazer upgrade para o plano Business.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Como funciona o suporte técnico?</h3>
                <p className="text-gray-600 dark:text-gray-300">Todos os planos incluem suporte por e-mail. Os planos Pro e Business também têm acesso ao suporte prioritário por chat em tempo real.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-contrato-600 dark:bg-contrato-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Pronto para otimizar sua análise contratual?</h2>
            <p className="text-xl text-contrato-100 mb-8 max-w-2xl mx-auto">Junte-se a centenas de profissionais que economizam tempo e reduzem riscos com nossa plataforma.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/register" className="flex items-center">
                  Criar Conta Grátis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-contrato-700 dark:hover:bg-contrato-800">
                <Link to="/about">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
