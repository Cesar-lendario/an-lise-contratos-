
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles, Clock, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-contrato-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-contrato-950">
                Sobre o ContratoAI
              </h1>
              <p className="max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-xl/relaxed xl:text-xl/relaxed">
                Sua plataforma inteligente para análise de contratos
              </p>
            </div>
          </div>
        </section>

        {/* About Content Section */}
        <section className="pt-6 pb-12">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-8">
                O ContratoAI é uma plataforma inteligente desenvolvida para tornar a análise de contratos mais acessível, rápida e segura. Utilizando inteligência artificial de última geração, ajudamos profissionais e empresas a entenderem melhor os riscos, obrigações e oportunidades presentes em seus documentos jurídicos.
              </p>
              
              <p className="text-lg leading-relaxed mb-8">
                Nosso objetivo é simplificar a leitura e interpretação de cláusulas contratuais, destacando pontos críticos e oferecendo sugestões que auxiliam na tomada de decisões. Seja você advogado, empreendedor ou profissional autônomo, o ContratoAI foi pensado para oferecer clareza e praticidade na análise de contratos do dia a dia.
              </p>
              
              <p className="text-lg leading-relaxed mb-12">
                Acreditamos na tecnologia como aliada do direito e da transparência. Nosso compromisso é com a confiança, a eficiência e a constante inovação.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-contrato-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Nossos Valores</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Construímos nossa plataforma com base em princípios que norteiam cada aspecto do nosso trabalho
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <Shield className="h-12 w-12 text-contrato-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Confiança</h3>
                <p className="text-gray-600">
                  Garantimos a segurança dos seus dados e a precisão das nossas análises, estabelecendo uma relação de confiança com cada cliente.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 text-contrato-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Inovação</h3>
                <p className="text-gray-600">
                  Estamos sempre na vanguarda da tecnologia, aprimorando constantemente nossos algoritmos e expandindo as capacidades da nossa IA.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                <Clock className="h-12 w-12 text-contrato-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Eficiência</h3>
                <p className="text-gray-600">
                  Otimizamos seu fluxo de trabalho, transformando horas de análise manual em minutos de análise inteligente e precisa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-contrato-950">
                Experimente o ContratoAI
              </h2>
              <p className="max-w-[600px] text-gray-600 text-lg">
                Transforme a maneira como você analisa contratos e documentos jurídicos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <Button asChild size="lg" className="bg-contrato-600 hover:bg-contrato-700">
                  <Link to="/register">
                    Analisar Contrato
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Criar Conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
