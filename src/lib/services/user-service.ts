import { query } from './db-service';
import { User } from '@/lib/auth/auth-context';

/**
 * Busca um usuário pelo email
 * @param email Email do usuário
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    const usersArray = users as any[];
    
    if (usersArray.length === 0) {
      return null;
    }
    
    const user = usersArray[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || '',
      image: user.image || ''
    };
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return null;
  }
}

/**
 * Busca um usuário pelo ID
 * @param id ID do usuário
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await query('SELECT * FROM users WHERE id = ?', [id]);
    const usersArray = users as any[];
    
    if (usersArray.length === 0) {
      return null;
    }
    
    const user = usersArray[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || '',
      image: user.image || ''
    };
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return null;
  }
}

/**
 * Atualiza os dados de um usuário
 * @param user Objeto de usuário com os dados atualizados
 */
export async function updateUser(user: User): Promise<boolean> {
  try {
    await query(
      'UPDATE users SET name = ?, email = ?, role = ?, company = ?, image = ? WHERE id = ?',
      [user.name, user.email, user.role, user.company, user.image, user.id]
    );
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
}

/**
 * Cria um novo usuário (versão simplificada para demonstração)
 * @param user Dados do usuário
 * @param password Senha do usuário (será armazenada em texto simples por simplicidade)
 */
export async function createUser(user: User, password: string): Promise<boolean> {
  try {
    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      return false;
    }
    
    await query(
      'INSERT INTO users (id, name, email, password, role, company, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, password, user.role, user.company, user.image]
    );
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return false;
  }
}

/**
 * Verifica as credenciais do usuário e retorna o usuário se válido
 * @param email Email do usuário
 * @param password Senha do usuário
 */
export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  try {
    const users = await query(
      'SELECT * FROM users WHERE email = ? AND password = ?', 
      [email, password]
    );
    
    const usersArray = users as any[];
    
    if (usersArray.length === 0) {
      return null;
    }
    
    const user = usersArray[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || '',
      image: user.image || ''
    };
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    return null;
  }
}

/**
 * Atualiza a senha do usuário
 * @param userId ID do usuário
 * @param currentPassword Senha atual
 * @param newPassword Nova senha
 */
export async function updatePassword(
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<boolean> {
  try {
    // Verificar senha atual
    const users = await query(
      'SELECT * FROM users WHERE id = ? AND password = ?', 
      [userId, currentPassword]
    );
    
    const usersArray = users as any[];
    
    if (usersArray.length === 0) {
      return false; // Senha atual incorreta
    }
    
    // Atualizar para a nova senha
    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return false;
  }
}
