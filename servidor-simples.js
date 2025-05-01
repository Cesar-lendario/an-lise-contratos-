// Servidor com suporte a upload de arquivos e extração de texto
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import mammoth from 'mammoth';
import axios from 'axios';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração básica
const app = express();
const PORT = 3000;

// Solução simplificada para CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Responder imediatamente a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Configurar armazenamento para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Criar pasta de uploads se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Aceitar apenas arquivos txt, pdf e docx
    if (file.mimetype === 'text/plain' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Use apenas TXT, PDF ou DOCX.'), false);
    }
  }
});

// Middleware para processar JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Rota para a página principal
app.get('/upload', function(req, res) {
  res.sendFile(path.join(__dirname, 'teste-upload.html'));
});

// Função para extrair texto dos diferentes tipos de arquivos
async function extractTextFromFile(filePath, fileType) {
  try {
    console.log(`Extraindo texto de: ${filePath} (${fileType})`);
    
    // Para arquivos de texto simples (TXT)
    if (fileType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    // Para arquivos PDF - implementaremos um método simplificado
    else if (fileType === 'application/pdf') {
      try {
        // Lemos o arquivo mas retornamos um texto simulado para fins de teste
        // Em produção, você precisaria de uma biblioteca como pdf-parse configurada corretamente
        console.log(`Processando PDF: ${filePath}`);
        
        // Texto simulado para demonstração
        return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS EXTRAÍDO DE PDF

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
      } catch (pdfError) {
        console.error('Erro ao processar o PDF:', pdfError);
        throw new Error('Não foi possível extrair texto do arquivo PDF.');
      }
    }
    
    // Para arquivos DOCX
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const docxBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        return result.value;
      } catch (docxError) {
        console.error('Erro ao extrair texto do DOCX:', docxError);
        throw new Error('Não foi possível extrair texto do arquivo DOCX.');
      }
    }
    
    throw new Error('Formato de arquivo não suportado.');
  } catch (error) {
    console.error('Erro na extração de texto:', error);
    throw error;
  }
}

// Chave da API da OpenAI
const OPENAI_API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Servidor funcionando corretamente!'
  });
});

// Rota para analisar texto diretamente
app.post('/analisar-texto', async (req, res) => {
  try {
    const textoContrato = req.body.texto;
    
    if (!textoContrato) {
      return res.status(400).json({ 
        success: false, 
        error: 'Texto não fornecido' 
      });
    }
    
    console.log(`Recebido texto para análise: ${textoContrato.substring(0, 100)}...`);
    
    try {
      // Fazer requisição para a API da OpenAI
      const response = await axios.post(API_URL, {
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
            content: textoContrato
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 4000
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      });
      
      // Extrair conteúdo da resposta
      const content = response.data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("Resposta da API da OpenAI não contém o conteúdo esperado");
      }
      
      // Agora tratamos a resposta como texto formatado, não mais como JSON
      const analysisResult = content;
      
      // Retornar análise
      return res.json({
        success: true,
        analysis: analysisResult,
        format: "text"
      });
      
    } catch (apiError) {
      console.error('Erro ao comunicar com a API da OpenAI:', apiError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao analisar o contrato',
        message: apiError.message
      });
    }
    
  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor',
      message: error.message
    });
  }
});

// Iniciar o servidor
// Rota para upload e análise de arquivos
app.post('/analisar-arquivo', upload.single('arquivo'), async (req, res) => {
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
      const textoContrato = await extractTextFromFile(req.file.path, req.file.mimetype);
      
      if (!textoContrato || textoContrato.trim().length === 0) {
        throw new Error('Não foi possível extrair texto do arquivo ou o arquivo está vazio.');
      }
      
      console.log(`Texto extraído com sucesso: ${textoContrato.substring(0, 100)}...`);
      
      // Analisar o contrato com a OpenAI
      const response = await axios.post(API_URL, {
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
            content: textoContrato
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 4000
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      });
      
      // Extrair conteúdo da resposta
      const content = response.data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("Resposta da API da OpenAI não contém o conteúdo esperado");
      }
      
      // Tentar fazer parse do JSON com tratamento de erro robusto
      let analysisResult;
      try {
        // Remover possíveis caracteres BOM ou outros caracteres invisíveis no início
        const cleanedContent = content.trim().replace(/^\uFEFF/, '');
        analysisResult = JSON.parse(cleanedContent);
      } catch (jsonError) {
        console.error('Erro ao fazer parse do JSON retornado pela API:', jsonError);
        console.log('Conteúdo recebido:', content);
        
        // Tentar sanitizar o conteúdo para JSON válido como fallback
        try {
          // Procurar por um objeto JSON válido dentro do texto
          const jsonMatch = content.match(/\{.*\}/s);
          if (jsonMatch) {
            analysisResult = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Não foi possível extrair um JSON válido da resposta');
          }
        } catch (fallbackError) {
          // Se todas as tentativas falharem, criar um objeto de resposta de erro
          // Limpar arquivo temporário antes de retornar erro
          try {
            fs.unlinkSync(req.file.path);
            console.log(`Arquivo temporário removido após erro: ${req.file.path}`);
          } catch (cleanupError) {
            console.warn(`Não foi possível remover o arquivo temporário: ${cleanupError.message}`);
          }
          
          return res.status(500).json({
            success: false,
            error: 'Erro ao processar a resposta da API',
            message: 'A resposta não contém um JSON válido'
          });
        }
      }
      
      // Limpar arquivo temporário
      try {
        fs.unlinkSync(req.file.path);
        console.log(`Arquivo temporário removido: ${req.file.path}`);
      } catch (cleanupError) {
        console.warn(`Não foi possível remover o arquivo temporário: ${cleanupError.message}`);
      }
      
      // Retornar análise
      return res.json({
        success: true,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        analysis: analysisResult
      });
      
    } catch (processingError) {
      console.error('Erro ao processar o arquivo:', processingError);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.warn(`Não foi possível remover o arquivo temporário: ${cleanupError.message}`);
        }
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro ao processar o arquivo',
        message: processingError.message
      });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║  🚀 Servidor AdvContro rodando na porta ${PORT}        ║
║                                                  ║
║  • Acesse: http://localhost:${PORT}                    ║
║  • API para análise de texto: /analisar-texto     ║
║  • API para análise de arquivo: /analisar-arquivo ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});
