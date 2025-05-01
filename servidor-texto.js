// Servidor com suporte a upload de arquivos e extração de texto
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import mammoth from 'mammoth';
import axios from 'axios';
import pdfParse from 'pdf-parse';

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
    
    // Para arquivos PDF - usando um método alternativo para evitar problemas com pdf-parse
    else if (fileType === 'application/pdf') {
      try {
        console.log(`Processando PDF: ${filePath}`);
        
        // Ler o arquivo PDF
        const pdfContent = fs.readFileSync(filePath);
        
        // Usar método alternativo (texto simulado por enquanto)
        console.log(`PDF recebido com ${pdfContent.length} bytes.`);
        
        // Para fins de teste, retornar o texto do próprio arquivo
        // Em produção, usar uma biblioteca mais robusta
        return `Conteúdo do PDF: ${path.basename(filePath)} (${pdfContent.length} bytes)\n\n` + 
               fs.readFileSync(filePath).toString('utf8', 0, 500) + '...';
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
            content: `Você é um assistente jurídico preciso especializado em análise de contratos. 
Sua tarefa é analisar SOMENTE o texto do contrato fornecido sem inventar informações que não estejam presentes.

ATENÇÃO: Analise SOMENTE o conteúdo real do contrato que foi enviado. NÃO invente informações que não estão explicitamente no texto.

Importantes diretrizes:
1. Cite literalmente trechos do contrato em sua análise
2. Se não houver informações sobre um aspecto, indique claramente: "O contrato não menciona..." 
3. Seja objetivo e factual, baseando-se apenas no texto fornecido
4. Não presuma informações ausentes nem crie hipóteses não fundamentadas no texto

Analise os seguintes aspectos APENAS SE PRESENTES no contrato:

1. Clareza da linguagem ✍️
2. Termos essenciais 📋
3. Proteção legal ⚖️
4. Conformidade legal 📜
5. Ambiguidades 🧩
6. Riscos contratuais 🛑
7. Equilíbrio entre partes 🤝
8. Rescisão 🔍
9. Termos-chave 📝
10. Pagamento 💰
11. Confidencialidade 🔒

Para cada item relevante encontrado NO TEXTO DO CONTRATO, use este formato:

- Cláusula X: [cite o número/nome exato da cláusula]
  - **Problema**: [cite o trecho específico e descreva o problema]
  - **Recomendação**: [sugestão concreta]
  - **Justificativa**: [base jurídica]
  - **Implicação**: [consequências]

Estruture sua análise assim:

⭐ **NÍVEL DE RISCO**: Classificação baseada apenas nos problemas identificados

📄 **RESUMO FACTUAL**: Resumo objetivo do que consta no documento

🔎 **ANÁLISE JURÍDICA**: Apenas das cláusulas existentes no documento

⏰ **PRAZOS**: Somente prazos expressamente mencionados

💡 **RECOMENDAÇÕES**: Para problemas concretos identificados`
          },
          {
            role: "user",
            content: textoContrato
          }
        ],
        temperature: 0.2,
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
      
      // Verificar se a resposta é válida e contém texto
      if (!content || content.trim().length === 0) {
        throw new Error('A resposta da API não contém texto válido');
      }
      
      // Imprimir o conteúdo para debug
      console.log('Resposta recebida da API:', content.substring(0, 100) + '...');
      
      // Usar a resposta como está
      const analysisResult = content;
      
      // Retornar análise como texto formatado
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
            content: `Você é um assistente jurídico preciso especializado em análise de contratos. 
Sua tarefa é analisar SOMENTE o texto do contrato fornecido sem inventar informações que não estejam presentes.

ATENÇÃO: Analise SOMENTE o conteúdo real do contrato que foi enviado. NÃO invente informações que não estão explicitamente no texto.

Importantes diretrizes:
1. Cite literalmente trechos do contrato em sua análise
2. Se não houver informações sobre um aspecto, indique claramente: "O contrato não menciona..." 
3. Seja objetivo e factual, baseando-se apenas no texto fornecido
4. Não presuma informações ausentes nem crie hipóteses não fundamentadas no texto

Analise os seguintes aspectos APENAS SE PRESENTES no contrato:

1. Clareza da linguagem ✍️
2. Termos essenciais 📋
3. Proteção legal ⚖️
4. Conformidade legal 📜
5. Ambiguidades 🧩
6. Riscos contratuais 🛑
7. Equilíbrio entre partes 🤝
8. Rescisão 🔍
9. Termos-chave 📝
10. Pagamento 💰
11. Confidencialidade 🔒

Para cada item relevante encontrado NO TEXTO DO CONTRATO, use este formato:

- Cláusula X: [cite o número/nome exato da cláusula]
  - **Problema**: [cite o trecho específico e descreva o problema]
  - **Recomendação**: [sugestão concreta]
  - **Justificativa**: [base jurídica]
  - **Implicação**: [consequências]

Estruture sua análise assim:

⭐ **NÍVEL DE RISCO**: Classificação baseada apenas nos problemas identificados

📄 **RESUMO FACTUAL**: Resumo objetivo do que consta no documento

🔎 **ANÁLISE JURÍDICA**: Apenas das cláusulas existentes no documento

⏰ **PRAZOS**: Somente prazos expressamente mencionados

💡 **RECOMENDAÇÕES**: Para problemas concretos identificados`
          },
          {
            role: "user",
            content: textoContrato
          }
        ],
        temperature: 0.2,
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
      
      // Verificar se a resposta é válida e contém texto
      if (!content || content.trim().length === 0) {
        throw new Error('A resposta da API não contém texto válido');
      }
      
      // Imprimir o conteúdo para debug
      console.log('Resposta recebida da API:', content.substring(0, 100) + '...');
      
      // Usar a resposta como está
      const analysisResult = content;
      
      // Limpar arquivo temporário
      try {
        fs.unlinkSync(req.file.path);
        console.log(`Arquivo temporário removido: ${req.file.path}`);
      } catch (cleanupError) {
        console.warn(`Não foi possível remover o arquivo temporário: ${cleanupError.message}`);
      }
      
      // Retornar análise como texto formatado
      return res.json({
        success: true,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        analysis: analysisResult,
        format: "text"
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
