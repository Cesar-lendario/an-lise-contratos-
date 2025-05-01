
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnalysisResult } from "@/components/contract/analysis-result";

// Dados de fallback caso não exista análise no sessionStorage
const fallbackContract = {
  id: "1",
  name: "Contrato de Prestação de Serviços.pdf",
  uploadDate: "2025-04-15T10:30:00",
  analysis: {
    riskLevel: "medium" as const,
    summary: "Este contrato de prestação de serviços apresenta algumas cláusulas de risco moderado relacionadas a prazos de entrega, multas e responsabilidade. Recomenda-se revisar as cláusulas destacadas antes da assinatura para mitigar possíveis problemas futuros.",
    risks: [
      {
        id: "r1",
        title: "Cláusula de Penalidade Excessiva",
        description: "A cláusula 7.2 estabelece multa de 10% ao dia por atraso, o que pode ser considerado abusivo em caso de disputa judicial, recomendamos negociar para 0,5% ao dia com teto de 10% do valor total.",
        severity: "high" as const
      },
      {
        id: "r2",
        title: "Responsabilidade Ilimitada",
        description: "A cláusula 9.3 não estabelece limite de responsabilidade para o prestador de serviço, o que pode gerar exposição financeira desproporcional.",
        severity: "medium" as const
      },
      {
        id: "r3",
        title: "Ausência de Cláusula de Força Maior",
        description: "O contrato não apresenta cláusula de força maior que protegeria ambas as partes em situações imprevistas e inevitáveis.",
        severity: "medium" as const
      }
    ],
    deadlines: [
      {
        id: "d1",
        title: "Entrega Final do Projeto",
        date: "2025-08-15T23:59:59",
        description: "Conforme cláusula 5.2, a entrega final do projeto deve ocorrer até esta data, sob pena de multa."
      },
      {
        id: "d2",
        title: "Primeira Etapa do Projeto",
        date: "2025-06-01T23:59:59",
        description: "A primeira entrega parcial deve ser realizada até esta data, conforme cronograma do Anexo II."
      },
      {
        id: "d3",
        title: "Pagamento da Primeira Parcela",
        date: "2025-05-10T23:59:59",
        description: "O pagamento da primeira parcela deve ser efetuado em até 10 dias após a assinatura do contrato."
      }
    ],
    recommendations: [
      {
        id: "rec1",
        title: "Adicionar Cláusula de Limitação de Responsabilidade",
        description: "Sugerimos incluir limitação de responsabilidade ao valor total do contrato para ambas as partes."
      },
      {
        id: "rec2",
        title: "Revisar Cláusula de Penalidade",
        description: "Negociar termos mais equilibrados para a cláusula de penalidade, reduzindo o percentual diário e estabelecendo um teto máximo."
      },
      {
        id: "rec3",
        title: "Incluir Cláusula de Força Maior",
        description: "Adicionar cláusula de força maior que proteja ambas as partes em situações extraordinárias e imprevisíveis."
      }
    ]
  }
};

export default function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = React.useState(fallbackContract);
  
  // Buscar dados do contrato do sessionStorage ao carregar a página
  React.useEffect(() => {
    const savedAnalysis = sessionStorage.getItem('contractAnalysis');
    if (savedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        setContract(parsedAnalysis);
      } catch (error) {
        console.error('Erro ao analisar dados do contrato:', error);
      }
    }
  }, [id]);

  const handleExportPdf = () => {
    console.log(`Exportando contrato ${id} como PDF`);
    // Implementação de exportação para PDF seria feita aqui
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4 pl-0 text-gray-500 hover:text-gray-700">
              <Link to="/dashboard" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos contratos
              </Link>
            </Button>
            
            <AnalysisResult contract={contract} onExportPdf={handleExportPdf} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
