// Servidor com prompt personalizado solicitado pelo usuário
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';
import multer from 'multer';
import mammoth from 'mammoth';
import axios from 'axios';
import pdfParse from 'pdf-parse';

// Importamos a biblioteca pdf-parse apenas quando necessário para processamento
// Se estiver ocorrendo erro com arquivo de teste da biblioteca, podemos criar o diretório
try {
  const testDir = path.join(__dirname, 'test', 'data');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
} catch (err) {
  console.log('Aviso: Não foi possível criar o diretório de teste:', err);
}

// Importando módulos do banco de dados
import { testConnection } from './src/lib/db/config.js';
import { 
  criarTabelaContratos,
  adicionarContrato,
  buscarTodosContratos,
  buscarContratoPorId,
  atualizarContrato,
  excluirContrato 
} from './src/lib/db/models/contrato.js';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração básica
const app = express();
const PORT = 3000;

// Configuração aprimorada para CORS
app.use((req, res, next) => {
  // Permitir requisições da aplicação Vite e de qualquer origem durante desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
  
  // Responder imediatamente a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Adicionar o middleware cors padrão para garantir compatibilidade
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

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

// Configuração de tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.tsx': 'application/javascript',
  '.ts': 'application/javascript'
};

// Middleware para definir tipos MIME corretos
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  if (ext && mimeTypes[ext]) {
    res.setHeader('Content-Type', mimeTypes[ext]);
  }
  next();
});

// Servir arquivos estáticos
app.use(express.static(__dirname, {
  setHeaders: (res, path, stat) => {
    const ext = path.extname(path).toLowerCase();
    if (mimeTypes[ext]) {
      res.set('Content-Type', mimeTypes[ext]);
    }
  }
}));

// Rota para a página principal
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'teste-upload.html'));
});

// Rota para a página de upload
app.get('/upload', function(req, res) {
  res.sendFile(path.join(__dirname, 'teste-upload.html'));
});

// Removemos a função de extração simplificada pois agora usamos exclusivamente a API da OpenAI

