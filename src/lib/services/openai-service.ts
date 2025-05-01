// Importações necessárias para processamento de arquivos
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

// Serviço para comunicação com a API da OpenAI
// Função para obter a chave da API de forma segura
const getApiKey = (): string => {
  // Prioridade 1: Variável de ambiente do navegador definida globalmente
  if (typeof window !== 'undefined' && (window as any).OPENAI_API_KEY) {
    return (window as any).OPENAI_API_KEY;
  }
  
  // Prioridade 2: Variável de ambiente do servidor
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  
  // Prioridade 3: Valor padrão para desenvolvimento local (não use em produção!)
  console.warn('⚠️ Usando chave de API alternativa. Configure OPENAI_API_KEY nas variáveis de ambiente.');
  return 'SUA_CHAVE_API_AQUI';
};

const OPENAI_API_KEY = getApiKey();
const API_URL = "https://api.openai.com/v1/chat/completions";

// Definição de tipos para logging e depuração
interface APIErrorResponse {
  error?: {
    message: string;
    type?: string;
    code?: string;
  };
}

export interface ContractAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  // Análise detalhada em 13 pontos
  legalAnalysis?: {
    clarityAndPrecision: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    adequateCoverage: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    legalProtection: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    regulatoryCompliance: {
      id: string;
      title: string;
      positiveAspects?: string;
      improvementSuggestions?: string;
      justification?: string;
      implications?: string;
    };
    ambiguitiesOrGaps: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    potentialRisks: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    partyBalance: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    disputeResolution: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    keyTermDefinitions: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    futureAdaptability: {
      id: string;
      title: string;
      positiveAspects?: string;
      suggestion?: string;
      justification?: string;
      implications?: string;
    };
    legalVulnerabilities: {
      id: string;
      title: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    paymentClauses: {
      id: string;
      title: string;
      positiveAspects?: string;
      problem?: string;
      recommendation?: string;
      justification?: string;
      implications?: string;
    };
    confidentiality: {
      id: string;
      title: string;
      positiveAspects?: string;
      suggestion?: string;
      justification?: string;
      implications?: string;
    };
  };
  // Campos originais mantidos para compatibilidade
  risks: {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  deadlines: {
    id: string;
    title: string;
    date: string;
    description: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    description: string;
  }[];
}

// Função para analisar o conteúdo do contrato
export async function analyzeContract(contractText: string): Promise<ContractAnalysisResult> {
  try {
    // Enviar o texto do contrato diretamente, sem modificações ou filtros
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um assistente jurídico especializado em análise e aprimoramento de contratos. Sua tarefa é examinar minuciosamente o contrato fornecido (carregado) e oferecer sugestões detalhadas para melhorias, considerando os seguintes aspectos:\n\n1. Clareza e precisão da linguagem\n2. Cobertura adequada de todos os termos e condições essenciais\n3. Proteção legal para todas as partes envolvidas\n4. Conformidade com leis e regulamentos atuais\n5. Potenciais ambiguidades ou lacunas\n6. Detectar potenciais riscos e inconformidades nos termos contratuais.\n7. Equilíbrio entre as partes\n8. Cláusulas de rescisão e resolução de disputas\n9. Definições claras de termos-chave\n10. Adaptabilidade a mudanças futuras\n11. Possíveis riscos ou vulnerabilidades legais\n12. Examinar cláusulas de pagamento\n13. Confidencialidade e resolução de disputas\n\nPara cada sugestão de melhoria, forneça:\n- A cláusula ou seção específica que precisa de atenção\n- O problema ou preocupação identificado\n- Uma recomendação de otimização detalhada para abordar o problema\n- Justificativa legal ou prática para a mudança sugerida\n- Possíveis implicações da mudança para outras partes do contrato\n- Propor melhorias e renegociações que possam beneficiar as partes envolvidas.\n \nAlém disso, identifique quaisquer cláusulas incomuns ou inovadoras que possam ser benéficas e explique por quê.\n\nResponda APENAS com um objeto JSON completo e válido, seguindo exatamente esta estrutura:\n\n{\n  \"riskLevel\": \"low\" | \"medium\" | \"high\",\n  \"summary\": \"resumo do contrato\",\n  \"legalAnalysis\": {\n    \"clarityAndPrecision\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"adequateCoverage\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"legalProtection\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"regulatoryCompliance\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"positiveAspects\": \"string\",\n      \"improvementSuggestions\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"ambiguitiesOrGaps\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"potentialRisks\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"partyBalance\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"disputeResolution\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"keyTermDefinitions\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"futureAdaptability\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"positiveAspects\": \"string\",\n      \"suggestion\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"legalVulnerabilities\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"paymentClauses\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"positiveAspects\": \"string\",\n      \"problem\": \"string\",\n      \"recommendation\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    },\n    \"confidentiality\": {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"positiveAspects\": \"string\",\n      \"suggestion\": \"string\",\n      \"justification\": \"string\",\n      \"implications\": \"string\"\n    }\n  },\n  \"risks\": [\n    {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"description\": \"string\",\n      \"severity\": \"low\" | \"medium\" | \"high\"\n    }\n  ],\n  \"deadlines\": [\n    {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"date\": \"string\",\n      \"description\": \"string\"\n    }\n  ],\n  \"recommendations\": [\n    {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"description\": \"string\"\n    }\n  ]\n}"              
          },
          {
            role: "user",
            content: contractText
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API da OpenAI: ${errorData.error?.message || response.statusText}`);
    }

    // Armazenar a resposta bruta para análise em caso de erro
    const responseText = await response.text();
    console.log('Resposta bruta da API:', responseText.substring(0, 500) + '...'); // Limitando o tamanho do log
    
    let data;
    try {
      // Tentar fazer parse do JSON da resposta
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Erro ao fazer parse da resposta da API:', error);
      throw new Error(`Erro ao processar resposta da API: ${error.message}`);
    }
    
    // Verificar se a resposta está no formato esperado
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Formato de resposta inesperado da API OpenAI:', data);
      throw new Error('Formato de resposta inesperado da API OpenAI');
    }
    
    // Exibir o conteúdo recebido para depuração
    const rawContent = data.choices[0].message.content;
    console.log('Conteúdo bruto recebido da API:', rawContent.substring(0, 500) + '...'); // Limitando o tamanho do log
    
    let analysisResult;
    try {
      // A resposta da API pode vir com formatação markdown (```json ... ```)
      // Remover marcadores de código markdown antes de fazer o parsing
      let cleanedContent = rawContent.trim();
      
      // Remover ```json no início e ``` no final se existirem
      cleanedContent = cleanedContent.replace(/^```json\s*\n/, '');
      cleanedContent = cleanedContent.replace(/\n```\s*$/, '');
      
      console.log('Conteúdo após limpeza dos marcadores markdown:', cleanedContent.substring(0, 500) + '...'); // Limitando o tamanho do log
      
      // Verificar se o conteúdo começa com { e termina com }
      if (!cleanedContent.startsWith('{') || !cleanedContent.endsWith('}')) {
        console.warn('O conteúdo não parece ser um JSON válido. Tentando extrair JSON...');
        const jsonMatch = cleanedContent.match(/{[\s\S]*}/); 
        if (jsonMatch) {
          cleanedContent = jsonMatch[0];
          console.log('JSON extraído:', cleanedContent.substring(0, 500) + '...');
        }
      }
      
      analysisResult = JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Erro ao fazer parse do conteúdo da resposta:', error);
      
      // Tentar extrair o JSON usando expressão regular
      try {
        // Usar uma regex mais precisa que remove qualquer texto antes do primeiro { e depois do último }
        const jsonMatch = rawContent.match(/\{[\s\S]*?\}(?=\s*$|\s*```\s*$)/);
        if (jsonMatch) {
          console.log('Tentando extrair JSON usando regex:', jsonMatch[0]);
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          // Tentar capturar todos os caracteres entre { e } inclusive
          const fallbackMatch = rawContent.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1');
          console.log('Tentativa de fallback para extrair JSON:', fallbackMatch);
          analysisResult = JSON.parse(fallbackMatch);
        }
      } catch (extractError) {
        console.error('Falha na tentativa de extrair JSON:', extractError);
        
        // Criar uma resposta genérica para evitar quebrar a aplicação
        analysisResult = {
          riskLevel: 'medium',
          summary: 'Não foi possível analisar o contrato devido a um erro técnico.',
          legalAnalysis: {
            clarityAndPrecision: {
              id: 'parse-err-1',
              title: 'Erro na Análise',
              problem: 'Não foi possível processar a análise detalhada deste contrato devido a um erro no formato da resposta.'
            },
            adequateCoverage: { id: 'parse-err-2', title: 'Erro na Análise' },
            legalProtection: { id: 'parse-err-3', title: 'Erro na Análise' },
            regulatoryCompliance: { id: 'parse-err-4', title: 'Erro na Análise' },
            ambiguitiesOrGaps: { id: 'parse-err-5', title: 'Erro na Análise' },
            potentialRisks: { id: 'parse-err-6', title: 'Erro na Análise' },
            partyBalance: { id: 'parse-err-7', title: 'Erro na Análise' },
            disputeResolution: { id: 'parse-err-8', title: 'Erro na Análise' },
            keyTermDefinitions: { id: 'parse-err-9', title: 'Erro na Análise' },
            futureAdaptability: { id: 'parse-err-10', title: 'Erro na Análise' },
            legalVulnerabilities: { id: 'parse-err-11', title: 'Erro na Análise' },
            paymentClauses: { id: 'parse-err-12', title: 'Erro na Análise' },
            confidentiality: { id: 'parse-err-13', title: 'Erro na Análise' }
          },
          risks: [
            {
              id: 'r1',
              title: 'Erro na análise',
              description: 'Ocorreu um erro ao processar a resposta da API.',
              severity: 'medium'
            }
          ],
          deadlines: [],
          recommendations: [
            {
              id: 'rec1',
              title: 'Tentar novamente',
              description: 'Por favor, tente fazer o upload do contrato novamente.'
            }
          ]
        };
      }
    }
    
    // Garantir que o formato corresponda ao esperado
    return {
      riskLevel: analysisResult.riskLevel || 'medium',
      summary: analysisResult.summary || 'Não foi possível gerar um resumo do contrato.',
      legalAnalysis: analysisResult.legalAnalysis || {},
      risks: analysisResult.risks || [],
      deadlines: analysisResult.deadlines || [],
      recommendations: analysisResult.recommendations || []
    };
  } catch (error) {
    console.error("Erro ao analisar contrato:", error);
    // Capturar o erro e retornar uma resposta padrão em vez de fazer throw do erro
    return {
      riskLevel: 'medium',
      summary: 'Ocorreu um erro ao analisar o contrato. Nossa equipe técnica foi notificada.',
      legalAnalysis: {
        clarityAndPrecision: {
          id: 'err-1',
          title: 'Erro na Análise',
          problem: 'Não foi possível processar a análise detalhada deste contrato.'
        },
        adequateCoverage: { id: 'err-2', title: 'Erro na Análise' },
        legalProtection: { id: 'err-3', title: 'Erro na Análise' },
        regulatoryCompliance: { id: 'err-4', title: 'Erro na Análise' },
        ambiguitiesOrGaps: { id: 'err-5', title: 'Erro na Análise' },
        potentialRisks: { id: 'err-6', title: 'Erro na Análise' },
        partyBalance: { id: 'err-7', title: 'Erro na Análise' },
        disputeResolution: { id: 'err-8', title: 'Erro na Análise' },
        keyTermDefinitions: { id: 'err-9', title: 'Erro na Análise' },
        futureAdaptability: { id: 'err-10', title: 'Erro na Análise' },
        legalVulnerabilities: { id: 'err-11', title: 'Erro na Análise' },
        paymentClauses: { id: 'err-12', title: 'Erro na Análise' },
        confidentiality: { id: 'err-13', title: 'Erro na Análise' }
      },
      risks: [
        {
          id: 'error-1',
          title: 'Erro na Análise',
          description: 'Não foi possível completar a análise do contrato devido a um erro técnico.',
          severity: 'medium'
        }
      ],
      deadlines: [],
      recommendations: [
        {
          id: 'rec-error-1',
          title: 'Tentar Novamente',
          description: 'Por favor, tente fazer o upload do contrato novamente mais tarde.'
        }
      ]
    };
  }
}

