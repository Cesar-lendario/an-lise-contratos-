// Código para substituir no lugar do código onde se mostra os resultados da análise de texto

// Mostrar os resultados
if (data.success && data.analysis) {
    if (data.format === "text") {
        // Inicializar as abas de resultado
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = ''; // Limpar conteúdo anterior
        window.createResultTabs(resultsContainer);
        
        // Distribuir o conteúdo entre as abas
        window.distributeContentToTabs(data.analysis);
    } else {
        // Tentar formatar como JSON bonito
        try {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = ''; // Limpar conteúdo anterior
            const resultsDiv = document.createElement('div');
            resultsDiv.id = 'results';
            resultsContainer.appendChild(resultsDiv);
            resultsDiv.textContent = JSON.stringify(data.analysis, null, 2);
        } catch (jsonError) {
            console.warn('Erro ao formatar JSON:', jsonError);
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = data.analysis;
        }
    }