// Função para extrair texto dos diferentes tipos de arquivos
async function extractTextFromFile(filePath, fileType) {
  try {
    console.log(`Extraindo texto de: ${filePath} (${fileType})`);
    
    // Para arquivos de texto simples (TXT)
    if (fileType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    // Para arquivos PDF - usando exclusivamente a API da OpenAI
    else if (fileType === 'application/pdf') {
      try {
        console.log(`Processando PDF exclusivamente via OpenAI: ${path.basename(filePath)}`);
        
        // Ler o arquivo PDF como Buffer
        const pdfBuffer = fs.readFileSync(filePath);
        
        // Converter o PDF para base64
        const pdfBase64 = pdfBuffer.toString('base64');
        const fileName = path.basename(filePath);
        
        // Chamar a API da OpenAI para extrair o texto
        const textoExtraido = await extrairTextoPDFComOpenAI(pdfBase64, fileName);
        
        // Verificar se obtivemos um resultado válido
        if (textoExtraido && textoExtraido.length > 0) {
          console.log(`PDF processado com sucesso via OpenAI: ${fileName} (${textoExtraido.length} caracteres)`);
          return textoExtraido;
        } else {
          throw new Error('A API da OpenAI não retornou texto válido');
        }
      } catch (pdfError) {
        console.error('Erro ao processar o PDF com OpenAI:', pdfError);
        throw new Error(`Não foi possível extrair texto do PDF: ${pdfError.message}`);
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

// Armazenar temporariamente o último texto de contrato analisado
let ultimoTextoAnalisado = null;
const API_URL = "https://api.openai.com/v1/chat/completions";
const VISION_API_URL = "https://api.openai.com/v1/chat/completions";

// Função para extrair texto de PDF usando pdf-parse localmente
async function extrairTextoPDFComOpenAI(pdfBase64, fileName) {
  console.log(`📄 Processando PDF: ${fileName}`);
  
  try {
    // Decodificar o base64 para um buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    console.log(`🔍 Extraindo texto do PDF usando pdf-parse localmente...`);
    
    // Usar pdf-parse para extrair o texto do PDF
    const pdfData = await pdfParse(pdfBuffer);
    
    // Verificar se obtivemos um resultado válido
    if (!pdfData || !pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error('Não foi possível extrair texto do PDF ou o arquivo está vazio');
    }
    
    const textoExtraido = pdfData.text;
    console.log(`✅ Extração bem-sucedida. Tamanho do texto: ${textoExtraido.length} caracteres`);
    
    // Se o texto for muito pequeno, pode ser um sinal de problemas na extração
    if (textoExtraido.length < 100 && pdfBuffer.length > 10000) {
      console.warn(`⚠️ Atenção: Texto extraído muito pequeno (${textoExtraido.length} caracteres) para um PDF relativamente grande (${Math.round(pdfBuffer.length/1024)}KB)`);
    }
    
    // Se o PDF tiver muitas páginas, vamos melhorar o texto extraído com a OpenAI
    if (pdfData.numpages > 5) {
      console.log(`🔄 PDF com ${pdfData.numpages} páginas detectado. Melhorando texto com OpenAI...`);
      
      try {
        // Enviar o texto extraído para a OpenAI melhorar a formatação
        const melhoriasResponse = await axios.post(API_URL, {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Você é um assistente especializado em melhorar textos extraídos de PDFs. Seu trabalho é apenas corrigir problemas óbvios de formatação, remover caracteres estranhos e garantir que parágrafos estejam bem formatados. Mantenha EXATAMENTE o mesmo conteúdo sem adicionar ou remover informações."
            },
            {
              role: "user",
              content: `Este é um texto extraído de um PDF com ${pdfData.numpages} páginas. Por favor, corrija apenas problemas de formatação, mantém EXATAMENTE o mesmo conteúdo: \n\n${textoExtraido.substring(0, 15000)}`
            }
          ],
          temperature: 0.1,
          max_tokens: 4000
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          }
        });
        
        if (melhoriasResponse.data && melhoriasResponse.data.choices && melhoriasResponse.data.choices.length > 0) {
          const textoMelhorado = melhoriasResponse.data.choices[0].message.content;
          console.log(`✅ Texto melhorado com sucesso via OpenAI. Novo tamanho: ${textoMelhorado.length} caracteres`);
          return textoMelhorado;
        }
      } catch (melhoriaError) {
        // Se falhar a melhoria, apenas continuamos com o texto original
        console.warn(`⚠️ Não foi possível melhorar o texto via OpenAI: ${melhoriaError.message}. Continuando com o texto original.`);
      }
    }
    
    return textoExtraido;
  } catch (error) {
    console.error('💥 Erro ao processar PDF:', error.message);
    throw new Error(`Falha ao extrair texto do PDF: ${error.message}`);
  }
}

// Rota de teste
app.get('/status', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Servidor funcionando corretamente!'
  });
});

// Prompt personalizado solicitado pelo usuário
const customPrompt = `Você é um assistente jurídico preciso especializado em análise de contratos. 
Sua tarefa é analisar SOMENTE o texto do contrato fornecido sem inventar informações que não estejam presentes.

ATENÇÃO: Analise SOMENTE o conteúdo real do contrato que foi enviado. NÃO invente informações que não estão explicitamente no texto.

Importantes diretrizes:
1. Cite literalmente trechos do contrato em sua análise
2. Se não houver informações sobre um aspecto, indique claramente: "O contrato não menciona..." 
3. Seja objetivo e factual, baseando-se apenas no texto fornecido
4. Não presuma informações ausentes nem crie hipóteses não fundamentadas no texto
5. Não invente informações que não estão no texto

Inicie sua resposta com um breve parágrafo introdutório apresentando o escopo da análise, seguindo este modelo: "Segue a auditoria jurídica detalhada do [NOME DO CONTRATO], com base nos critérios estabelecidos. A análise está organizada por cláusula, apontando problemas identificados, sugestões de melhoria, justificativas e implicações para as partes."

Analise juridicamente os seguintes aspectos APENAS SE PRESENTES no contrato:

1. Clareza e precisão da linguagem ✍️
2. Cobertura adequada de todos os termos e condições essenciais 📋
3. Proteção legal para todas as partes envolvidas ⚖️
4. Conformidade com leis e regulamentos atuais 📜
5. Potenciais Ambiguidades ou lacunas 🧩
6. Detectar potenciais riscos e inconformidades nos termos contratuais 🛑
7. Equilíbrio entre partes 🤝
8. Cláusulas de rescisão e resolução de disputas 🔍
9. Definições claras de termos-chave 📝
10. Adaptabilidade a mudanças futuras 💰
11. Possíveis riscos ou vulnerabilidades legais 🛑
12. Examinar cláusulas de pagamento 💰
13. Confidencialidade e resolução de disputas 🔒

Para cada cláusula relevante do contrato, estruture assim:

🔹 **CLÁUSULA X – [TÍTULO DA CLÁUSULA]**

**Problema:**

    [cite o trecho específico e descreva o problema ou preocupação identificada]

**Recomendação:**

    [sugestão concreta de otimização detalhada para abordar o problema]

**Justificativa:**

    [base jurídica legal ou prática para a mudança sugerida]

**Implicações:**

    [consequências e possíveis implicações da mudança para outras partes do contrato]

**Melhorias e renegociações:**

    [apresente sugestões concretas de melhorias e renegociações que possam beneficiar as partes envolvidas]

Depois de analisar todas as cláusulas relevantes, OBRIGATORIAMENTE inclua estas seções finais, mesmo que algumas fiquem curtas:

⚠️ CLÁUSULAS INCOMUNS / INOVADORAS BENÉFICAS:[Liste cláusulas que se destacam positivamente]

⭐ **NÍVEL DE RISCO**: [Classifique o risco como Alto, Médio ou Baixo, com justificativa]

📝 **RESUMO FACTUAL**: [Apresente um resumo objetivo de 3-5 linhas sobre o que consta no documento]

🔎 **ANÁLISE JURÍDICA**: [Resumo da análise das principais cláusulas existentes]

⏰ **PRAZOS**: [Liste APENAS prazos expressamente mencionados no contrato]

💡 **RECOMENDAÇÕES**: [Liste as 3-5 principais recomendações para problemas concretos identificados de forma clara e estruturada]

É OBRIGATÓRIO incluir TODAS estas seis seções finais na sua resposta!`;