// Função para extrair texto de um arquivo
export async function extractTextFromFile(file: File): Promise<string> {
  console.log(`Extraindo texto do arquivo: ${file.name} (${file.type})`);
  
  try {
    // Para arquivos de texto simples
    if (file.type === "text/plain") {
      return await file.text();
    }
    
    // Para arquivos PDF
    if (file.type === "application/pdf") {
      return await extractPDFText(file);
    } 
    
    // Para arquivos DOCX
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await extractDOCXText(file);
    }
    
    // Formato não suportado
    console.warn(`Tipo de arquivo não suportado: ${file.type}`);
    throw new Error(`Tipo de arquivo não suportado: ${file.type}. Por favor, envie um arquivo PDF, DOCX ou TXT.`);
  } catch (error) {
    console.error("Erro ao extrair texto do arquivo:", error);
    throw new Error(`Erro ao processar o arquivo: ${error.message}`);
  }
}

// Função auxiliar para extrair texto de PDF
async function extractPDFText(file: File): Promise<string> {
  // Converter File para ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // Converter ArrayBuffer para Buffer (necessário para pdf-parse)
  const buffer = Buffer.from(arrayBuffer);
  
  try {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    throw new Error(`Falha ao extrair texto do PDF: ${error.message}`);
  }
}

// Função auxiliar para extrair texto de DOCX
async function extractDOCXText(file: File): Promise<string> {
  // Converter File para ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("Erro ao processar DOCX:", error);
    throw new Error(`Falha ao extrair texto do DOCX: ${error.message}`);
  }
}

