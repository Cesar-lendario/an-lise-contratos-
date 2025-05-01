// Servidor simplificado para intermediação da API da OpenAI
// Este arquivo resolve os problemas de CORS funcionando como proxy entre o frontend e a OpenAI
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Obter o diretório atual quando usa módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações básicas
const app = express();
const port = 3000;

// Configurar armazenamento para upload de arquivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configuração de CORS para permitir requisições do frontend
app.use(cors({
  origin: '*', // Em produção, especifique a origem exata: http://localhost:8081
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Tratamento de requisições preflight OPTIONS
app.options('*', cors());

// Middleware para parsing de JSON e form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('dist'));

// Chave da API da OpenAI
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

// Função para extrair texto de diferentes tipos de arquivo
function extractTextFromFile(file) {
  console.log(`Processando arquivo: ${file.originalname} (${file.mimetype})`);
  
  // Para arquivos de texto
  if (file.mimetype === 'text/plain') {
    return fs.readFileSync(file.path, 'utf8');
  }
  
  // Para outras extensões, retornamos o texto simulado temporariamente
  // Em uma implementação completa, usaríamos pdf-parse e mammoth.js
  return `
  CONTRATO DE PRESTAÇÃO DE SERVIÇOS

  Pelo presente instrumento particular de contrato de prestação de serviços, 
  de um lado CONTRATANTE, pessoa jurídica de direito privado, inscrita no CNPJ 
  sob o nº XX.XXX.XXX/0001-XX, com sede na Rua XXXX, nº XXX, Bairro XXXX, 
  Cidade/UF, CEP XXXXX-XXX, neste ato representada por seu sócio administrador, 
  Sr. XXXX, e de outro lado CONTRATADA, têm entre si, justo e contratado o seguinte:

  CLÁUSULA PRIMEIRA - DO OBJETO
  1.1. O presente contrato tem por objeto a prestação de serviços de desenvolvimento de software.

  CLÁUSULA SEGUNDA - DO PRAZO
  2.1. O prazo para execução dos serviços é de 120 dias.

  CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO
  3.1. O valor total é de R$ 50.000,00, pagos em 3 parcelas.
  `;
}

// Função para analisar o contrato com a OpenAI
async function analyzeContract(contractText) {
  try {
    console.log('Enviando texto para análise da OpenAI...');
    
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

    // Verificar se a resposta foi bem-sucedida
    if (response.status !== 200) {
      console.error('Erro na API da OpenAI:', response.statusText);
      throw new Error(`Erro na API da OpenAI: ${response.statusText}`);
    }

    // Extrair conteúdo da resposta
    const content = response.data.choices[0].message.content;
    console.log('Análise concluída com sucesso');
    
    try {
      // Fazer parse do JSON
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('A resposta da API não está em formato JSON válido');
    }
  } catch (error) {
    console.error('Erro ao analisar contrato:', error);
    throw new Error(`Erro na análise: ${error.message}`);
  }
}

// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Servidor de análise de contratos funcionando'
  });
});

// Rota para analisar texto diretamente (sem upload de arquivo)
app.post('/analisar-texto', async (req, res) => {
  try {
    // Verificar se o texto foi fornecido
    const { texto } = req.body;
    
    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum texto fornecido'
      });
    }

    console.log('Recebido texto para análise');
    
    // Analisar o contrato com a OpenAI
    const analysisResult = await analyzeContract(texto);
    
    // Retornar o resultado da análise
    return res.json({
      success: true,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar o contrato',
      message: error.message
    });
  }
});

// Rota para analisar contratos via upload de arquivo
app.post('/analisar-contrato', upload.single('contract'), async (req, res) => {
  try {
    // Verificar se um arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nenhum arquivo enviado'
      });
    }

    console.log(`Arquivo recebido: ${req.file.originalname} (${req.file.mimetype})`);
    
    try {
      // Extrair texto do arquivo
      const contractText = extractTextFromFile(req.file);
      
      // Analisar o contrato com a OpenAI
      const analysisResult = await analyzeContract(contractText);
      
      // Remover o arquivo temporário
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Aviso: Não foi possível remover o arquivo temporário:', cleanupError.message);
      }
      
      // Retornar o resultado da análise
      return res.json({
        success: true,
        fileName: req.file.originalname,
        uploadDate: new Date().toISOString(),
        analysis: analysisResult
      });
    } catch (processingError) {
      console.error('Erro durante o processamento:', processingError);
      return res.status(500).json({ 
        success: false,
        error: 'Erro ao processar o contrato',
        message: processingError.message
      });
    }
  } catch (requestError) {
    console.error('Erro na requisição:', requestError);
    return res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor',
      message: requestError.message
    });
  }
});

// Criar diretório de uploads se não existir
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
  console.log('Diretório de uploads criado com sucesso');
}

// Iniciar o servidor
app.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║  🚀 Servidor AdvContro rodando na porta ${port}        ║
║                                                  ║
║  • Acesse: http://localhost:${port}                    ║
║  • API para análise: /analisar-contrato          ║
║  • API para texto direto: /analisar-texto        ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});
