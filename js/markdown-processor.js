// Script de processamento de Markdown para o AdvContro

// Função para processar Markdown e aplicar formatação HTML
function processMarkdown(markdownText) {
    // Verifica se a biblioteca marked está disponível
    if (typeof marked === 'undefined') {
        console.error('A biblioteca Marked.js não está disponível.');
        return markdownText;
    }

    // Configuração personalizada para o Marked
    marked.setOptions({
        gfm: true,          // GitHub Flavored Markdown
        breaks: true,       // Quebras de linha convertidas para <br>
        sanitize: false,    // Não sanitizar para permitir HTML
        smartLists: true,   // Melhorar o formato das listas
        smartypants: true,  // Tipografia bonita para aspas, traços, etc.
        xhtml: false        // Não usar XHTML
    });

    // Renderizar o markdown
    return marked.parse(markdownText);
}

// Função para aplicar estilo aos títulos da análise
function applyTitleStyles() {
    // Aumentar o tamanho dos títulos H1 em 50%
    const titles = document.querySelectorAll('#results h1, #results h2, #results h3');
    
    titles.forEach(title => {
        // Adicionar classes para melhorar a visualização
        if (title.tagName === 'H1') {
            title.style.fontSize = '2.25rem'; // Aumenta em 50% o tamanho padrão (1.5 * 1.5)
            title.style.color = '#2563eb';
            title.style.borderBottom = '1px solid #e5e7eb';
            title.style.paddingBottom = '5px';
            title.style.marginTop = '1em';
        } else if (title.tagName === 'H2') {
            title.style.fontSize = '1.8rem'; // Aumenta em 50% o tamanho padrão (1.2 * 1.5)
            title.style.color = '#3b82f6';
        } else if (title.tagName === 'H3') {
            title.style.fontSize = '1.5rem'; // Aumenta em 50% o tamanho padrão (1 * 1.5)
            title.style.color = '#60a5fa';
        }
    });

    // Destacar texto em negrito
    const boldTexts = document.querySelectorAll('#results strong');
    boldTexts.forEach(text => {
        text.style.fontWeight = 'bold';
        text.style.color = '#374151';
    });
    
    // Reduzir o espaçamento entre os subtítulos específicos para apenas uma linha
    const specificLabels = document.querySelectorAll('#results p strong');
    let lastKeyParagraph = null;
    
    specificLabels.forEach(label => {
        const text = label.textContent.trim();
        if (['Problema:', 'Recomendação:', 'Justificativa:', 'Implicações:'].includes(text)) {
            const paragraph = label.closest('p');
            if (paragraph) {
                // Reduzir margens para praticamente zero
                paragraph.style.marginBottom = '0';
                paragraph.style.marginTop = '0';
                paragraph.style.lineHeight = '1';
                paragraph.style.paddingBottom = '0';
                paragraph.style.paddingTop = '0';
                paragraph.style.display = 'inline-block';
                paragraph.style.width = '100%';
                
                // Adicionar um pouco mais de espaço antes do primeiro item (Problema:)
                if (text === 'Problema:') {
                    paragraph.style.marginTop = '0.5em';
                }
                
                // Adicionar um pouco mais de espaço após o último item (Implicações:)
                if (text === 'Implicações:') {
                    paragraph.style.marginBottom = '0.7em';
                }
                
                lastKeyParagraph = paragraph;
            }
        }
    });
    
    // Aplicar estilo CSS diretamente ao container de resultados para garantir espaçamento mínimo e evitar rolagem horizontal
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        // Adicionar uma regra CSS para os parágrafos dentro do container de resultados
        const style = document.createElement('style');
        style.textContent = `
            #results p {
                margin-bottom: 0 !important;
                margin-top: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
            
            #results pre {
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
                max-width: 100% !important;
                overflow-x: hidden !important;
            }
            
            #results code {
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
                max-width: 100% !important;
            }
            
            #results blockquote {
                max-width: 95% !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                margin-left: 1em !important;
                margin-right: 1em !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Expor função para processar o resultado da análise
window.renderAnalysisResult = function(analysisText, containerId = 'results') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contêiner com ID "${containerId}" não encontrado.`);
        return false;
    }

    // Processar o markdown e inserir no contêiner
    container.innerHTML = processMarkdown(analysisText);
    
    // Aplicar estilos aos títulos
    applyTitleStyles();
    
    return true;
};
