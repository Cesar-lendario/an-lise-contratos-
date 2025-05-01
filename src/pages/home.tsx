
import React from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, Clock, Sparkles, ChevronRight, ArrowRight, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-contrato-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-contrato-100 px-3 py-1 text-sm text-contrato-800">
                Simplifique a análise jurídica
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-contrato-950 max-w-3xl">
                Análise inteligente de contratos potencializada por IA
              </h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl">
                Faça upload do seu contrato e receba em segundos um relatório com os principais 
                riscos, obrigações e prazos. Economize tempo e previna problemas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-contrato-600 hover:bg-contrato-700">
                  <Link to="/upload">
                    Analisar Contrato
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Saiba Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:gap-10">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter text-contrato-950">
                  Como o ContratoAI funciona
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[800px] mx-auto">
                  Nossa tecnologia de IA analisa e interpreta qualquer contrato em segundos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                  <div className="p-3 rounded-full bg-contrato-100">
                    <FileText className="h-6 w-6 text-contrato-700" />
                  </div>
                  <h3 className="text-xl font-semibold">1. Faça Upload</h3>
                  <p className="text-gray-500">
                    Carregue seu contrato em PDF, DOCX ou texto simples em nossa plataforma segura.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                  <div className="p-3 rounded-full bg-contrato-100">
                    <Sparkles className="h-6 w-6 text-contrato-700" />
                  </div>
                  <h3 className="text-xl font-semibold">2. IA Analisa</h3>
                  <p className="text-gray-500">
                    Nossa IA avançada processa o texto e identifica riscos, prazos e obrigações.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                  <div className="p-3 rounded-full bg-contrato-100">
                    <Shield className="h-6 w-6 text-contrato-700" />
                  </div>
                  <h3 className="text-xl font-semibold">3. Receba Relatório</h3>
                  <p className="text-gray-500">
                    Visualize um relatório detalhado e receba recomendações práticas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-contrato-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-contrato-950">
                  Por que usar o ContratoAI?
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa solução ajuda profissionais jurídicos e empresários a economizar tempo e 
                  tomar decisões mais seguras sobre contratos.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-1">
                      <Clock className="h-5 w-5 text-contrato-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">Economize Tempo</h3>
                      <p className="text-gray-500">
                        Reduza horas de análise para minutos com nossa tecnologia.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-1">
                      <Shield className="h-5 w-5 text-contrato-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">Evite Riscos</h3>
                      <p className="text-gray-500">
                        Identifique cláusulas problemáticas antes de assinar.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-1">
                      <Sparkles className="h-5 w-5 text-contrato-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">IA Especializada</h3>
                      <p className="text-gray-500">
                        Nossa IA é treinada especificamente para entender linguagem contratual.
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="pt-2">
                  <Button asChild className="bg-contrato-600 hover:bg-contrato-700">
                    <Link to="/upload">
                      Experimente Agora
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="rounded-lg overflow-hidden border shadow-sm w-full max-w-md h-auto bg-white p-4">
                  <div className="rounded-md p-2 mb-3 bg-contrato-100 text-contrato-800 text-sm">
                    Exemplo de Análise
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Cláusula de Penalidade</h4>
                        <p className="text-xs text-gray-500">
                          A penalidade por atraso de 10% ao dia é considerada abusiva pela jurisprudência.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-4 w-4 text-contrato-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Prazo de Entrega</h4>
                        <p className="text-xs text-gray-500">
                          Entrega final deve ser feita até 15/08/2025 conforme cláusula 5.2.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <Shield className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Recomendação</h4>
                        <p className="text-xs text-gray-500">
                          Adicionar cláusula de mediação para resolução de conflitos antes de arbitragem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10 px-6 rounded-xl bg-contrato-600 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Pronto para analisar seus contratos com IA?
              </h2>
              <p className="text-contrato-100 max-w-[600px]">
                Comece agora e transforme a maneira como você lida com documentos jurídicos.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/upload">Analisar Meu Primeiro Contrato</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
