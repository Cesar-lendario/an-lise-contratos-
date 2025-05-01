// Configuração do banco de dados MySQL
import mysql from 'mysql2/promise';

// Detalhes de conexão ao banco de dados
const dbConfig = {
  host: 'aicontrato.mysql.dbaas.com.br',
  user: 'aicontrato',
  password: 'Rasecb0754####', // Em produção, use variáveis de ambiente para senhas
  database: 'aicontrato',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Criação do pool de conexões para maior eficiência
const pool = mysql.createPool(dbConfig);

// Função para testar a conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    return false;
  }
}

// Função para executar queries
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar query:', error.message);
    throw error;
  }
}

export { pool, testConnection, query };