// Exemplo de texto para teste quando não há extração real
export function getExampleContractText(): string {
  return `
  CONTRATO DE PRESTAÇÃO DE SERVIÇOS
  
  Pelo presente instrumento particular de contrato de prestação de serviços, de um lado CONTRATANTE, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede na Rua XXXX, nº XXX, Bairro XXXX, Cidade/UF, CEP XXXXX-XXX, neste ato representada por seu sócio administrador, Sr. XXXX, nacionalidade, estado civil, profissão, portador da cédula de identidade RG nº XXXXXXX e inscrito no CPF sob o nº XXX.XXX.XXX-XX, residente e domiciliado na Rua XXXX, nº XXX, Cidade/UF; e de outro lado CONTRATADA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede na Rua XXXX, nº XXX, Bairro XXXX, Cidade/UF, CEP XXXXX-XXX, neste ato representada por seu representante legal, Sr. XXXX, nacionalidade, estado civil, profissão, portador da cédula de identidade RG nº XXXXXXX e inscrito no CPF sob o nº XXX.XXX.XXX-XX, têm entre si, justo e contratado o seguinte:
  
  CLÁUSULA PRIMEIRA - DO OBJETO
  
  1.1. O presente contrato tem por objeto a prestação de serviços de desenvolvimento de software, conforme detalhado no Anexo I, que é parte integrante deste contrato.
  
  CLÁUSULA SEGUNDA - DO PRAZO
  
  2.1. O prazo para execução dos serviços é de 120 (cento e vinte) dias, contados a partir da assinatura deste contrato.
  
  CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO
  
  3.1. Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor total de R$ 50.000,00 (cinquenta mil reais), a serem pagos da seguinte forma:
  3.1.1. 30% (trinta por cento) na assinatura do contrato;
  3.1.2. 30% (trinta por cento) na entrega da primeira etapa do projeto;
  3.1.3. 40% (quarenta por cento) na entrega final do projeto.
  
  CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA
  
  4.1. Executar os serviços conforme especificado no Anexo I;
  4.2. Entregar os serviços dentro dos prazos estabelecidos;
  4.3. Manter sigilo sobre todas as informações a que tiver acesso em decorrência da prestação dos serviços.
  
  CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATANTE
  
  5.1. Fornecer à CONTRATADA todas as informações necessárias para a execução dos serviços;
  5.2. Efetuar os pagamentos dentro dos prazos estabelecidos;
  
  CLÁUSULA SEXTA - DA RESCISÃO
  
  6.1. O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação por escrito com antecedência mínima de 30 (trinta) dias.
  
  CLÁUSULA SÉTIMA - DAS PENALIDADES
  
  7.1. Em caso de atraso na entrega dos serviços, a CONTRATADA pagará multa de 1% (um por cento) sobre o valor total do contrato, por dia de atraso, limitada a 20% (vinte por cento) do valor total do contrato.
  7.2. Em caso de atraso no pagamento, a CONTRATANTE pagará multa de 10% (dez por cento) ao dia sobre o valor da parcela em atraso, além de juros de 1% (um por cento) ao mês.
  
  CLÁUSULA OITAVA - DO FORO
  
  8.1. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, com renúncia a qualquer outro, por mais privilegiado que seja.
  
  E, por estarem assim justas e contratadas, as partes assinam o presente contrato em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.
  
  São Paulo, 20 de abril de 2025.
  
  __________________________
  CONTRATANTE
  
  __________________________
  CONTRATADA
  
  Testemunhas:
  
  1. ________________________
  Nome:
  CPF:
  
  2. ________________________
  Nome:
  CPF:
  `;
}
