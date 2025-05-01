
import * as React from "react";
import { useState, useRef } from "react";
import { 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Download, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Scale, 
  Eye, 
  BookOpen, 
  AlertCircle, 
  FileSearch,
  Shield,
  LifeBuoy,
  RefreshCw
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AnalysisResultProps {
  contract: {
    id: string;
    name: string;
    uploadDate: string;
    analysis: {
      riskLevel: 'low' | 'medium' | 'high';
      summary: string;
      // Texto completo da análise para exibição alternativa
      content?: string;
      // Novo campo para análise detalhada em 13 pontos
      legalAnalysis?: {
        clarityAndPrecision?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        adequateCoverage?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        legalProtection?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        regulatoryCompliance?: {
          id: string;
          title: string;
          positiveAspects?: string;
          improvementSuggestions?: string;
          justification?: string;
          implications?: string;
        };
        ambiguitiesOrGaps?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        potentialRisks?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        partyBalance?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        disputeResolution?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        keyTermDefinitions?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        futureAdaptability?: {
          id: string;
          title: string;
          positiveAspects?: string;
          suggestion?: string;
          justification?: string;
          implications?: string;
        };
        legalVulnerabilities?: {
          id: string;
          title: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        paymentClauses?: {
          id: string;
          title: string;
          positiveAspects?: string;
          problem?: string;
          recommendation?: string;
          justification?: string;
          implications?: string;
        };
        confidentiality?: {
          id: string;
          title: string;
          positiveAspects?: string;
          suggestion?: string;
          justification?: string;
          implications?: string;
        };
      };
      // Campos originais mantidos
      risks: Array<{
        id: string;
        title: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
      }>;
      // Adicionando tipo para cláusulas corrigidas
      alteracoes?: Array<{
        id: string;
        title: string;
        originalText: string;
        correctedText: string;
        justification?: string;
      }>;
      deadlines: Array<{
        id: string;
        title: string;
        date: string;
        description: string;
      }>;
      recommendations: Array<{
        id: string;
        title: string;
        description: string;
      }>;
    };
  };
  onExportPdf: () => void;
}

// Função para formatar o conteúdo markdown em HTML
function formatMarkdownContent(content: string): string {
  if (!content) return '';
  
  // Substituir quebras de linha por <br>
  let formatted = content.replace(/\n/g, '<br>');
  
  // Formatar negrito
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Formatar itálico
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Formatar títulos
  formatted = formatted.replace(/#{3}\s([^#\n]+)/g, '<h3>$1</h3>');
  formatted = formatted.replace(/#{2}\s([^#\n]+)/g, '<h2>$1</h2>');
  formatted = formatted.replace(/#{1}\s([^#\n]+)/g, '<h1>$1</h1>');
  
  // Formatar listas
  formatted = formatted.replace(/(-|\*)\s([^\n]+)/g, '<li>$2</li>');
  formatted = formatted.replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>');
  formatted = formatted.replace(/<\/ul><ul>/g, '');
  
  // Formatar emojis para destacá-los
  formatted = formatted.replace(/(\p{Emoji})/gu, '<span class="text-xl">$1</span>');
  
  // Colorir seções importantes
  formatted = formatted.replace(/<strong>NÍVEL DE RISCO<\/strong>/g, '<strong class="text-red-600">NÍVEL DE RISCO</strong>');
  formatted = formatted.replace(/<strong>RESUMO FACTUAL<\/strong>/g, '<strong class="text-blue-600">RESUMO FACTUAL</strong>');
  formatted = formatted.replace(/<strong>ANÁLISE JURÍDICA<\/strong>/g, '<strong class="text-purple-600">ANÁLISE JURÍDICA</strong>');
  formatted = formatted.replace(/<strong>PRAZOS<\/strong>/g, '<strong class="text-orange-600">PRAZOS</strong>');
  formatted = formatted.replace(/<strong>RECOMENDAÇÕES<\/strong>/g, '<strong class="text-green-600">RECOMENDAÇÕES</strong>');
  
  // Destacar problemas e recomendações
  formatted = formatted.replace(/<strong>Problema:<\/strong>/g, '<strong class="text-red-500">Problema:</strong>');
  formatted = formatted.replace(/<strong>Recomendação:<\/strong>/g, '<strong class="text-green-500">Recomendação:</strong>');
  formatted = formatted.replace(/<strong>Justificativa:<\/strong>/g, '<strong class="text-blue-500">Justificativa:</strong>');
  formatted = formatted.replace(/<strong>Implicações:<\/strong>/g, '<strong class="text-purple-500">Implicações:</strong>');
  
  return formatted;
}

export function AnalysisResult({ contract, onExportPdf }: AnalysisResultProps) {
  // Ref para os conteúdos das abas
  const overviewRef = useRef<HTMLDivElement>(null);
  const changesRef = useRef<HTMLDivElement>(null);
  const deadlinesRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
  // Estado para acompanhar qual aba está ativa
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Função para exportar o conteúdo atual para PDF
  const exportToPdf = async () => {
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    let fileName = `${contract.name.replace(/\s+/g, '_')}`;
    
    console.log('Aba ativa:', activeTab); // Para debug
    
    // Determina qual ref usar com base na aba ativa
    switch(activeTab) {
      case 'detailed':
        targetRef = overviewRef;
        fileName += '_visao_geral';
        break;
      case 'alteracoes':
        targetRef = changesRef;
        fileName += '_alteracoes';
        break;
      case 'deadlines':
        targetRef = deadlinesRef;
        fileName += '_prazos';
        break;
      case 'recommendations':
        targetRef = recommendationsRef;
        fileName += '_recomendacoes';
        break;
      default:
        // Em caso de dúvida, tenta usar a referencia correta baseada no nome
        if (changesRef.current && activeTab.includes('alter')) {
          targetRef = changesRef;
          fileName += '_alteracoes';
        } else if (deadlinesRef.current && activeTab.includes('dead')) {
          targetRef = deadlinesRef;
          fileName += '_prazos';
        } else if (recommendationsRef.current && activeTab.includes('recom')) {
          targetRef = recommendationsRef;
          fileName += '_recomendacoes';
        } else {
          targetRef = overviewRef;
          fileName += '_visao_geral';
        }
        break;
    }
    
    if (targetRef?.current) {
      try {
        // Cria o canvas do elemento atual
        const canvas = await html2canvas(targetRef.current, {
          scale: 2, // Maior resolução
          useCORS: true,
          logging: true, // Ativar logs para debug
          allowTaint: true,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc, clonedElement) => {
            // Garante que o conteúdo clonado esteja visível
            console.log('Clonando para PDF, tamanho do elemento:', clonedElement.offsetHeight);
            // Expande qualquer conteúdo colapsado no clone
            const collapsedElements = clonedElement.querySelectorAll('.collapsed, [aria-hidden="true"]');
            collapsedElements.forEach(el => {
              (el as HTMLElement).style.display = 'block';
              (el as HTMLElement).style.visibility = 'visible';
              (el as HTMLElement).setAttribute('aria-hidden', 'false');
            });
          }
        });
        
        // Determina as dimensões do PDF baseado na proporção do conteúdo
        const imgWidth = 210; // A4 width in mm (210mm)
        const pageHeight = 297; // A4 height in mm (297mm)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Cria novo documento PDF em formato A4
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Adiciona informações do contrato no cabeçalho
        pdf.setFontSize(16);
        pdf.text(contract.name, 20, 25); // Aumentada a margem superior
        pdf.setFontSize(10);
        pdf.text(`Data da Análise: ${new Date(contract.uploadDate).toLocaleDateString('pt-BR')}`, 20, 32);
        
        // Adiciona imagem do conteúdo atual
        let position = 40; // Posição inicial após o cabeçalho - aumentada para dar mais espaço
        
        // Adiciona a imagem ao PDF
        // Verificar se o canvas tem conteúdo antes de adicionar ao PDF
        if (canvas.height > 50) { // Garantindo que há conteúdo significativo
          console.log('Adicionando imagem ao PDF, altura:', imgHeight, 'mm');
          pdf.addImage(
            canvas.toDataURL('image/png', 1.0), 
            'PNG', 
            20, // Margem esquerda aumentada
            position, 
            imgWidth - 40, // Largura com margens laterais maiores
            imgHeight * 0.85 // Altura mais reduzida para evitar cortes na margem inferior
          );
        } else {
          // Se o canvas estiver vazio/pequeno, adiciona um texto informativo
          pdf.setFontSize(12);
          pdf.setTextColor(255, 0, 0);
          pdf.text('Não foi possível capturar o conteúdo completo do documento.', 20, position + 20);
          pdf.text('Por favor, verifique se o conteúdo está visível na tela antes de exportar.', 20, position + 30);
          console.error('Canvas vazio ou muito pequeno na exportação para PDF.');
        }
        
        // Nova abordagem para gerar um PDF completo sem confusões para o usuário
        // Mostramos um indicador de carregamento enquanto o PDF é gerado
        
        // Removemos a geração do PDF parcial/temporário que estava causando confusão
        console.log('Iniciando geração de PDF completo...');
        
        // Mostramos um alerta de processamento para o usuário
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.background = 'rgba(255, 255, 255, 0.9)';
        loadingMessage.style.border = '1px solid #ddd';
        loadingMessage.style.borderRadius = '8px';
        loadingMessage.style.padding = '20px 30px';
        loadingMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.innerHTML = '<div style="font-weight: bold; margin-bottom: 10px">Gerando PDF</div><div>Por favor, aguarde enquanto o documento é preparado...</div>';
        document.body.appendChild(loadingMessage);
        
        // Agora vamos gerar um PDF completo usando html2canvas para todo o conteúdo
        try {
          html2canvas(targetRef.current, {
            scale: 1.5, // Um pouco menor para evitar problemas de memória
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: targetRef.current.scrollWidth,
            windowHeight: targetRef.current.scrollHeight,
            logging: false
          }).then(canvas => {
            // Criamos um novo PDF
            const fullPdf = new jsPDF('p', 'mm', 'a4');
            
            // Adicionamos o cabeçalho ao PDF
            fullPdf.setFontSize(16);
            fullPdf.text(contract.name, 20, 25);
            fullPdf.setFontSize(10);
            fullPdf.text(`Data da Análise: ${new Date(contract.uploadDate).toLocaleDateString('pt-BR')}`, 20, 32);
            
            // Calculamos as dimensões e quantas páginas serão necessárias
            const imgWidth = 170; // Largura menor para melhor qualidade (A4 width - margens)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Definimos a posição inicial após o cabeçalho
            let position = 40;
            
            // Adicionamos o conteúdo completo ao PDF
            fullPdf.addImage(
              canvas.toDataURL('image/jpeg', 0.95), // JPEG com alta qualidade para melhor balanço tamanho/qualidade
              'JPEG',
              20, // Margem esquerda
              position,
              imgWidth,
              imgHeight
            );
            
            // Calculamos quantas páginas são necessárias
            const pagesNeeded = Math.ceil(imgHeight / (pageHeight - 40)); // 40mm para cabeçalho e margens
            console.log(`O PDF terá ${pagesNeeded} páginas no total`);
            
            // Se precisarmos de mais de uma página
            for (let i = 1; i < pagesNeeded; i++) {
              fullPdf.addPage();
              
              // Calculamos a posição para a próxima página
              fullPdf.addImage(
                canvas.toDataURL('image/jpeg', 0.95),
                'JPEG',
                20, // Margem esquerda
                40 - (i * (pageHeight - 40)), // Deslocamento para mostrar a parte correta
                imgWidth,
                imgHeight
              );
            }
            
            // Removemos a mensagem de carregamento
            document.body.removeChild(loadingMessage);
            
            // Salvamos o PDF completo
            fullPdf.save(`${fileName}.pdf`);
            
            // Mostramos a mensagem de sucesso
            alert('PDF exportado com sucesso!');
          });
        } catch (err) {
          // Removemos a mensagem de carregamento em caso de erro
          document.body.removeChild(loadingMessage);
          
          console.error('Erro ao gerar PDF completo:', err);
          alert('Houve um erro ao gerar o PDF. Por favor, tente novamente.');
        }
        
        // Interrompemos a execução do método atual para evitar salvar duas vezes
        return;
        
        // Salva o PDF
        pdf.save(`${fileName}.pdf`);
        
        // Mostra mensagem de sucesso
        alert('PDF exportado com sucesso!');
      } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        alert('Ocorreu um erro ao exportar o PDF. Por favor, tente novamente.');
      }
    } else {
      alert('Não foi possível exportar o conteúdo. Tente novamente.');
    }
  };
  
  // Função interna para obter a badge de risco apropriada
  function getRiskBadge(severity: 'low' | 'medium' | 'high') {
    if (severity === 'high') {
      return <Badge variant="destructive" className="ml-2">Alto Risco</Badge>;
    } else if (severity === 'medium') {
      return <Badge className="ml-2 bg-orange-500">Médio Risco</Badge>;
    } else {
      return <Badge className="ml-2 bg-green-500">Baixo Risco</Badge>;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">{contract.name}</CardTitle>
            <CardDescription className="mt-1 text-gray-500">
              Enviado em {new Date(contract.uploadDate).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          {getRiskBadge(contract.analysis.riskLevel)}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Resumo</h3>
          <p className="text-gray-700">{contract.analysis.summary}</p>
        </div>

        <Tabs defaultValue="detailed" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="detailed" className="flex items-center gap-1">
              <FileSearch className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="alteracoes" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Alteração
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Prazos
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1">
              <LifeBuoy className="h-4 w-4" />
              Recomendações
              <span className="inline sm:hidden">Recom.</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detailed" className="mt-4">
            {!contract.analysis.legalAnalysis && !contract.analysis.content ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileSearch className="h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Análise detalhada não disponível</h3>
                <p className="text-gray-500 mt-1">Este contrato não possui análise detalhada.</p>
              </div>
            ) : contract.analysis.content ? (
              <div className="space-y-6 p-4 border rounded-lg" ref={overviewRef}>
                <h3 className="text-xl font-semibold mb-4">Análise Jurídica Detalhada</h3>
                <div className="markdown-content" 
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdownContent(contract.analysis.content) 
                  }}>
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold mb-6">Análise Jurídica Detalhada</h3>

                {/* 1. Clareza e precisão da linguagem */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔍</span>
                    <h4 className="text-lg font-medium">1. Clareza e Precisão da Linguagem</h4>
                  </div>
                  {contract.analysis.legalAnalysis.clarityAndPrecision?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.clarityAndPrecision.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.clarityAndPrecision?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.clarityAndPrecision.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.clarityAndPrecision?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.clarityAndPrecision.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.clarityAndPrecision?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.clarityAndPrecision.implications}</p>
                    </div>
                  )}
                </div>

                {/* 2. Cobertura adequada de termos essenciais */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📄</span>
                    <h4 className="text-lg font-medium">2. Cobertura Adequada dos Termos Essenciais</h4>
                  </div>
                  {contract.analysis.legalAnalysis.adequateCoverage?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.adequateCoverage.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.adequateCoverage?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.adequateCoverage.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.adequateCoverage?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.adequateCoverage.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.adequateCoverage?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.adequateCoverage.implications}</p>
                    </div>
                  )}
                </div>

                {/* 3. Proteção legal para as partes */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⚖️</span>
                    <h4 className="text-lg font-medium">3. Proteção Legal das Partes</h4>
                  </div>
                  {contract.analysis.legalAnalysis.legalProtection?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalProtection.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalProtection?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalProtection.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalProtection?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalProtection.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalProtection?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalProtection.implications}</p>
                    </div>
                  )}
                </div>

                {/* 4. Conformidade com leis e regulamentos */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">✅</span>
                    <h4 className="text-lg font-medium">4. Conformidade com Leis e Regulamentos</h4>
                  </div>
                  {contract.analysis.legalAnalysis.regulatoryCompliance?.positiveAspects && (
                    <div className="mb-3">
                      <p className="font-medium">Aspectos Positivos:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.regulatoryCompliance.positiveAspects}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.regulatoryCompliance?.improvementSuggestions && (
                    <div className="mb-3">
                      <p className="font-medium">Sugestões de Melhoria:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.regulatoryCompliance.improvementSuggestions}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.regulatoryCompliance?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.regulatoryCompliance.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.regulatoryCompliance?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.regulatoryCompliance.implications}</p>
                    </div>
                  )}
                </div>

                {/* 5. Ambiguidades ou Lacunas */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🕳️</span>
                    <h4 className="text-lg font-medium">5. Ambiguidades ou Lacunas</h4>
                  </div>
                  {contract.analysis.legalAnalysis.ambiguitiesOrGaps?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.ambiguitiesOrGaps.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.ambiguitiesOrGaps?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.ambiguitiesOrGaps.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.ambiguitiesOrGaps?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.ambiguitiesOrGaps.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.ambiguitiesOrGaps?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.ambiguitiesOrGaps.implications}</p>
                    </div>
                  )}
                </div>

                {/* 6. Riscos Potenciais */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-lg font-medium">6. Riscos Potenciais</h4>
                  </div>
                  {contract.analysis.legalAnalysis.potentialRisks?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.potentialRisks.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.potentialRisks?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.potentialRisks.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.potentialRisks?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.potentialRisks.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.potentialRisks?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.potentialRisks.implications}</p>
                    </div>
                  )}
                </div>

                {/* 7. Equilíbrio entre as Partes */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⚖️</span>
                    <h4 className="text-lg font-medium">7. Equilíbrio entre as Partes</h4>
                  </div>
                  {contract.analysis.legalAnalysis.partyBalance?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.partyBalance.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.partyBalance?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.partyBalance.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.partyBalance?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.partyBalance.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.partyBalance?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.partyBalance.implications}</p>
                    </div>
                  )}
                </div>

                {/* 8. Cláusulas de Resolução de Disputas */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">❌</span>
                    <h4 className="text-lg font-medium">8. Cláusulas de Resolução de Disputas</h4>
                  </div>
                  {contract.analysis.legalAnalysis.disputeResolution?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.disputeResolution.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.disputeResolution?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.disputeResolution.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.disputeResolution?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.disputeResolution.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.disputeResolution?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.disputeResolution.implications}</p>
                    </div>
                  )}
                </div>

                {/* 9. Definições de Termos-Chave */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🧾</span>
                    <h4 className="text-lg font-medium">9. Definições de Termos-Chave</h4>
                  </div>
                  {contract.analysis.legalAnalysis.keyTermDefinitions?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.keyTermDefinitions.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.keyTermDefinitions?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.keyTermDefinitions.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.keyTermDefinitions?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.keyTermDefinitions.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.keyTermDefinitions?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.keyTermDefinitions.implications}</p>
                    </div>
                  )}
                </div>

                {/* 10. Adaptabilidade a Mudanças Futuras */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔄</span>
                    <h4 className="text-lg font-medium">10. Adaptabilidade a Mudanças Futuras</h4>
                  </div>
                  {contract.analysis.legalAnalysis.futureAdaptability?.positiveAspects && (
                    <div className="mb-3">
                      <p className="font-medium">Aspectos Positivos:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.futureAdaptability.positiveAspects}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.futureAdaptability?.suggestion && (
                    <div className="mb-3">
                      <p className="font-medium">Sugestão:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.futureAdaptability.suggestion}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.futureAdaptability?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.futureAdaptability.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.futureAdaptability?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.futureAdaptability.implications}</p>
                    </div>
                  )}
                </div>

                {/* 11. Vulnerabilidades Legais */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🛡️</span>
                    <h4 className="text-lg font-medium">11. Vulnerabilidades Legais</h4>
                  </div>
                  {contract.analysis.legalAnalysis.legalVulnerabilities?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalVulnerabilities.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalVulnerabilities?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalVulnerabilities.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalVulnerabilities?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalVulnerabilities.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.legalVulnerabilities?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.legalVulnerabilities.implications}</p>
                    </div>
                  )}
                </div>

                {/* 12. Cláusulas de Pagamento */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💰</span>
                    <h4 className="text-lg font-medium">12. Cláusulas de Pagamento</h4>
                  </div>
                  {contract.analysis.legalAnalysis.paymentClauses?.positiveAspects && (
                    <div className="mb-3">
                      <p className="font-medium">Aspectos Positivos:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.paymentClauses.positiveAspects}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.paymentClauses?.problem && (
                    <div className="mb-3">
                      <p className="font-medium">Problema:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.paymentClauses.problem}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.paymentClauses?.recommendation && (
                    <div className="mb-3">
                      <p className="font-medium">Recomendação:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.paymentClauses.recommendation}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.paymentClauses?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.paymentClauses.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.paymentClauses?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.paymentClauses.implications}</p>
                    </div>
                  )}
                </div>

                {/* 13. Confidencialidade */}
                <div className="mb-8 border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🤐</span>
                    <h4 className="text-lg font-medium">13. Confidencialidade</h4>
                  </div>
                  {contract.analysis.legalAnalysis.confidentiality?.positiveAspects && (
                    <div className="mb-3">
                      <p className="font-medium">Aspectos Positivos:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.confidentiality.positiveAspects}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.confidentiality?.suggestion && (
                    <div className="mb-3">
                      <p className="font-medium">Sugestão:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.confidentiality.suggestion}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.confidentiality?.justification && (
                    <div className="mb-3">
                      <p className="font-medium">Justificativa:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.confidentiality.justification}</p>
                    </div>
                  )}
                  {contract.analysis.legalAnalysis.confidentiality?.implications && (
                    <div className="mb-3">
                      <p className="font-medium">Implicações:</p>
                      <p className="text-gray-700">{contract.analysis.legalAnalysis.confidentiality.implications}</p>
                    </div>
                  )}
                </div>

                {/* Cláusulas Inovadoras e Positivas */}
                <div className="mt-10 pt-6 bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🌟</span>
                    <h4 className="text-lg font-medium">Cláusulas Inovadoras e Positivas</h4>
                  </div>
                  <p className="text-gray-700">Cláusulas bem elaboradas ou inovadoras encontradas no contrato:</p>
                  {/* Aqui poderia ser inserido um campo para exibir cláusulas inovadoras, se houver */}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alteracoes" className="mt-4">
            <div ref={changesRef}>
            {!contract.analysis.alteracoes || contract.analysis.alteracoes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-blue-500 mb-2" />
                <h3 className="text-lg font-medium">Sem alterações necessárias</h3>
                <p className="text-gray-500 mt-1">Não encontramos cláusulas que precisem de modificações.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Sugestão para as cláusulas apontadas</h3>
                  <p className="text-gray-600">As alterações abaixo incorporam clareza, precisão, segurança jurídica e equilíbrio entre as partes.</p>
                </div>
                
                {contract.analysis.alteracoes.map((alteracao) => (
                  <div key={alteracao.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                    {/* Título da cláusula em negrito */}
                    <h4 className="font-bold mb-3">{alteracao.title}</h4>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-blue-600 mb-2">Texto Corrigido:</p>
                      <div className="p-3 bg-blue-50 rounded text-gray-800 border-l-4 border-blue-500">
                        <p dangerouslySetInnerHTML={{ __html: formatMarkdownContent(alteracao.correctedText) }} />
                      </div>
                    </div>
                    
                    {/* Justificativa abaixo do texto corrigido - sempre exibe mesmo quando vazia */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Justificativa:</p>
                      <div className="p-3 bg-yellow-50 rounded text-gray-700 text-sm border-l-4 border-yellow-300">
                        {alteracao.justification ? (
                          <p dangerouslySetInnerHTML={{ 
                            __html: formatMarkdownContent(
                              // Remove o prefixo '> Justificativa:' ou 'Justificativa:' que pode estar duplicado
                              (alteracao.justification || '')
                                .replace(/^>\s*Justificativa:\s*/i, '')
                                .replace(/^Justificativa:\s*/i, '')
                            ) 
                          }} />
                        ) : (
                          <p className="italic text-gray-500">A inclusão desta cláusula é importante para garantir a segurança jurídica e o equilíbrio contratual entre as partes.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </TabsContent>
          
          <TabsContent value="deadlines" className="mt-4">
            <div ref={deadlinesRef}>
            {contract.analysis.deadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <XCircle className="h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Sem prazos identificados</h3>
                <p className="text-gray-500 mt-1">Não encontramos prazos específicos neste contrato.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contract.analysis.deadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{deadline.title}</h4>
                      <Badge className="bg-contrato-500">
                        {new Date(deadline.date).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                    <p className="mt-2 text-gray-700">{deadline.description}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4">
            <div ref={recommendationsRef}>
            {contract.analysis.recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <XCircle className="h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Sem recomendações</h3>
                <p className="text-gray-500 mt-1">Não temos recomendações específicas para este contrato.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contract.analysis.recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="p-4 rounded-lg border">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="mt-2 text-gray-700">{recommendation.description}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={exportToPdf} 
          className="flex items-center gap-2 bg-contrato-600 hover:bg-contrato-700"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
