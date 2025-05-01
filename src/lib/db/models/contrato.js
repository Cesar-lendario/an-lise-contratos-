// Modelo para gerenciamento de contratos no banco de dados
import { query } from '../config.js';

// Função para criar a tabela de contratos se não existir
async function criarTabelaContratos() {
  const sql = `
    CREATE TABLE IF NOT EXISTS contratos (
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
  `;
  
  try {
    await query(sql);
    console.log('✅ Tabela de contratos criada ou já existente');
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar tabela de contratos:', error.message);
    return false;
  }
}

// Função para adicionar um novo contrato
async function adicionarContrato(contrato) {
  const sql = `
    INSERT INTO contratos (titulo, conteudo, analise, nivel_risco, recomendacoes, prazos)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  try {
    const result = await query(sql, [
      contrato.titulo,
      contrato.conteudo,
      contrato.analise,
      contrato.nivel_risco,
      contrato.recomendacoes,
      contrato.prazos
    ]);
    
    return {
      id: result.insertId,
      ...contrato
    };
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error.message);
    throw error;
  }
}

// Função para buscar todos os contratos
async function buscarTodosContratos() {
  const sql = `
    SELECT * FROM contratos
    ORDER BY data_criacao DESC
  `;
  
  try {
    return await query(sql);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error.message);
    throw error;
  }
}

// Função para buscar um contrato pelo ID
async function buscarContratoPorId(id) {
  const sql = `
    SELECT * FROM contratos
    WHERE id = ?
  `;
  
  try {
    const resultados = await query(sql, [id]);
    return resultados.length > 0 ? resultados[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar contrato com ID ${id}:`, error.message);
    throw error;
  }
}

// Função para atualizar um contrato
async function atualizarContrato(id, contrato) {
  const sql = `
    UPDATE contratos
    SET titulo = ?, conteudo = ?, analise = ?, nivel_risco = ?, recomendacoes = ?, prazos = ?
    WHERE id = ?
  `;
  
  try {
    await query(sql, [
      contrato.titulo,
      contrato.conteudo,
      contrato.analise,
      contrato.nivel_risco,
      contrato.recomendacoes,
      contrato.prazos,
      id
    ]);
    
    return {
      id,
      ...contrato
    };
  } catch (error) {
    console.error(`Erro ao atualizar contrato com ID ${id}:`, error.message);
    throw error;
  }
}

// Função para excluir um contrato
async function excluirContrato(id) {
  const sql = `
    DELETE FROM contratos
    WHERE id = ?
  `;
  
  try {
    const resultado = await query(sql, [id]);
    return resultado.affectedRows > 0;
  } catch (error) {
    console.error(`Erro ao excluir contrato com ID ${id}:`, error.message);
    throw error;
  }
}

export {
  criarTabelaContratos,
  adicionarContrato,
  buscarTodosContratos,
  buscarContratoPorId,
  atualizarContrato,
  excluirContrato
};
