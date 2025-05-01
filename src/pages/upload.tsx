
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle, Upload as UploadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
// Importação do serviço de API
import axios from "axios";
// Importação dos serviços de autenticação e contratos
import { useAuth } from "@/lib/auth/auth-context";
import { saveContract } from "@/lib/services/contract-service";

export default function Upload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa fazer login para analisar contratos.",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
    } else {
      setFile(null);
    }
  };

  // Função para extrair cláusulas alteradas do texto
  const extrairClausulasAlteradas = (texto: string) => {
    // Verifica se o texto começa com a frase padrão
    if (!texto.includes("Segue sugestão para as cláusulas apontadas")) {
      return [];
    }
    
    // Divide o texto em blocos por cláusulas 
    // Cada bloco representa uma cláusula ou seção independente
    const blocos = texto.split(/\n\s*\n+/).filter(bloco => bloco.trim().length > 0);
    const clausulas = [];
    let clausulaAtual = null;
    let clausulaId = 1;

    // Expressão regular para identificar títulos de cláusulas
    const regexClausula = /CLÁUSULA\s+([\w\d]+)[:\-\s]*(.*)/i;
    // Expressão regular para identificar parágrafos com marcações
    const regexAlteracao = /(~~.+?~~|\*\*.+?\*\*)/;

    for (const bloco of blocos) {
      // Verifica se é um título de cláusula
      const matchClausula = bloco.trim().match(regexClausula);
      
      if (matchClausula) {
        // Encontrou um título de cláusula
        clausulaAtual = {
          id: `clausula-${clausulaId++}`,
          title: bloco.trim(),
          originalText: '',
          correctedText: '',
          justification: ''
        };
        continue;
      }
      
      // Se o bloco contém indicações de alteração (tachado ou negrito)
      // e estamos em uma cláusula identificada
      if (clausulaAtual && (bloco.includes('~~') || bloco.includes('**'))) {
        // Encontrar parágrafos alterados dentro do bloco
        const paragrafos = bloco.split('\n').filter(p => p.trim().length > 0);
        let temAlteracao = false;
        let textoOriginal = '';
        let textoCorrigido = '';
        let justificativa = '';
        
        // Processar os parágrafos
        for (const paragrafo of paragrafos) {
          // Se é uma justificativa
          if (paragrafo.startsWith('>') || paragrafo.toLowerCase().includes('justificativa:')) {
            justificativa += paragrafo.replace(/^\s*>\s*/, '') + '\n';
            temAlteracao = true;
            continue;
          }
          
          // Se contém marcação de alteração
          if (paragrafo.match(regexAlteracao)) {
            // Verificar se tem texto tachado (original)
            if (paragrafo.includes('~~')) {
              textoOriginal += paragrafo + '\n';
              temAlteracao = true;
            }
            // Verificar se tem texto em negrito (correção)
            if (paragrafo.includes('**')) {
              textoCorrigido += paragrafo + '\n';
              temAlteracao = true;
            }
          }
        }
        
        // Se identificamos alterações, adicionar esta cláusula
        if (temAlteracao) {
          clausulas.push({
            id: clausulaAtual.id,
            title: clausulaAtual.title,
            originalText: textoOriginal.trim(),
            correctedText: textoCorrigido.trim() || bloco.trim(), // Usar todo o bloco se não houver correção explícita
            justification: justificativa.trim()
          });
        }
      }
      // Verificar se o bloco é uma justificativa isolada
      else if (clausulaAtual && (bloco.startsWith('>') || bloco.toLowerCase().includes('justificativa:'))) {
        // Adicionar justificativa à última cláusula adicionada
        if (clausulas.length > 0) {
          const ultimaClausula = clausulas[clausulas.length - 1];
          ultimaClausula.justification += '\n' + bloco.replace(/^\s*>\s*/gm, '').trim();
        }
      }
    }
    
    // Se não conseguimos extrair cláusulas específicas, tentar uma abordagem alternativa
    if (clausulas.length === 0) {
      // Tentativa de extração alternativa - procurar por blocos com formatação de alteração
      for (const bloco of blocos) {
        if (bloco.includes('~~') || bloco.includes('**')) {
          clausulas.push({
            id: `clausula-${clausulaId++}`,
            title: 'Cláusula identificada com alterações',
            originalText: bloco.match(/~~([^~]+)~~/g)?.join('\n') || '',
            correctedText: bloco.match(/\*\*([^*]+)\*\*/g)?.join('\n') || bloco,
            justification: 'Alteração sugerida com base na análise jurídica.'
          });
        }
      }
      
      // Se ainda não encontramos nada, usar o texto completo
      if (clausulas.length === 0) {
        clausulas.push({
          id: 'sugestoes-gerais',
          title: 'Sugestões de Alterações',
          originalText: 'Versão original não identificada.',
          correctedText: texto,
          justification: 'Sugestões baseadas na análise jurídica realizada.'
        });
      }
    }
    
    return clausulas;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificação baseada na aba ativa
    if (activeTab === "upload" && !file) {
      setError("Selecione um arquivo para analisar");
      return;
    } else if (activeTab === "text" && (!inputText || inputText.trim().length < 30)) {
      setError("Insira um texto de contrato válido (mínimo de 30 caracteres)");
      return;
    }

    try {
      // Iniciar processo de carregamento
      setIsUploading(true);
      setError(null);
      
      let response;
      
      // Lógica baseada na aba ativa
      if (activeTab === "upload" && file) {
        // Upload de arquivo e análise via API backend
        const formData = new FormData();
        formData.append('arquivo', file);
        
        // Enviar arquivo para o backend
        response = await axios.post('http://localhost:3000/analisar-arquivo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // Configurar um timeout maior, pois a análise pode demorar
          timeout: 120000 // 2 minutos
        });
      } else {
        // Análise direta do texto inserido
        response = await axios.post('http://localhost:3000/analisar-texto', {
          texto: inputText
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minutos
        });
      }
      
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Processar a resposta do backend
      setIsAnalyzing(true);
      
      // Verificar se a resposta contém os dados esperados
      const { success, fileName, analysis, format } = response.data;
      
      if (success && analysis) {
        // Processar a análise baseada no formato
        let processedAnalysis;
        
        if (format === "text") {
          // Processar texto em markdown
          // Extrair nível de risco do texto
          let riskLevel = "medium";
          if (analysis.includes("**NÍVEL DE RISCO**: Alto") || analysis.includes("⭐ **NÍVEL DE RISCO**: Alto")) {
            riskLevel = "high";
          } else if (analysis.includes("**NÍVEL DE RISCO**: Baixo") || analysis.includes("⭐ **NÍVEL DE RISCO**: Baixo")) {
            riskLevel = "low";
          }
          
          // Extrair resumo do texto
          let summary = "";
          const summaryMatch = analysis.match(/📝 \*\*RESUMO FACTUAL\*\*: ([^\n]+)/i) || 
                             analysis.match(/\*\*RESUMO FACTUAL\*\*: ([^\n]+)/i);
          if (summaryMatch && summaryMatch[1]) {
            summary = summaryMatch[1];
          }
          
          // Criar objeto compatível com a estrutura esperada
          processedAnalysis = {
            riskLevel,
            summary: summary || "Resumo da análise do contrato não disponível.",
            content: analysis, // Guardar texto completo para exibição alternativa
            risks: [],
            deadlines: [],
            recommendations: [],
            alteracoes: [] // Para as cláusulas alteradas
          };
          
          // Extrair recomendações da seção específica de RECOMENDAÇÕES
          let recLines: string[] = [];
          
          // Procurar na seção de recomendações (final do documento)
          const recSection = analysis.match(/💡 \*\*RECOMENDAÇÕES\*\*:[\s\S]*?(?=\n\n|$)/i) || 
                             analysis.match(/\*\*RECOMENDAÇÕES\*\*:[\s\S]*?(?=\n\n|$)/i) ||
                             analysis.match(/👍 \*\*RECOMENDAÇÕES GERAIS\*\*[\s\S]*?(?=\n\n|$)/i) ||
                             analysis.match(/\*\*RECOMENDAÇÕES GERAIS\*\*[\s\S]*?(?=\n\n|$)/i);

          if (recSection) {
            // Extrair linhas de recomendações
            const sectionLines = recSection[0].split('\n').filter(line => line.trim().startsWith('- ') || 
                                                                   (line.trim().match(/^\d+\./) && !line.includes("**")));
            recLines = [...recLines, ...sectionLines];
          }
          
          // Buscar também recomendações dentro da análise detalhada
          const detailedSection = analysis.match(/🔎 \*\*ANÁLISE JURÍDICA\*\*:[\s\S]*?(?=\n\n|$)/i) ||
                                 analysis.match(/\*\*ANÁLISE JURÍDICA\*\*:[\s\S]*?(?=\n\n|$)/i);
          
          if (detailedSection) {
            // Extrair partes que contêm a palavra "Recomendação:"
            const detailedText = detailedSection[0];
            const recMatches = detailedText.match(/\*\*Recomendação\*\*:\s*(.*?)(?=\*\*|$)/gi);
            
            if (recMatches && recMatches.length > 0) {
              const formattedRecs = recMatches.map(match => {
                // Extrair apenas o texto da recomendação
                const content = match.replace(/\*\*Recomendação\*\*:\s*/i, '').trim();
                return `- ${content}`;
              });
              
              recLines = [...recLines, ...formattedRecs];
            }
          }
          
          // Remover duplicatas e processar as recomendações
          const uniqueRecs = [...new Set(recLines)];
          
          if (uniqueRecs.length > 0) {
            processedAnalysis.recommendations = uniqueRecs.map((line, index) => ({
              id: `rec${index + 1}`,
              title: line.replace(/^-\s+|^\d+\.\s+/, '').trim(),
              description: ""
            }));
          }
          
          // Extrair prazos
          const deadlineSection = analysis.match(/⏰ \*\*PRAZOS\*\*:[\s\S]*?(?=\n\n|$)/i);
          if (deadlineSection) {
            const deadlineLines = deadlineSection[0].split('\n').filter(line => line.trim().startsWith('- '));
            processedAnalysis.deadlines = deadlineLines.map((line, index) => ({
              id: `d${index + 1}`,
              title: line.replace('- ', '').trim(),
              date: new Date().toISOString(), // Data padrão
              description: ""
            }));
          }
          
          // Extrair riscos
          const riskSection = analysis.match(/🛑 \*\*RISCOS\*\*:[\s\S]*?(?=\n\n|$)/i) || 
                            analysis.match(/\*\*RISCOS\*\*:[\s\S]*?(?=\n\n|$)/i) ||
                            analysis.match(/💡 \*\*ANÁLISE JURÍDICA\*\*:[\s\S]*?(?=\n\n|$)/i);
          
          if (riskSection) {
            const riskLines = riskSection[0].split('\n')
              .filter(line => line.trim().startsWith('- ') && 
                            (line.toLowerCase().includes('risco') || 
                             line.toLowerCase().includes('problema') ||
                             line.toLowerCase().includes('vulnerabilidade')));
            
            // Se encontrou riscos, processar cada um
            if (riskLines.length > 0) {
              processedAnalysis.risks = riskLines.map((line, index) => {
                // Determinar a severidade baseada no texto
                let severity = "medium" as "low" | "medium" | "high";
                if (line.toLowerCase().includes('alto risco') || 
                    line.toLowerCase().includes('grave') || 
                    line.toLowerCase().includes('crítico')) {
                  severity = "high";
                } else if (line.toLowerCase().includes('baixo risco') || 
                           line.toLowerCase().includes('leve') || 
                           line.toLowerCase().includes('mínimo')) {
                  severity = "low";
                }
                
                return {
                  id: `r${index + 1}`,
                  title: line.replace('- ', '').trim(),
                  description: "",
                  severity: severity
                };
              });
            }
          }
        } else {
          // Formato já é JSON ou outro formato estruturado
          processedAnalysis = analysis;
        }
        
        // Buscar alterações sugeridas para as cláusulas
        try {
          setIsAnalyzing(true);
          
          // Chamada à API para obter alterações de cláusulas
          const alteracoesResponse = await axios.post('http://localhost:3000/alterar-clausulas', {
            analise: analysis
          }, {
            timeout: 180000 // 3 minutos para evitar timeout
          });
          
          if (alteracoesResponse.data.success && alteracoesResponse.data.alteracoes) {
            // Processar as alterações sugeridas
            const textoAlteracoes = alteracoesResponse.data.alteracoes;
            
            // Extrair cláusulas do texto de alterações
            const clausulas = extrairClausulasAlteradas(textoAlteracoes);
            
            // Garantir que cada cláusula tenha um ID único
            const clausulasComIdUnico = clausulas.map((clausula, index) => ({
              ...clausula,
              id: `clausula-${index + 1}-${Date.now().toString().slice(-4)}` // Adiciona timestamp parcial para garantir unicidade
            }));
            
            // Adicionar as alterações ao objeto de análise
            processedAnalysis.alteracoes = clausulasComIdUnico;
          } else {
            // Adicionar array vazio para evitar erros ao acessar alterações
            processedAnalysis.alteracoes = [];
          }
        } catch (alteracoesError) {
          console.error("Erro ao obter alterações sugeridas:", alteracoesError);
          // Adicionar array vazio para evitar erros ao acessar alterações
          processedAnalysis.alteracoes = [];
        } finally {
          // Finalizar o processo de análise
          setIsAnalyzing(false);
          
          // Salvar análise no localStorage (para compatibilidade com código existente)
          localStorage.setItem('lastAnalysis', JSON.stringify(processedAnalysis));
          
          // Definir nome do arquivo/documento baseado na fonte
          const documentName = fileName || (file ? file.name : `Texto_${new Date().toISOString().split('T')[0]}`);
          
          // IMPORTANTE: Salvar contrato no sistema para o usuário atual
          if (user) {
            try {
              // Mapear nível de risco de inglês para português
              const mapRiskLevel = (risk: string): 'alto' | 'medio' | 'baixo' => {
                if (risk === 'high') return 'alto';
                if (risk === 'low') return 'baixo';
                return 'medio';
              };
              
              // Criar objeto do contrato no formato esperado
              const newContract = {
                userId: user.id,
                name: documentName,
                content: activeTab === "upload" ? (file ? file.name : documentName) : inputText.substring(0, 100) + "...",
                analysis: analysis, // Texto completo da análise
                riskLevel: mapRiskLevel(processedAnalysis.riskLevel),
                recommendations: processedAnalysis.recommendations.map(rec => rec.title).join("\n"),
                deadlines: processedAnalysis.deadlines.map(deadline => deadline.title).join("\n")
              };
              
              // Salvar no serviço de contratos
              const savedContract = saveContract(newContract);
              
              if (savedContract) {
                toast({
                  title: "Contrato salvo",
                  description: "O contrato foi analisado e salvo com sucesso!"
                });
                
                // Armazenar resultado da análise na sessionStorage com o ID correto do contrato salvo
                sessionStorage.setItem('contractAnalysis', JSON.stringify({
                  id: savedContract.id,
                  name: documentName,
                  uploadDate: new Date().toISOString(),
                  analysis: processedAnalysis
                }));
                
                // Navegar diretamente para a página de detalhes do contrato com as abas de análise
                navigate(`/contracts/${savedContract.id}`);
              }
            } catch (saveError) {
              console.error("Erro ao salvar contrato:", saveError);
              toast({
                title: "Atenção",
                description: "O contrato foi analisado, mas houve um erro ao salvá-lo no seu painel.",
                variant: "destructive"
              });
            }
          }
          
          // Se não conseguiu salvar o contrato (por exemplo, usuário não logado),
          // ainda permite ver o resultado da análise mas com ID temporário
          if (!user) {
            // Armazenar resultado da análise na sessionStorage para recuperar na página de detalhes
            sessionStorage.setItem('contractAnalysis', JSON.stringify({
              id: "temp-" + new Date().getTime(),
              name: documentName || (file ? file.name : `Texto_${new Date().toISOString().split('T')[0]}`),
              uploadDate: new Date().toISOString(),
              analysis: processedAnalysis
            }));
            
            // Navegar para página temporária de visualização
            navigate(`/contracts/temp`);
          }
        }
        
        // Redirecionamento para página de resultados
      } else {
        throw new Error("Resposta inválida do servidor");
      }
      
    } catch (err) {
      setIsUploading(false);
      setIsAnalyzing(false);
      
      // Tratar mensagens de erro específicas da API
      if (axios.isAxiosError(err) && err.response) {
        // Erro com resposta do servidor
        const errorMessage = err.response.data?.message || err.response.data?.error || "Erro ao comunicar com o servidor";
        setError(`Erro: ${errorMessage}`);
      } else {
        // Outros erros
        setError("Ocorreu um erro ao processar o arquivo. Tente novamente.");
      }
      
      console.error("Erro ao analisar contrato:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Analisar Contrato</h1>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Analisar Contrato</CardTitle>
                <CardDescription>
                  Faça upload ou insira o texto do seu contrato para análise automática com IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {uploadSuccess && !isAnalyzing && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-700">Envio concluído</AlertTitle>
                      <AlertDescription className="text-green-600">
                        {activeTab === "upload" ? "Seu arquivo foi carregado com sucesso." : "Seu texto foi enviado com sucesso."}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Tabs
                    defaultValue="upload"
                    value={activeTab}
                    onValueChange={(value) => {
                      setActiveTab(value);
                      setError(null);
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <UploadIcon className="h-4 w-4" />
                        Upload de Arquivo
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Inserir Texto
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-4">
                      <FileUpload 
                        onFileSelect={handleFileSelect}
                        isLoading={isUploading || isAnalyzing}
                        className="h-64"
                      />
                    </TabsContent>
                    
                    <TabsContent value="text" className="mt-4">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Cole ou digite o texto do contrato aqui..."
                          className="min-h-[250px] font-mono text-sm"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          disabled={isUploading || isAnalyzing}
                        />
                        <p className="text-xs text-gray-500">
                          Cole o texto completo do contrato para obter os melhores resultados. Mínimo de 30 caracteres.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {isAnalyzing && (
                    <div className="rounded-lg border p-4 bg-contrato-50">
                      <div className="flex items-center gap-4">
                        <Loader2 className="h-5 w-5 text-contrato-600 animate-spin" />
                        <div>
                          <p className="font-medium">Analisando contrato</p>
                          <p className="text-sm text-gray-500">
                            Nossa IA está extraindo insights do seu documento...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={(activeTab === "upload" && !file) || 
                  (activeTab === "text" && (!inputText || inputText.trim().length < 30)) || 
                  isUploading || 
                  isAnalyzing || 
                  !isAuthenticated}
                  className="bg-contrato-400 hover:bg-contrato-500"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    "Analisar Contrato"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
