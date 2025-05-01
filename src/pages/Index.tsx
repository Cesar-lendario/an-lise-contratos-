import { ArrowRight, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-contrato-50 to-contrato-100/10 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-contrato-100 text-contrato-900 mb-4">
                    Simplifique a análise jurídica
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-4">
                    Análise inteligente de contratos potencializada por IA
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                    Faça upload do seu contrato e receba em segundos um relatório com os 
                    principais riscos, obrigações e prazos. Economize tempo e previna problemas.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="mt-8 bg-contrato-400 hover:bg-contrato-500 text-white dark:bg-contrato-500 dark:hover:bg-contrato-400">
                    <Link to="/register" className="inline-flex items-center">
                      Experimentar Agora <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/about">Saiba Mais</Link>
                  </Button>
                </div>
                
                <div className="flex items-center pt-4 gap-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-contrato-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Rápido</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-contrato-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Seguro</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-contrato-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Preciso</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="/images/executiva-pasta.jpg" 
                    alt="Executiva profissional com pasta" 
                    className="w-full rounded-lg shadow-xl object-cover h-[500px]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-contrato-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-contrato-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-contrato-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Segurança garantida</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seus documentos estão protegidos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">Como o ContratoAI pode ajudar você</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Nossa plataforma utiliza inteligência artificial para identificar pontos críticos nos seus contratos</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-contrato-100 p-3 inline-flex rounded-lg mb-5">
                  <FileText className="h-6 w-6 text-contrato-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Revisão de Cláusulas</h3>
                <p className="text-gray-600 dark:text-gray-300">Identificamos automaticamente cláusulas problemáticas ou com potencial de risco para seu negócio.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 inline-flex rounded-lg mb-5">
                  <Shield className="h-6 w-6 text-contrato-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Análise de Riscos</h3>
                <p className="text-gray-600 dark:text-gray-300">Categorizamos os níveis de risco encontrados e oferecemos sugestões para mitigá-los.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 inline-flex rounded-lg mb-5">
                  <Clock className="h-6 w-6 text-contrato-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Alertas de Prazos</h3>
                <p className="text-gray-600 dark:text-gray-300">Automatizamos o controle de datas importantes e prazos críticos dos seus contratos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">Clientes Satisfeitos</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">Junte-se a centenas de profissionais que economizam tempo e reduzem riscos com nossa plataforma.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/register" className="flex items-center">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-contrato-700">
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">O que nossos clientes dizem</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-contrato-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">"O AdvContro revolucionou nossa forma de analisar contratos. Economia de tempo e maior segurança jurídica."</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                    alt="Ana Silva" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/jpeg;base64,/9j/AAABAAEAQEAAAAEAIAAoQEAAAAEAIAAAAAAAQEAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAA';
                      target.className = 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4';
                    }}
                  />
                  <div>
                    <p className="font-medium dark:text-white">Ana Silva</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Advogada, Castro & Associados</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-contrato-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">"Identificamos riscos que passariam despercebidos em análises manuais. Ferramenta essencial para nosso departamento jurídico."</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                    alt="Ricardo Oliveira" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/jpeg;base64,/9j/AAABAAEAQEAAAAEAIAAoQEAAAAEAIAAAAAAAQEAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAA';
                      target.className = 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4';
                    }}
                  />
                  <div>
                    <p className="font-medium dark:text-white">Ricardo Oliveira</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Diretor Jurídico, Tech Solutions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-contrato-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">"A precisão da análise e a velocidade com que obtemos os relatórios melhoraram significativamente nossa produtividade."</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                    alt="Carla Mendes" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/jpeg;base64,/9j/AAABAAEAQEAAAAEAIAAoQEAAAAEAIAAAAAAAQEAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAA';
                      target.className = 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4';
                    }}
                  />
                  <div>
                    <p className="font-medium dark:text-white">Carla Mendes</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Advogada Sênior, Mendes & Cia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
