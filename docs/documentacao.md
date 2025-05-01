# Documentação do Sistema AdvContro - Gerenciamento de Contratos

## Sumário

1. [Introdução](#introdução)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Componentes Principais](#componentes-principais)
8. [Integração com OpenAI](#integração-com-openai)
9. [Backend e Processamento de Arquivos](#backend-e-processamento-de-arquivos)
10. [Fluxo de Trabalho](#fluxo-de-trabalho)
11. [Guia de Estilo](#guia-de-estilo)
12. [Manutenção e Boas Práticas](#manutenção-e-boas-práticas)
13. [Processamento Avançado de Análises Jurídicas](#processamento-avançado-de-análises-jurídicas)
14. [Melhorias Recentes e Futuras](#melhorias-recentes-e-futuras)

## Introdução

O **AdvContro** é um sistema de gerenciamento e análise de contratos desenvolvido para profissionais da área jurídica. A plataforma permite o upload, análise, categorização de risco e gerenciamento de documentos contratuais.

O sistema foi projetado para facilitar a visualização e controle de múltiplos contratos, oferecendo funcionalidades como identificação de níveis de risco, exportação em PDF e acompanhamento temporal dos documentos.

## Tecnologias Utilizadas

O projeto foi construído utilizando um stack moderno de tecnologias front-end, backend e APIs de inteligência artificial:

### Frontend

- **Vite**: Bundler e ferramenta de desenvolvimento que oferece uma experiência de desenvolvimento extremamente rápida
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código
- **React**: Biblioteca JavaScript para construção de interfaces de usuário
- **React Router**: Para gerenciamento de rotas na aplicação
- **shadcn/ui**: Componentes de UI reutilizáveis e acessíveis
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e consistente
- **Radix UI**: Biblioteca de componentes acessíveis e não estilizados
- **Lucide React**: Biblioteca de ícones
- **React Hook Form**: Para gerenciamento de formulários
- **Zod**: Biblioteca de validação de dados
- **React Query**: Para gerenciamento de estado e requisições de dados

### Otimizações Anti-rolagem Horizontal

Foram implementadas várias melhorias CSS para garantir que os textos de análise não gerem barras de rolagem horizontal, mesmo quando contêm trechos muito longos de código ou texto:

```css
/* Contêiner principal de resultados */
#results {
    overflow-x: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Formatação para parágrafos */
#results p {
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Formatação para blocos pré-formatados e código */
#results pre, #results code {
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 100%;
    overflow-x: hidden;
}

/* Formatação para citações */
#results blockquote {
    max-width: 95%;
    word-wrap: break-word;
}
```

Estas melhorias garantem uma experiência visual consistente em todas as telas e dispositivos, preservando a formatação sem exigir rolagem horizontal.

### Backend

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web para Node.js
- **Multer**: Middleware para processamento de upload de arquivos
- **Mammoth.js**: Biblioteca para extração de texto de arquivos DOCX
- **CORS**: Middleware para configuração de Cross-Origin Resource Sharing

### Inteligência Artificial

- **OpenAI API**: API de inteligência artificial para análise avançada de documentos jurídicos

## Arquitetura do Sistema

O AdvContro segue uma arquitetura cliente-servidor, com um frontend baseado em componentes React e um backend em Node.js que serve como intermediário para a API da OpenAI e processa arquivos em diversos formatos.

### Camadas do Frontend

1. **Páginas**: Componentes de alto nível que representam as diferentes telas da aplicação
2. **Componentes**: Elementos reutilizáveis divididos em categorias:

   - Componentes de UI (interface de usuário)
   - Componentes de layout
   - Componentes específicos de domínio (como contratos)
3. **Hooks e Utilidades**: Funções e hooks personalizados para lógicas reutilizáveis

### Camadas do Backend

1. **Servidor Express**: Gerencia as requisições HTTP e rotas da API
2. **Middleware de Processamento**: Lida com validação, CORS e upload de arquivos
3. **Serviços de Extração de Texto**: Extrai conteúdo de diferentes formatos de arquivo
4. **Integração com OpenAI**: Envia textos para análise e processa as respostas

## Funcionalidades Principais

O sistema AdvContro oferece as seguintes funcionalidades principais:

1. **Dashboard de Contratos**: Visualização centralizada de todos os contratos cadastrados
2. **Upload de Documentos**: Interface para upload de novos contratos
3. **Análise de Risco**: Categorização automática de contratos por nível de risco
4. **Detalhamento de Contratos**: Visualização detalhada de cada contrato
5. **Busca e Filtragem**: Funcionalidades para localizar contratos específicos
6. **Exportação Contextual**: Possibilidade de exportar contratos em formato PDF, com opções específicas para cada seção (visão geral, alterações, prazos e recomendações)
7. **Autenticação**: Sistema de login e registro de usuários

## Configuração do Ambiente de Desenvolvimento

Para configurar o ambiente de desenvolvimento, siga os passos abaixo:

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITÓRIO>

# Navegar para o diretório do projeto
cd advcontro

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Requisitos do Sistema

- Node.js (versão recomendada: 18.x ou superior)
- npm (versão 9.x ou superior)

## Estrutura do Projeto

```plaintext
advcontro/
│
├── docs/                  # Documentação do projeto
├── public/                # Arquivos estáticos
│   └── images/            # Imagens do sistema
├── src/                   # Código-fonte
│   ├── components/        # Componentes reutilizáveis
│   │   ├── contract/      # Componentes relacionados a contratos
│   │   ├── layout/        # Componentes de layout
│   │   ├── ui/            # Componentes de interface
│   │   └── user/          # Componentes relacionados a usuários
│   ├── pages/             # Páginas da aplicação
│   │   ├── Index.tsx      # Página inicial (landing page)
│   │   ├── about.tsx      # Página Sobre
│   │   ├── pricing.tsx    # Página de preços
│   │   ├── upload.tsx     # Página de upload de contratos
│   │   └── ...            # Outras páginas
│   ├── lib/               # Bibliotecas e utilitários
│   │   └── services/      # Serviços da aplicação
│   │       └── openai-service.ts # Integração com API da OpenAI
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Ponto de entrada da aplicação
├── .eslintrc.js           # Configuração do ESLint
├── package.json           # Dependências e scripts
├── postcss.config.js      # Configuração do PostCSS
├── tailwind.config.ts     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
└── vite.config.ts         # Configuração do Vite
```

## Componentes Principais

### ContractList

Componente que exibe a lista de contratos na dashboard. Permite visualizar, exportar e excluir contratos.

**Propriedades**:

- `contracts`: Lista de contratos a serem exibidos
- `onExportPdf`: Função para exportar contrato em PDF
- `onDelete`: Função para excluir contrato

### AnalysisResult

Componente principal para visualização da análise de contratos, com abas para diferentes seções e funcionalidade de exportação contextual em PDF.

**Propriedades**:

- `contract`: Objeto contendo dados do contrato e sua análise
- `onExportPdf`: Função opcional para exportação de PDF (usa implementação interna se não fornecida)

**Funcionalidades principais**:

- Visualização da análise em abas separadas (Visão Geral, Alterações, Prazos, Recomendações)
- Exportação para PDF contextual (exporta apenas o conteúdo da aba atual)
- Classificação visual de risco com badges coloridas
- Formatação avançada de conteúdo markdown

### Header e Footer

Componentes de layout que são compartilhados entre as diferentes páginas da aplicação.

### Componentes UI

O projeto utiliza os componentes do shadcn/ui, que são baseados no Radix UI e estilizados com Tailwind CSS. Estes incluem:

- Button
- Badge
- DropdownMenu
- Input
- Tabs
- Toast
- Dialog
- e muitos outros

Adicionalmente, implementamos processamento de Markdown para garantir que as análises jurídicas sejam exibidas de forma corretamente formatada, preservando negritos, listas, e estruturas de tópicos com espaçamento otimizado.

## Integração com OpenAI

O sistema AdvContro utiliza a API da OpenAI para realizar análise inteligente dos contratos submetidos pelos usuários. Esta integração permite uma análise avançada e automatizada de documentos jurídicos, sem filtros ou modificações que possam limitar a capacidade do modelo.

### Serviço OpenAI

A integração é gerenciada de duas formas: via servidor backend (`servidor-simples.js`) e via frontend (`src/lib/services/openai-service.ts`). Isso permite maior flexibilidade e robustez na comunicação com a API da OpenAI:

**Backend:**

- Processamento de arquivos via endpoints `/analisar-texto` e `/analisar-arquivo`
- Intermediação segura entre o frontend e a API da OpenAI
- Resolução de problemas de CORS através de configuração adequada

**Frontend:**

- Função `analyzeContract`: Envia o texto do contrato para o backend ou diretamente para a API da OpenAI
- Função `extractTextFromFile`: Extrai o texto de arquivos carregados (PDF, DOCX, TXT)
- Interface `ContractAnalysisResult`: Define a estrutura dos dados de análise

### Configuração de Parâmetros da API

A configuração da API OpenAI foi otimizada para análise jurídica com os seguintes parâmetros:

- **Model**: GPT-4o (o mais avançado disponível no lançamento)
- **Temperature**: 0.2 (reduzida para máxima factualidade e precisão nas análises)
- **Top-p**: 0.9 (nucleus sampling para balancear previsibilidade e criatividade)
- **Max tokens**: 4000 (permitindo análises extensas e detalhadas)
- **Response format**: Texto formatado com emojis e markdown (substituição do formato JSON por uma experiência mais estruturada e amigável)

### Estrutura da Análise Jurídica

A análise jurídica segue uma estrutura altamente personalizada e detalhada para garantir precisão e utilidade:

```markdown
- Cláusula X: [cite o número/nome exato da cláusula]
  - **Problema**: [cite o trecho específico e descreva o problema]
  - **Recomendação**: [sugestão concreta]
  - **Justificativa**: [base jurídica]
  - **Implicação**: [consequências]
```

A resposta é organizada em seções claramente definidas:

- ⭐ **NÍVEL DE RISCO**: Classificação baseada apenas nos problemas identificados
- 📄 **RESUMO FACTUAL**: Resumo objetivo do que consta no documento
- 🔎 **ANÁLISE JURÍDICA**: Apenas das cláusulas existentes no documento
- ⏰ **PRAZOS**: Somente prazos expressamente mencionados
- 💡 **RECOMENDAÇÕES**: Para problemas concretos identificados

### Interface de Visualização Unificada

A interface foi aprimorada para exibir a análise jurídica em formato de texto com emojis e estruturação clara, facilitando:

- Análise comparativa de múltiplos pontos simultaneamente
- Impressão e exportação mais eficiente dos relatórios
- Melhor experiência de usuário para profissionais jurídicos

### Tratamento de Erros

O serviço implementa tratamento robusto de erros para lidar com variações na resposta da API:

- Verificação flexível da estrutura da resposta
- Try/catch em múltiplos níveis para parsing JSON
- Respostas de fallback quando ocorrem erros
- Logging detalhado para depuração e auditoria

### Prompts Personalizados

#### Prompt de Análise de Contratos

O sistema utiliza um prompt detalhado e estruturado para garantir análises jurídicas precisas e factuais. O prompt atual foi refinado para evitar a invenção de informações e garantir que a análise seja baseada apenas no texto real do contrato.

#### Prompt de Reescrita Contratual

Além da análise, o sistema também oferece recursos para reescrever cláusulas problemáticas identificadas na análise, através de um prompt especializado que solicita a revisão das cláusulas com problemas apontados na análise jurídica.

Este prompt segue uma estrutura clara que inclui:

- Instrução para iniciar a resposta com "Segue sugestão para as cláusulas apontadas"
- Orientação para reescrever apenas os parágrafos das cláusulas apontadas na análise
- Diretriz para manter a numeração original e estrutura geral do contrato
- Critérios para reformulação, incluindo clareza, precisão, segurança jurídica, equilíbrio entre partes e conformidade legal

Este sistema de reescrita garante que as sugestões de alteração sejam precisas e focadas nos pontos problemáticos identificados na análise, preservando a estrutura original do contrato.

A estrutura de resposta foi padronizada para seguir um formato consistente:

```markdown
Segue a auditoria jurídica detalhada do [NOME DO CONTRATO], com base nos critérios estabelecidos. 
A análise está organizada por cláusula, apontando problemas identificados, sugestões de melhoria, 
justificativas e implicações para as partes.

🔹 **CLÁUSULA X – [TÍTULO DA CLÁUSULA]**

**Problema:**

    [cite o trecho específico e descreva o problema de forma concisa]

**Recomendação:**

    [sugestão concreta e direta para resolver o problema identificado]

**Justificativa:**

    [base jurídica ou prática para a mudança sugerida]

**Implicações:**

    [consequências principais da mudança, em formato compacto]
```

Ao final da análise, o sistema sempre inclui cinco seções obrigatórias:

```markdown
⚠️ CLÁUSULAS INCOMUNS / INOVADORAS BENÉFICAS
[Lista de cláusulas que se destacam positivamente]

✅ RECOMENDAÇÕES GERAIS
[Lista de recomendações gerais não vinculadas a cláusulas específicas]

⭐ **NÍVEL DE RISCO**: [Classificação como Alto, Médio ou Baixo, com justificativa]

📝 **RESUMO FACTUAL**: [Resumo objetivo sobre o que consta no documento]

🔎 **ANÁLISE JURÍDICA**: [Resumo da análise das principais cláusulas]

⏰ **PRAZOS**: [Apenas prazos expressamente mencionados no contrato]

💡 **RECOMENDAÇÕES**: [Principais recomendações para problemas identificados]
```

Esta abordagem estruturada garante que:

1. A análise seja sempre baseada em texto real do contrato, nunca em suposições
2. Cada recomendação esteja vinculada a trechos específicos do contrato original
3. As sugestões incluam justificativas legais sólidas e consequentes implicações
4. Haja sempre uma seção completa de resumo e recomendações prioritárias
5. O formato facilite a leitura e compreensão da análise

## Exportação PDF Contextual

O sistema implementa uma funcionalidade avançada de exportação em PDF que permite aos usuários gerar documentos a partir de qualquer seção da análise de contratos, com recente atualização para resolver problemas de ordenação de conteúdo e distorção de texto.

### Arquitetura da Exportação PDF

A funcionalidade utiliza uma combinação de bibliotecas modernas para gerar PDFs de alta qualidade a partir do conteúdo HTML:

- **jsPDF**: Biblioteca principal para geração de documentos PDF
- **html2canvas**: Responsável por capturar o conteúdo HTML e convertê-lo em imagem

### Otimizações Recentes

#### Correção da Distorção de Texto em Múltiplas Páginas

O sistema foi aprimorado para resolver problemas de distorção de texto e repetição de cláusulas entre páginas. A nova abordagem:

- Captura todo o conteúdo em uma única imagem de alta qualidade
- Posiciona corretamente segmentos específicos em cada página
- Garante que o texto mantenha tamanho e formato consistentes em todas as páginas
- Evita completamente repetição de cláusulas no documento

#### Indicador Visual de Processamento

Foi implementado um indicador visual de carregamento durante a exportação, melhorando a experiência do usuário especialmente para documentos maiores:

- Feedback visual durante todo o processo de geração do PDF
- Evita a confusão causada anteriormente por PDFs parciais/temporários
- Tratamento adequado de falhas com feedback claro ao usuário

### Implementação Técnica

```javascript
// Função para exportar o conteúdo atual para PDF
const exportToPdf = async () => {
  // Determina qual conteúdo exportar com base na aba ativa
  let targetRef = null;
  switch(activeTab) {
    case 'detailed': targetRef = overviewRef; break;
    case 'alteracoes': targetRef = changesRef; break;
    // Outras abas...
  }
  
  // Mostra indicador de carregamento
  const loadingMessage = document.createElement('div');
  loadingMessage.style.position = 'fixed';
  loadingMessage.style.top = '50%';
  loadingMessage.style.left = '50%';
  loadingMessage.style.zIndex = '9999';
  loadingMessage.innerHTML = '<div>Gerando PDF...</div>';
  document.body.appendChild(loadingMessage);
  
  try {
    // Captura o conteúdo HTML como canvas
    const canvas = await html2canvas(targetRef.current, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    // Cria o documento PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Adiciona cabeçalho e conteúdo
  pdf.text(contract.name, 15, 15);
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 30, imgWidth, imgHeight);
  
  // Salva o PDF
  pdf.save(`${fileName}.pdf`);
};
```

### Recursos Principais

1. **Exportação Contextual**: Exporta apenas o conteúdo da aba atual (visão geral, alterações, prazos ou recomendações)
2. **Nomeação Inteligente**: Gera nomes de arquivos personalizados baseados no nome do contrato e tipo de conteúdo
3. **Alta Qualidade**: Renderização em alta resolução (escala 2x) para melhor legibilidade
4. **Multi-páginas**: Suporte automático para conteúdo que excede uma página
5. **Tratamento de Erros**: Feedback visual para o usuário em caso de sucesso ou falha

## Melhorias Recentes e Futuras

### Atualizações mais recentes (Abril 2025)

- **Aprimoramento do Prompt de Análise**: Melhorias no prompt personalizado para garantir análises mais precisas e factuais, incluindo ênfase adicional para não inventar informações ausentes no contrato
- **Simplificação do Prompt de Reescrita Contratual**: Remoção da opção de blocos de citação para observações, tornando o formato de resposta mais limpo e direto
- **Integração com Banco de Dados**: Conexão com banco de dados estabelecida com sucesso, permitindo armazenamento e recuperação de contratos analisados
- **Processamento Avançado de Documentos**: Sistema aprimorado para extração de texto de arquivos DOCX, incluindo tratamento especial para preservação da formatação
- **Interface de Servidor Unificada**: Terminal com informações detalhadas sobre status do servidor e conexão com banco de dados
- **Sistema de Análise OpenAI**: Implementação completa da análise jurídica via API da OpenAI com tratamento de respostas e formatação estruturada
- **Processamento de Extração de Texto**: Melhoria no processo de extração de texto dos contratos, com capacidade de extração de arquivos DOCX com mais de 24.000 caracteres

### Melhorias Recentes Implementadas

1. **Nova Identidade Visual**:
   - Implementação de novo logo SVG com cores modernas e sofisticadas
   - Atualização completa da paleta de cores baseada nas cores do logo (azul petróleo, azul turquesa e verde água)
   - Adaptação visual completa para suporte ao tema escuro em todas as páginas institucionais
   - Revisão e harmonização visual de todos os componentes da interface
   - Substituição do nome "AdvContro" por "ContratoAI" em toda a interface para melhor alinhamento com a marca

2. **Sistema de Autenticação e Perfil de Usuário**:
   - Implementação de contexto de autenticação (AuthContext) usando Context API do React
   - Identificação visual do perfil do usuário no cabeçalho
   - Botão de sair facilmente acessível tanto no cabeçalho quanto no menu dropdown
   - Botão "Painel de Contratos" no cabeçalho exclusivo para usuários logados
   - Persistência do estado de login usando localStorage
   - Indicadores de notificações no menu do usuário
   - Redirecionamento para login após cadastro bem-sucedido

3. **Customização de Tema Claro/Escuro**:
   - Implementação de sistema de tema com Context API do React (ThemeProvider)
   - Persistência da preferência do usuário no localStorage

4. **Aprimoramentos na Exibição de Cláusulas e Justificativas**:
   - Padronização do layout na aba de alterações de contrato
   - Títulos de cláusulas exibidos em negrito para melhor legibilidade
   - Eliminação de duplicidade na exibição de justificativas
   - Implementação de texto padrão para cláusulas sem justificativa específica
   - Formatação visual aprimorada com demarcação clara entre texto corrigido e justificativa
   - Processamento inteligente para remoção de prefixos redundantes nas justificativas
   - Detecção automática da preferência do sistema na primeira visita
   - Nova aba "Aparência" na página de perfil do usuário com toggle para alternar entre temas
   - Adaptação completa das páginas institucionais (inicial e preços) para o tema escuro
   - Elementos visuais e componentes otimizados para contraste em ambientes com pouca luz
   - Feedback visual via toast ao alterar o tema
   - Uso de classes Tailwind `dark:` para estilização consistente em todo o sistema

5. **Isolamento de Dados por Usuário**:
   - Implementação de serviço de contratos (`contract-service.ts`) para gerenciamento de contratos por usuário
   - Persistência segmentada de contratos com associação direta ao ID do usuário

6. **Autenticação Aprimorada**:
   - Implementação de login com Google como método alternativo ao login tradicional
   - Integração com API OAuth do Google para autenticação segura
   - Criação automática de conta caso o usuário não exista no sistema
   - Sincronização de perfil com informações do Google (nome, email, foto)
   - Manutenção do login tradicional por email/senha para garantir flexibilidade aos usuários

7. **Melhorias na Visualização de Análise de Contratos**:
   - Remoção da exibição redundante do texto original nas cláusulas analisadas
   - Processamento inteligente das justificativas para eliminar títulos duplicados
   - Limpeza automática de marcadores e formatações duplicadas nas justificativas
   - Experiência visual mais limpa e focada nas recomendações e textos corrigidos
   - Uso de expressões regulares para tratamento avançado de textos jurídicos
   - Importação automática de contratos legados no primeiro login do usuário
   - Dashboard com filtros e busca exclusivos para contratos do usuário logado
   - Operações CRUD (criar, ler, atualizar, excluir) respeitando o isolamento por usuário

8. **Fluxo de Análise e Visualização de Contratos**:
   - Correção do fluxo de upload e análise para salvar contratos associados ao usuário atual
   - Redirecionamento imediato após análise para a página detalhada com abas (em vez do dashboard)
   - Compatibilidade entre níveis de risco em português e inglês (alto/high, médio/medium, baixo/low)
   - Feedback visual após conclusão da análise com notificações toast
   - Exibição de análises em tabs organizadas (resumo, riscos, alterações, prazos, recomendações)

9. **Processamento avançado de PDFs com extração local**:
   - Implementação da biblioteca pdf-parse para extração de texto local
   - Otimização de desempenho e confiabilidade no processamento de documentos
   - Uso seletivo da API OpenAI apenas para melhorar a formatação do texto extraído
   - Conversão do texto para arquivo TXT intermediário para processamento padronizado
   - Detecção e tratamento especial para PDFs com múltiplas páginas

10. **Entrada direta de texto para análise**:
   - Nova interface com abas para escolher entre upload de arquivo ou inserção direta de texto
   - Campo de texto amplo com estilo monospace para melhor visualização
   - Validação e feedback em tempo real
   - Processamento via API OpenAI seguindo o mesmo fluxo dos arquivos

11. **Extração precisa de alterações de cláusulas**:
   - Implementação de algoritmo que extrai apenas os parágrafos alterados
   - Manutenção da referência à cláusula original para contexto
   - Identificação precisa de formatação (tachado e negrito) para diferenciar texto original e modificação
   - Geração de IDs únicos para cada cláusula com timestamp parcial

11. **Robustez e tratamento de erros**:
   - Aprimoramento na manipulação de arquivos temporários
   - Tratamento defensivo para fluxos alternativos (análise direta vs. upload)
   - Timeout estendido para processamento de documentos complexos
   - Logs detalhados para facilitar diagnóstico e depuração

12. **Otimização para dispositivos móveis**:
    - Interface responsível para acesso via smartphones e tablets
    - Melhorias de usabilidade para telas menores

13. **Aprimoramento na exportação para PDF**:
    - Correção na captura de conteúdo para exportação
    - Tratamento avançado para elementos colapsados ou ocultos durante a exportação
    - Verificação de conteúdo significativo antes da geração do PDF
    - Feedback visual em caso de falha na captura do conteúdo
    - Logs detalhados para diagnóstico de problemas

14. **Otimização do funil de conversão**:
    - Redirecionamento de botões da página inicial para a página de registro
    - Configuração de "Experimentar Agora" e "Começar Agora" para incentivo ao cadastro
    - Redirecionamento de ações na página "Saiba Mais" para a página de registro
    - Padronização do fluxo de usuário para aumentar conversões

### Melhorias Futuras Planejadas

- Interface administrativa para gerenciamento de usuários
- Dashboard analítico com métricas e estatísticas
- Integração com sistemas de gestão documental
- Exportação de relatórios em formatos diversos

- Melhoria no processamento de PDFs complexos com reconhecimento avançado de tabelas e gráficos
- Processamento em lote para arquivos grandes dividindo-os em seções

## Backend e Processamento de Arquivos

### Servidor Express

O sistema utiliza um servidor Node.js com Express que funciona como intermediário entre o frontend e a API da OpenAI, sendo responsável pelo processamento de arquivos em diferentes formatos e pelo armazenamento persistente em banco de dados MySQL.

### Endpoints da API

#### Endpoints Básicos

- **`GET /`**: Endpoint de verificação de status do servidor
- **`POST /analisar-texto`**: Analisa texto de contrato enviado diretamente pela interface
- **`POST /analisar-arquivo`**: Processa uploads de arquivos (TXT, PDF, DOCX) e realiza análise
- **`POST /alterar-clausulas`**: Gera sugestões de reescrita para cláusulas problemáticas identificadas na análise

#### Endpoints de Banco de Dados (REST API)

- **`GET /api/contratos`**: Retorna todos os contratos cadastrados no banco de dados
- **`GET /api/contratos/:id`**: Retorna um contrato específico pelo ID
- **`POST /api/contratos`**: Adiciona um novo contrato ao banco de dados
- **`PUT /api/contratos/:id`**: Atualiza um contrato existente
- **`DELETE /api/contratos/:id`**: Remove um contrato do banco de dados
- **`POST /api/analisar-e-salvar`**: Analisa um arquivo ou texto e salva o resultado no banco de dados

### Integração com Banco de Dados MySQL

O sistema implementa uma camada de persistência utilizando MySQL para armazenar os contratos analisados:

- **Configuração de conexão**: Utiliza pool de conexões para maior eficiência e tolerância a falhas
- **Modelo de dados**: Estrutura otimizada para armazenar contratos com campos para conteúdo original, análise, nível de risco, recomendações e prazos
- **Inicialização automática**: O sistema verifica a conexão e cria as tabelas necessárias automaticamente na inicialização
- **Persistência opcional**: O servidor continua funcionando mesmo sem conexão com o banco de dados, mas com recursos limitados

#### Estrutura da Tabela de Contratos

```sql
CREATE TABLE contratos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo LONGTEXT,
  analise LONGTEXT,
  nivel_risco ENUM('alto', 'medio', 'baixo') NOT NULL,
  recomendacoes LONGTEXT,
  prazos TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Processamento de Arquivos

O sistema oferece suporte para os seguintes formatos de arquivo:

- **TXT**: Arquivos de texto puro são processados diretamente
- **PDF**: Arquivos PDF são processados usando a biblioteca pdf-parse para extração local de texto
- **DOCX**: Documentos do Word são convertidos para texto usando a biblioteca mammoth

O sistema oferece dois métodos principais de entrada para análise:

1. **Upload de arquivo**: Processa arquivos em diversos formatos
2. **Entrada direta de texto**: Permite que o usuário cole ou digite o texto diretamente na interface

O processamento de PDFs segue um fluxo otimizado:

1. Extrai o texto do PDF localmente usando a biblioteca pdf-parse
2. Para documentos complexos (mais de 5 páginas), utiliza a API OpenAI para melhorar a formatação do texto extraído

#### Tratamento de Erro da Biblioteca pdf-parse

A biblioteca pdf-parse requer uma estrutura de diretório específica para seus testes internos. Para garantir o funcionamento correto do servidor, implementamos uma solução que:

1. Verifica a existência do diretório `test/data` na inicialização do servidor
2. Cria este diretório recursivamente se não existir
3. Garante a presença do arquivo de teste `05-versions-space.pdf` que é requisitado internamente pela biblioteca

```javascript
// Tratamento para biblioteca pdf-parse
try {
  const testDir = path.join(__dirname, 'test', 'data');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
} catch (err) {
  console.log('Aviso: Não foi possível criar o diretório de teste:', err);
}
```

Esta solução defensiva permite que o servidor inicie sem erros mesmo em ambientes onde a biblioteca nunca foi executada anteriormente, melhorando significativamente a robustez e facilidade de implantação do sistema.

O fluxo completo de processamento de PDFs inclui:

1. Extração do texto do PDF localmente usando a biblioteca pdf-parse
2. Para documentos complexos (mais de 5 páginas), utilização da API OpenAI para melhorar a formatação do texto extraído
3. Salvamento do texto em um arquivo TXT temporário
4. Processamento desse arquivo TXT usando o mesmo fluxo dos arquivos de texto convencionais
5. Remoção dos arquivos temporários após o processamento

Já o processamento de texto inserido diretamente:

1. Salva o texto inserido em um arquivo temporário com nome único
2. Envia o texto para análise via API da OpenAI
3. Limpa arquivos temporários após o processamento
4. Segue o mesmo fluxo de análise dos arquivos convencionais
5. Remove os arquivos temporários após o processamento

Esta abordagem garante a maior precisão possível na extração de texto de PDFs complexos, incluindo documentos com tabelas, imagens e formatação especial.

### Configuração de CORS

O servidor implementa uma configuração avançada de CORS que permite comunicação segura entre o frontend e o backend:

```javascript
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

Os componentes seguem o padrão visual do shadcn/ui, mantendo consistência em toda a aplicação.

## Manutenção e Boas Práticas

### Organização do Código

- Manter componentes pequenos e com responsabilidade única
- Utilizar TypeScript para garantir tipagem estática
- Seguir os padrões de nomenclatura estabelecidos

### Desenvolvimento

- Realizar testes antes de enviar código para produção
- Manter as dependências atualizadas
- Documentar as alterações significativas

### Escalabilidade

Para garantir que o sistema continue escalável:

1. Dividir arquivos longos em componentes menores
2. Utilizar lazy loading para carregar partes da aplicação sob demanda
3. Implementar uma estratégia eficiente para gerenciamento de estado

## Processamento Avançado de Análises Jurídicas

O AdvContro implementou um sistema avançado de processamento de análises jurídicas em formato de texto/markdown que melhora significativamente a experiência do usuário:

### Extração Inteligente de Informações

O sistema agora possui capacidades avançadas para extrair e estruturar dados a partir de análises em formato de texto:

1. **Extração dupla de recomendações**: As recomendações são extraídas tanto da seção específica "RECOMENDAÇÕES" quanto da análise jurídica detalhada, garantindo que nenhuma sugestão importante seja perdida.

2. **Interpretação de riscos**: O sistema identifica riscos mencionados no texto e classifica automaticamente sua severidade (alto, médio, baixo) com base em palavras-chave.

3. **Captura de prazos**: Extrai automaticamente prazos mencionados no contrato para fácil visualização.

### Apresentação de Análises

O sistema apresenta as análises jurídicas de maneira clara e organizada:

1. **Formatação markdown rica**: Textos formatados com negrito, itálico, emojis e listas são renderizados adequadamente na interface.

2. **Destaque visual de seções-chave**: Elementos importantes como níveis de risco, recomendações e prazos são destacados com cores específicas.

3. **Exibição dual de recomendações**: As recomendações aparecem tanto na aba de análise detalhada quanto na aba específica de recomendações, facilitando o acesso.

4. **Suporte a múltiplos formatos de resposta**: O sistema funciona tanto com respostas estruturadas em JSON quanto com texto formatado em markdown.

### Compatibilidade com Servidor Customizado

O sistema foi otimizado para trabalhar perfeitamente com o `servidor-custom.js`, que utiliza um prompt personalizado para gerar análises jurídicas factuais e bem estruturadas. A interface processa inteligentemente o formato de texto/markdown retornado por este servidor, garantindo uma experiência consistente para o usuário.

---

Este documento foi atualizado em 26/04/2025 e reflete as implementações recentes do sistema, incluindo a nova identidade visual com logo SVG e paleta de cores sofisticada, padronização da marca como "ContratoAI", servidor backend com prompt aprimorado para análises jurídicas factuais e estruturadas, isolamento de dados por usuário no armazenamento de contratos, customização de tema claro/escuro com preferências salvos no perfil do usuário, adaptação completa das páginas institucionais para visualização em tema escuro, fluxo otimizado de análise com redirecionamento automático para visualização detalhada, formatação avançada com markdown, processamento de múltiplos formatos de arquivo, otimizações de layout para evitar rolagem horizontal, integração aprimorada com a API da OpenAI, processamento inteligente de recomendações e riscos em múltiplos formatos de resposta, autenticação alternativa com Google OAuth mantendo o login tradicional, melhorias na visualização de análises de contratos com padronização da exibição de cláusulas e justificativas, tratamento inteligente para garantir que todas as cláusulas exibam justificativas apropriadas, e melhorias na interface do usuário com acesso rápido ao Painel de Contratos.

```