// Prompt para reescrita de cláusulas contratuais
const alteracaoPrompt = `## 📝 Prompt para Reescrita Contratual com Base em Auditoria Jurídica

### 📌 Introdução:
Com base na auditoria jurídica realizada, reescreva as cláusulas do contrato que foram observadas na análise contratual, incorporando todas as recomendações apontadas.

---

### 📋 Regras:

- Inicie sua resposta com a frase: **"Segue sugestão para as cláusulas apontadas."**
- Reescreva apenas os parágrafos das cláusulas do contrato que foram identificadas na análise jurídica.
- **Mantenha a numeração original das cláusulas**.
- Reformule apenas as cláusulas indicadas, incorporando:
  - Clareza
  - Precisão
  - Segurança jurídica
  - Equilíbrio entre as partes
  - Conformidade legal atual
  - Proteção de dados

- Utilize **linguagem jurídica adequada e objetiva**.

---

### ✏️ Marcação de Alterações:

- Use **negrito** para destacar **novos trechos incluídos** na cláusula.
- Use ~~tachado~~ para **trechos removidos ou substituídos**.
- Se preferir, use emojis ou bullet points para facilitar a visualização das alterações.`;

// Rota para analisar texto diretamente
app.post('/analisar-texto', async (req, res) => {
  try {
    const textoContrato = req.body.texto;
    console.log('👉 Corpo da requisição:', JSON.stringify(req.body).substring(0, 150));
    
    if (!textoContrato) {
      console.error('❌ Erro: Texto não fornecido na requisição');
      return res.status(400).json({ 
        success: false, 
        error: 'Texto não fornecido' 
      });
    }
    
    console.log(`🔍 Recebido texto para análise direta [${textoContrato.length} caracteres]: ${textoContrato.substring(0, 100)}...`);
    
    // Criar um nome de arquivo temporário para o texto
    const tempFileName = `texto_${Date.now()}`;
    const tempFilePath = path.join(os.tmpdir(), `${tempFileName}.txt`);
    
    try {
      // Salvar o texto em um arquivo temporário
      fs.writeFileSync(tempFilePath, textoContrato, 'utf8');
      console.log(`📄 Texto salvo em arquivo temporário: ${tempFilePath}`);
      
      // Armazenar o texto para uso posterior na reescrita de cláusulas
      ultimoTextoAnalisado = textoContrato;
      
      // Fazer requisição para a API da OpenAI com o prompt personalizado
      console.log('🔄 Iniciando análise do texto com a API da OpenAI...');
      const response = await axios.post(API_URL, {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: customPrompt
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
      
      console.log('✅ Análise concluída com sucesso');
      
      // Limpar arquivo temporário após processamento
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`🗑️ Arquivo temporário removido: ${tempFilePath}`);
      } catch (cleanupError) {
        console.warn(`⚠️ Não foi possível remover o arquivo temporário: ${tempFilePath}`, cleanupError);
      }
      
      // Estrutura de resposta igual à rota /analisar-arquivo
      const responseData = {
        success: true,
        fileName: tempFileName,  // Sem extensão .txt, como a outra rota
        analysis: content,
        format: "text"
      };
      
      console.log(`📦 Enviando resposta para o frontend: ${JSON.stringify(responseData).substring(0, 150)}...`);
      
      // Retornar análise como texto formatado junto com o nome do arquivo
      return res.json(responseData);
      
    } catch (apiError) {
      console.error('❌ Erro ao comunicar com a API da OpenAI:', apiError.message);
      if (apiError.response) {
        console.error('Detalhes da resposta de erro:', JSON.stringify(apiError.response.data).substring(0, 200));
      }
      
      // Tentar limpar arquivo temporário em caso de erro
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log(`🗑️ Arquivo temporário removido após erro: ${tempFilePath}`);
        }
      } catch (cleanupError) {
        console.warn(`⚠️ Erro ao remover arquivo temporário: ${cleanupError.message}`);
      }
      
      return res.status(500).json({
        success: false,
        error: 'Erro ao analisar o contrato',
        message: apiError.message
      });
    }
    
  } catch (error) {
    console.error('💥 Erro no servidor:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor',
      message: error.message
    });
  }
});

