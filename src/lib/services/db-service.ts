/**
 * Serviço de Armazenamento Local
 * 
 * Esta é uma versão temporária que usa localStorage em vez de MySQL
 * para permitir o desenvolvimento do frontend sem depender do backend.
 */

// Chave para armazenar dados dos usuários no localStorage
const USERS_STORAGE_KEY = 'advcontro-users-db';

/**
 * Inicializa o "banco de dados" local
 */
export async function initDatabase() {
  try {
    // Verifica se já existe dados de usuários
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      // Cria um array vazio para armazenar usuários
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }
    
    console.log('Armazenamento local inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar armazenamento local:', error);
    return false;
  }
}

/**
 * Executa uma "consulta" no localStorage
 * Simula o comportamento de um banco de dados real
 */
export async function query(sqlQuery: string, params: any[] = []) {
  try {
    // Obter todos os usuários do localStorage
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
    const users = JSON.parse(usersJson);
    
    // Lógica básica para simular consultas SQL
    if (sqlQuery.includes('SELECT * FROM users WHERE email =')) {
      const email = params[0];
      return users.filter((user: any) => user.email === email);
    }
    else if (sqlQuery.includes('SELECT * FROM users WHERE id =')) {
      const id = params[0];
      return users.filter((user: any) => user.id === id);
    }
    else if (sqlQuery.includes('SELECT * FROM users WHERE email = ? AND password =')) {
      const [email, password] = params;
      return users.filter((user: any) => user.email === email && user.password === password);
    }
    else if (sqlQuery.includes('UPDATE users SET')) {
      // A última posição em params deve ser o id
      const id = params[params.length - 1];
      const updatedUsers = users.map((user: any) => {
        if (user.id === id) {
          // Se for update de senha
          if (sqlQuery.includes('password =')) {
            user.password = params[0];
          } else {
            // Atualização geral de usuário
            user.name = params[0];
            user.email = params[1];
            user.role = params[2];
            user.company = params[3];
            user.image = params[4];
          }
        }
        return user;
      });
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      return { affectedRows: 1 };
    }
    else if (sqlQuery.includes('INSERT INTO users')) {
      const [id, name, email, password, role, company, image] = params;
      
      users.push({
        id, name, email, password, role, company, image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return { affectedRows: 1 };
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao executar consulta no localStorage:', error);
    throw error;
  }
}

/**
 * Função para simular o fechamento do banco de dados
 */
export async function closeDatabase() {
  console.log('Simulação: Conexões com o banco de dados fechadas');
  return true;
}
