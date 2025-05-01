import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
// Importação condicional de pdf-parse com tratamento de erro
let pdf;
try {
  // O pdf-parse pode tentar carregar arquivos de teste que não existem
  // Vamos importar com try/catch para evitar falhas na inicialização
  pdf = (await import('pdf-parse')).default;
} catch (err) {
  console.warn('Aviso: pdf-parse não pode ser carregado completamente:', err.message);
  // Função fallback para não quebrar a aplicação
  pdf = async (buffer) => ({ text: "[Texto do PDF não pode ser extraído]" });
}

import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

// Obter o diretório atual quando usa módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

// Configuração de CORS e middleware
// Habilita CORS para qualquer origem (ideal para desenvolvimento)
app.use(cors());

// Tratamento explícito para requisições OPTIONS (pre-flight)
app.options('*', cors());

// Para produção, considere usar uma configuração mais restritiva:
// app.use(cors({
//   origin: 'http://localhost:8081', // ou seu domínio real
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// }));

// Configurações adicionais do Express
app.use(express.json());
app.use(express.static('dist'));

// Chave da API da OpenAI (em produção, use variáveis de ambiente)
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Obter a chave da API de forma segura
const getApiKey = () => {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  console.warn('\x1b[33m%s\x1b[0m', '⚠️ ALERTA: Nenhuma chave de API encontrada! Configure OPENAI_API_KEY no arquivo .env');
  return 'SUA_CHAVE_API_AQUI'; // Certifique-se de substituir no .env antes de usar
};

const OPENAI_API_KEY = getApiKey();
const API_URL = "https://api.openai.com/v1/chat/completions";

// Funções para extração de texto de diferentes formatos de arquivo
async function extractTextFromFile(file) {
  const filePath = file.path;
  const fileType = file.mimetype;
  
  // Para arquivos de texto
  if (fileType === 'text/plain') {
    return fs.readFileSync(filePath, 'utf8');
  }
  
  // Para arquivos PDF
  if (fileType === 'application/pdf') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      try {
        const data = await pdf(dataBuffer);
        return data.text || "[Conteúdo do PDF extraído, mas texto vazio]";
      } catch (error) {
        console.error('Erro ao processar PDF:', error);
        // Em caso de erro, retornar um texto informativo em vez de falhar completamente
        return `[Não foi possível extrair o texto do PDF devido a: ${error.message}. Por favor, verifique se o arquivo PDF não está protegido ou corrompido.]`;
      }
    } catch (fileError) {
      console.error('Erro ao ler arquivo PDF:', fileError);
      throw new Error(`Erro ao ler arquivo PDF: ${fileError.message}`);
    }
  }
  
  // Para arquivos DOCX
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('Erro ao processar DOCX:', error);
      throw new Error(`Erro ao processar DOCX: ${error.message}`);
    }
  }
  
  throw new Error(`Tipo de arquivo não suportado: ${fileType}`);
}

// Função para analisar o conteúdo do contrato com a OpenAI
async function analyzeContract(contractText) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um assistente jurídico especializado em análise e aprimoramento de contratos. Sua tarefa é examinar minuciosamente o contrato fornecido (carregado) e oferecer sugestões detalhadas para melhorias, considerando os seguintes aspectos:

1. Clareza e precisão da linguagem
2. Cobertura adequada de todos os termos e condições essenciais
3. Proteção legal para todas as partes envolvidas
4. Conformidade com leis e regulamentos atuais
5. Potenciais ambiguidades ou lacunas
6. Detectar potenciais riscos e inconformidades nos termos contratuais.
7. Equilíbrio entre as partes
8. Cláusulas de rescisão e resolução de disputas
9. Definições claras de termos-chave
10. Adaptabilidade a mudanças futuras
11. Possíveis riscos ou vulnerabilidades legais
12. Examinar cláusulas de pagamento
13. Confidencialidade e resolução de disputas

Para cada sugestão de melhoria, forneça:
- A cláusula ou seção específica que precisa de atenção
- O problema ou preocupação identificado
- Uma recomendação de otimização detalhada para abordar o problema
- Justificativa legal ou prática para a mudança sugerida
- Possíveis implicações da mudança para outras partes do contrato
- Propor melhorias e renegociações que possam beneficiar as partes envolvidas.
 
Além disso, identifique quaisquer cláusulas incomuns ou inovadoras que possam ser benéficas e explique por quê.

Responda APENAS com um objeto JSON completo e válido, seguindo exatamente esta estrutura:

{
  "riskLevel": "low" | "medium" | "high",
  "summary": "resumo do contrato",
  "legalAnalysis": {
    "clarityAndPrecision": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "adequateCoverage": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "legalProtection": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "regulatoryCompliance": {
      "id": "string",
      "title": "string",
      "positiveAspects": "string",
      "improvementSuggestions": "string",
      "justification": "string",
      "implications": "string"
    },
    "ambiguitiesOrGaps": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "potentialRisks": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "partyBalance": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "disputeResolution": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "keyTermDefinitions": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "futureAdaptability": {
      "id": "string",
      "title": "string",
      "positiveAspects": "string",
      "suggestion": "string",
      "justification": "string",
      "implications": "string"
    },
    "legalVulnerabilities": {
      "id": "string",
      "title": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "paymentClauses": {
      "id": "string",
      "title": "string",
      "positiveAspects": "string",
      "problem": "string",
      "recommendation": "string",
      "justification": "string",
      "implications": "string"
    },
    "confidentiality": {
      "id": "string",
      "title": "string",
      "positiveAspects": "string",
      "suggestion": "string",
      "justification": "string",
      "implications": "string"
    }
  },
  "risks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "deadlines": [
    {
      "id": "string",
      "title": "string",
      "date": "string",
      "description": "string"
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string"
    }
  ]
}`
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Erro na API da OpenAI: ${response.statusText}`);
    }

    // Extrair o conteúdo JSON da resposta
    const rawContent = response.data.choices[0].message.content;
    
    try {
      // Tentar fazer o parse do JSON
      const analysisResult = JSON.parse(rawContent);
      return analysisResult;
    } catch (error) {
      console.error('Erro ao fazer parse do conteúdo da resposta:', error);
      throw new Error('A resposta da API não está em um formato JSON válido.');
    }
  } catch (error) {
    console.error("Erro ao analisar contrato:", error);
    throw new Error(`Erro ao analisar contrato: ${error.message}`);
  }
}

// Rota para analisar contratos
app.post('/analisar-contrato', upload.single('contract'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Log de informações do arquivo
    console.log(`Arquivo recebido: ${req.file.originalname} (${req.file.mimetype})`);
    
    // Extrair texto do arquivo
    const contractText = await extractTextFromFile(req.file);
    
    // Analisar o contrato com a OpenAI
    const analysisResult = await analyzeContract(contractText);
    
    // Remover o arquivo temporário
    fs.unlinkSync(req.file.path);
    
    // Retornar o resultado da análise
    return res.json({
      success: true,
      fileName: req.file.originalname,
      uploadDate: new Date().toISOString(),
      analysis: analysisResult
    });
    
  } catch (error) {
    console.error('Erro ao processar contrato:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar contrato',
      message: error.message 
    });
  }
});

// Criar diretório de uploads se não existir
try {
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
    console.log('Diretório de uploads criado com sucesso');
  }
} catch (err) {
  console.error('Erro ao criar diretório de uploads:', err);
}

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