// Rota para reescrita de cláusulas
app.post('/alterar-clausulas', async (req, res) => {
  try {
    // Verificar se temos um texto de contrato armazenado
    if (!ultimoTextoAnalisado) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum contrato foi analisado previamente'
      });
    }
    
    // Obter a análise jurídica (opcional)
    const analiseJuridica = req.body.analise || '';
    
    // Combinar o texto do contrato com a análise jurídica
    let conteudoParaAnalise = ultimoTextoAnalisado;
    if (analiseJuridica) {
      conteudoParaAnalise = `CONTRATO ORIGINAL:\n\n${ultimoTextoAnalisado}\n\nANÁLISE JURÍDICA:\n\n${analiseJuridica}`;
    }
    
    // Enviar para a API da OpenAI
    const response = await axios.post(API_URL, {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: alteracaoPrompt
        },
        {
          role: "user",
          content: conteudoParaAnalise
        }
      ],
      temperature: 0.4,
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
    
    // Retornar as cláusulas reescritas
    return res.json({
      success: true,
      alteracoes: content,
      format: "text"
    });
    
  } catch (error) {
    console.error('Erro ao processar a alteração de cláusulas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar a alteração de cláusulas',
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
      // ETAPA 1: EXTRAÇÃO DO TEXTO - Diferentes métodos dependendo do tipo de arquivo
      let textoContrato;
      let arquivoTemporarioTxt = null;
      
      // Para arquivos PDF, sempre usar a API da OpenAI para extração e salvar como TXT
      if (req.file.mimetype === 'application/pdf') {
        console.log('PDF detectado: Usando OpenAI para extração de texto...');
        
        try {
          // Ler o PDF como buffer e converter para base64
          const pdfBuffer = fs.readFileSync(req.file.path);
          const pdfBase64 = pdfBuffer.toString('base64');
          const nomeOriginal = req.file.originalname;
          
          // Usar a API OpenAI para extrair o texto do PDF
          const textoExtraido = await extrairTextoPDFComOpenAI(pdfBase64, nomeOriginal);
          console.log(`Extração de texto do PDF via OpenAI concluída: ${textoExtraido.length} caracteres`);
          
          // Criar nome para arquivo TXT temporário com base no original
          const nomeBase = path.basename(nomeOriginal, '.pdf');
          arquivoTemporarioTxt = path.join(path.dirname(req.file.path), `${nomeBase}_convertido_${Date.now()}.txt`);
          
          // Salvar o texto extraído como arquivo TXT
          fs.writeFileSync(arquivoTemporarioTxt, textoExtraido, 'utf8');
          console.log(`Texto extraído salvo como TXT: ${arquivoTemporarioTxt}`);
          
          // Agora processar o arquivo TXT normalmente
          textoContrato = fs.readFileSync(arquivoTemporarioTxt, 'utf8');
          console.log(`Arquivo TXT criado e lido com sucesso: ${textoContrato.length} caracteres`);
        } catch (pdfError) {
          console.error('Erro ao processar PDF via OpenAI:', pdfError);
          throw new Error(`Falha ao extrair texto do PDF: ${pdfError.message}`);
        }
      } 
      // Para outros tipos de arquivo, usar métodos convencionais
      else {
        textoContrato = await extractTextFromFile(req.file.path, req.file.mimetype);
        console.log(`Extração convencional de texto concluída: ${textoContrato.length} caracteres`);
      }
      
      // Verificar se o texto foi extraído com sucesso
      if (!textoContrato || textoContrato.trim().length === 0) {
        throw new Error('Não foi possível extrair texto do arquivo ou o arquivo está vazio.');
      }
      
      // Armazenar o texto para uso posterior na reescrita
      ultimoTextoAnalisado = textoContrato;
      
      console.log(`Texto extraído com sucesso. Primeiros 100 caracteres: ${textoContrato.substring(0, 100)}...`);
      
      // ETAPA 2: ANÁLISE DO TEXTO - Usando a OpenAI com o prompt personalizado
      console.log('Iniciando análise do texto extraído via OpenAI...');
      const response = await axios.post(API_URL, {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: customPrompt
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
      
      console.log('Análise jurídica concluída com sucesso.');
      
      // Limpar arquivos temporários
      try {
        // Remover o arquivo original
        fs.unlinkSync(req.file.path);
        console.log(`Arquivo temporário original removido: ${req.file.path}`);
        
        // Remover o arquivo TXT temporário se foi criado
        if (arquivoTemporarioTxt && fs.existsSync(arquivoTemporarioTxt)) {
          fs.unlinkSync(arquivoTemporarioTxt);
          console.log(`Arquivo TXT temporário removido: ${arquivoTemporarioTxt}`);
        }
      } catch (cleanupError) {
        console.warn(`Não foi possível remover arquivos temporários: ${cleanupError.message}`);
      }
      
      // Retornar análise como texto formatado
      return res.json({
        success: true,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        analysis: content,
        format: "text",
        extracted_via: req.file.mimetype === 'application/pdf' ? "openai" : "conventional"
      });
      
    } catch (processingError) {
      console.error('Erro ao processar o arquivo:', processingError);
      
      // Limpar arquivos temporários em caso de erro
      if (req.file && req.file.path) {
        try {
          // Remover arquivo original
          fs.unlinkSync(req.file.path);
          console.log(`Arquivo temporário original removido: ${req.file.path}`);
          
          // Remover o arquivo TXT temporário se foi criado
          if (arquivoTemporarioTxt && fs.existsSync(arquivoTemporarioTxt)) {
            fs.unlinkSync(arquivoTemporarioTxt);
            console.log(`Arquivo TXT temporário removido após erro: ${arquivoTemporarioTxt}`);
          }
        } catch (cleanupError) {
          console.warn(`Não foi possível remover arquivos temporários: ${cleanupError.message}`);
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

// Rotas para o banco de dados

// Rota para obter todos os contratos
app.get('/api/contratos', async (req, res) => {
  try {
    const contratos = await buscarTodosContratos();
    res.json({
      success: true,
      data: contratos
    });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contratos',
      message: error.message
    });
  }
});

// Rota para obter um contrato específico
app.get('/api/contratos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const contrato = await buscarContratoPorId(id);
    
    if (!contrato) {
      return res.status(404).json({
        success: false,
        error: 'Contrato não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: contrato
    });
  } catch (error) {
    console.error(`Erro ao buscar contrato com ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar contrato',
      message: error.message
    });
  }
});

// Rota para adicionar um novo contrato
app.post('/api/contratos', async (req, res) => {
  try {
    const novoContrato = req.body;
    
    // Validação básica
    if (!novoContrato.titulo || !novoContrato.conteudo || !novoContrato.nivel_risco) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos',
        message: 'Os campos título, conteúdo e nível de risco são obrigatórios'
      });
    }
    
    const contratoAdicionado = await adicionarContrato(novoContrato);
    
    res.status(201).json({
      success: true,
      message: 'Contrato adicionado com sucesso',
      data: contratoAdicionado
    });
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar contrato',
      message: error.message
    });
  }
});

// Rota para atualizar um contrato
app.put('/api/contratos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizacao = req.body;
    
    // Verificar se o contrato existe
    const contratoExistente = await buscarContratoPorId(id);
    if (!contratoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Contrato não encontrado'
      });
    }
    
    // Atualizar o contrato
    const contratoAtualizado = await atualizarContrato(id, dadosAtualizacao);
    
    res.json({
      success: true,
      message: 'Contrato atualizado com sucesso',
      data: contratoAtualizado
    });
  } catch (error) {
    console.error(`Erro ao atualizar contrato com ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar contrato',
      message: error.message
    });
  }
});

// Rota para excluir um contrato
app.delete('/api/contratos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o contrato existe
    const contratoExistente = await buscarContratoPorId(id);
    if (!contratoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Contrato não encontrado'
      });
    }
    
    // Excluir o contrato
    const excluido = await excluirContrato(id);
    
    if (excluido) {
      res.json({
        success: true,
        message: 'Contrato excluído com sucesso'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao excluir contrato',
        message: 'Não foi possível excluir o contrato'
      });
    }
  } catch (error) {
    console.error(`Erro ao excluir contrato com ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir contrato',
      message: error.message
    });
  }
});

// Modificação da rota /analisar-arquivo para salvar no banco de dados
app.post('/api/analisar-e-salvar', upload.single('file'), async (req, res) => {
  try {
    // Usa a rota existente para analisar o arquivo
    const response = await axios.post(`http://localhost:${PORT}/analisar-arquivo`, req.body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data && response.data.success) {
      const analise = response.data.analysis;
      
      // Extrair nível de risco da análise
      let nivelRisco = 'medio'; // Valor padrão
      if (analise.includes('NÍVEL DE RISCO: Alto') || analise.includes('NÍVEL DE RISCO: ALTO')) {
        nivelRisco = 'alto';
      } else if (analise.includes('NÍVEL DE RISCO: Baixo') || analise.includes('NÍVEL DE RISCO: BAIXO')) {
        nivelRisco = 'baixo';
      }
      
      // Extrair resumo, recomendações e prazos
      let resumo = '';
      let recomendacoes = '';
      let prazos = '';
      
      // Tenta extrair resumo
      const resumoMatch = analise.match(/RESUMO FACTUAL:[\s\S]*?(?=(ANÁLISE JURÍDICA:|PRAZOS:|RECOMENDAÇÕES:|$))/i);
      if (resumoMatch) resumo = resumoMatch[0].trim();
      
      // Tenta extrair recomendações
      const recomendacoesMatch = analise.match(/RECOMENDAÇÕES:[\s\S]*?(?=$)/i);
      if (recomendacoesMatch) recomendacoes = recomendacoesMatch[0].trim();
      
      // Tenta extrair prazos
      const prazosMatch = analise.match(/PRAZOS:[\s\S]*?(?=(RECOMENDAÇÕES:|$))/i);
      if (prazosMatch) prazos = prazosMatch[0].trim();
      
      // Criar objeto para o banco de dados
      const novoContrato = {
        titulo: req.body.titulo || 'Contrato sem título',
        conteudo: ultimoTextoAnalisado,
        analise: analise,
        nivel_risco: nivelRisco,
        recomendacoes: recomendacoes,
        prazos: prazos
      };
      
      // Salvar no banco de dados
      const contratoSalvo = await adicionarContrato(novoContrato);
      
      res.json({
        success: true,
        message: 'Contrato analisado e salvo com sucesso',
        analysis: analise,
        contrato: contratoSalvo
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao analisar o arquivo',
        message: response.data.message || 'Ocorreu um erro na análise'
      });
    }
  } catch (error) {
    console.error('Erro ao analisar e salvar contrato:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao analisar e salvar contrato',
      message: error.message
    });
  }
});

// Inicializar o servidor e o banco de dados
async function inicializarServidor() {
  try {
    // Testar conexão com o banco de dados
    const conexaoBD = await testConnection();
    if (conexaoBD) {
      // Criar tabelas se não existirem
      await criarTabelaContratos();
      console.log('✅ Banco de dados inicializado com sucesso');
    } else {
      console.error('❌ Não foi possível conectar ao banco de dados. O servidor continuará funcionando, mas sem persistência de dados.');
    }
    
    // Iniciar o servidor HTTP
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║                                                  ║
║  🚀 Servidor AdvContro rodando na porta ${PORT}        ║
║                                                  ║
║  • Acesse: http://localhost:${PORT}                    ║
║  • Acesse: http://localhost:${PORT}/upload             ║
║  • API: /analisar-texto e /analisar-arquivo      ║
║  • Banco de dados: ${conexaoBD ? '✅ Conectado' : '❌ Desconectado'} ║
║                                                  ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Erro ao inicializar o servidor:', error);
  }
}

// Iniciar o servidor
inicializarServidor();
