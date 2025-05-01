// Script para criar e gerenciar as abas de resultado

// Função para criar as abas de resultado
function createResultTabs(container) {
    // Criar estrutura das abas
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';
    tabsContainer.id = 'result-tabs';
    
    // Adicionar as diferentes abas
    const tabs = [
        { id: 'analise-tab', label: 'Análise Detalhada', icon: '📋' },
        { id: 'alteracao-tab', label: 'Alteração', icon: '🔄' },
        { id: 'prazos-tab', label: 'Prazos', icon: '⏱️' },
        { id: 'recomendacoes-tab', label: 'Recomendações', icon: '💡' }
    ];
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.dataset.tab = tab.id;
        tabElement.innerHTML = `${tab.icon} ${tab.label}`;
        
        // Adicionar a primeira aba como ativa por padrão
        if (tab.id === 'analise-tab') {
            tabElement.classList.add('active');
        }
        
        tabsContainer.appendChild(tabElement);
    });
    
    // Criar os contêineres de conteúdo
    tabs.forEach(tab => {
        const contentElement = document.createElement('div');
        contentElement.className = 'tab-content';
        contentElement.id = tab.id + '-content';
        
        // Tornar o primeiro conteúdo visível por padrão
        if (tab.id === 'analise-tab') {
            contentElement.classList.add('active');
        }
        
        container.appendChild(contentElement);
    });
    
    // Inserir as abas antes dos conteúdos
    container.insertBefore(tabsContainer, container.firstChild);
    
    // Adicionar o comportamento de clique
    setupResultTabsBehavior();
    
    return {
        tabs: tabsContainer,
        contentElements: tabs.map(tab => document.getElementById(tab.id + '-content'))
    };
}

// Configurar comportamento das abas
function setupResultTabsBehavior() {
    const tabs = document.querySelectorAll('#result-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Remover classe active de todos os conteúdos
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Adicionar classe active à tab clicada
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const tabId = this.dataset.tab + '-content';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Função para obter alterações sugeridas para as cláusulas
async function getClausulasSugeridas(analiseTexto) {
    try {
        // Chamar API para obter as cláusulas alteradas
        const response = await fetch('http://localhost:3000/alterar-clausulas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ analise: analiseTexto })
        });
        
        if (!response.ok) {
            throw new Error('Falha ao obter alterações sugeridas');
        }
        
        const data = await response.json();
        return data.alteracoes;
    } catch (error) {
        console.error('Erro ao obter alterações sugeridas:', error);
        return 'Não foi possível obter alterações sugeridas no momento. Por favor, tente novamente mais tarde.';
    }
}

// Função para extrair elementos específicos da análise
function extractFromAnalysis(analysisText, section) {
    // Implementação básica para extrair as seções
    if (section === 'prazos') {
        const prazosMatch = analysisText.match(/⏰ \*\*PRAZOS\*\*:[\s\S]*?(?=\n\n\d+\.|$)/);
        return prazosMatch ? prazosMatch[0] : 'Nenhum prazo identificado.';
    } else if (section === 'recomendacoes') {
        const recomendacoesMatch = analysisText.match(/💡 \*\*RECOMENDAÇÕES\*\*:[\s\S]*?(?=\n\n\d+\.|$)/);
        return recomendacoesMatch ? recomendacoesMatch[0] : 'Nenhuma recomendação disponível.';
    }
    
    return '';
}

// Função para processar e distribuir o conteúdo nas abas
async function distributeContentToTabs(analysisText) {
    // Análise detalhada fica no conteúdo principal
    const analiseTab = document.getElementById('analise-tab-content');
    if (analiseTab) {
        window.renderAnalysisResult(analysisText, 'analise-tab-content');
    }
    
    // Alteração - busca cláusulas sugeridas
    const alteracaoTab = document.getElementById('alteracao-tab-content');
    if (alteracaoTab) {
        alteracaoTab.innerHTML = '<p>Carregando alterações sugeridas...</p>';
        
        try {
            const alteracoes = await getClausulasSugeridas(analysisText);
            window.renderAnalysisResult(alteracoes, 'alteracao-tab-content');
        } catch (error) {
            alteracaoTab.innerHTML = '<p>Erro ao carregar alterações sugeridas.</p>';
            console.error('Erro:', error);
        }
    }
    
    // Prazos
    const prazosTab = document.getElementById('prazos-tab-content');
    if (prazosTab) {
        const prazosContent = extractFromAnalysis(analysisText, 'prazos');
        window.renderAnalysisResult(prazosContent, 'prazos-tab-content');
    }
    
    // Recomendações
    const recomendacoesTab = document.getElementById('recomendacoes-tab-content');
    if (recomendacoesTab) {
        const recomendacoesContent = extractFromAnalysis(analysisText, 'recomendacoes');
        window.renderAnalysisResult(recomendacoesContent, 'recomendacoes-tab-content');
    }
}

// Exportar funções para uso global
window.createResultTabs = createResultTabs;
window.distributeContentToTabs = distributeContentToTabs;
