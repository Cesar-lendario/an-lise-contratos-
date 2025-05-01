import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, verifyCredentials, updateUser as dbUpdateUser, createUser } from '@/lib/services/user-service';
import { initDatabase } from '@/lib/services/db-service';
import { initContractStorage, importLegacyContracts } from '@/lib/services/contract-service';
import { jwtDecode } from 'jwt-decode';

// Definição do tipo de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  company?: string;
}

// Interface do contexto de autenticação
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  // Flag para indicar se o usuário tem contratos legados importados
  hasImportedLegacyContracts: boolean;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Usuário de demonstração
const demoUser: User = {
  id: '1',
  name: 'Advogado Demo',
  email: 'advogado@exemplo.com',
  role: 'advogado',
  image: '',
  company: 'Escritório Exemplo'
};

// Provider do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar o usuário atual
  const [user, setUser] = useState<User | null>(null);
  // Estado para rastrear se os contratos legados foram importados
  const [hasImportedLegacyContracts, setHasImportedLegacyContracts] = useState<boolean>(false);
  
  // Verifica se há um usuário no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('advcontro-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id && userData.name && userData.email) {
          setUser(userData);
          console.log('Usuário restaurado do localStorage:', userData.name);
        } else {
          console.error('Dados de usuário incompletos no localStorage');
          localStorage.removeItem('advcontro-user');
        }
      } catch (error) {
        console.error('Erro ao processar dados do usuário do localStorage:', error);
        localStorage.removeItem('advcontro-user');
      }
    }
  }, []);
  
  // Inicializar o banco de dados e armazenamento de contratos
  useEffect(() => {
    // Inicializa o banco de dados de usuários
    initDatabase()
      .then(success => {
        if (success) {
          console.log('Banco de dados inicializado com sucesso');
          // Verificar se o usuário demo já existe, caso não, criá-lo
          ensureDemoUserExists();
        }
      })
      .catch(error => {
        console.error('Erro ao inicializar banco de dados:', error);
      });
      
    // Inicializa o armazenamento de contratos
    if (initContractStorage()) {
      console.log('Armazenamento de contratos inicializado com sucesso');
    } else {
      console.error('Erro ao inicializar armazenamento de contratos');
    }
  }, []);

  // Garantir que o usuário demo exista no banco
  const ensureDemoUserExists = async () => {
    try {
      const existingUser = await getUserByEmail('advogado@exemplo.com');
      if (!existingUser) {
        await createUser({
          ...demoUser,
          id: uuidv4() // Gera um UUID para o usuário demo
        }, 'senha123');
      }
    } catch (error) {
      console.error('Erro ao verificar/criar usuário demo:', error);
    }
  };

  // Função de login com persistência melhorada
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Para facilitar o desenvolvimento, aceita qualquer login em ambiente de desenvolvimento
      let userData;
      
      if (email === 'advogado@exemplo.com' && password === 'senha123') {
        // Usuário demo
        userData = demoUser;
      } else {
        // Tenta buscar usuário registrado no banco
        userData = await verifyCredentials(email, password);
        
        // Se não encontrar, retorna erro
        if (!userData) {
          console.error('Credenciais inválidas');
          return false;
        }
      }
      
      // Define o usuário
      setUser(userData);
      
      // Importa os contratos legados se for a primeira vez que esse usuário faz login
      const importKey = `advcontro-imported-${userData.id}`;
      const hasImported = localStorage.getItem(importKey) === 'true';
      
      if (!hasImported) {
        // Importa contratos legados para este usuário
        const importedCount = importLegacyContracts(userData.id);
        console.log(`${importedCount} contratos importados para o usuário ${userData.name}`);
        
        // Marca que contratos já foram importados para este usuário
        localStorage.setItem(importKey, 'true');
        setHasImportedLegacyContracts(true);
      }
      
      // Armazena no localStorage para persistência
      localStorage.setItem('advcontro-user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };
  
  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('advcontro-user');
  };
  
  // Função para atualizar dados do usuário no banco de dados
  const updateUser = async (updatedUser: User) => {
    try {
      // Atualizar o estado local primeiro para feedback imediato
      setUser(updatedUser);
      localStorage.setItem('advcontro-user', JSON.stringify(updatedUser));
      
      // Atualizar no banco de dados
      const success = await dbUpdateUser(updatedUser);
      
      if (!success) {
        console.error('Falha ao atualizar usuário no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      // Mesmo com erro, mantemos a atualização local para permitir o desenvolvimento
    }
  };

  // Função para login com credencial Google
  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      // Decodificar o token para obter informações do usuário
      const decoded: any = jwtDecode(credential);
      
      // Extrair dados do token
      const email = decoded.email;
      const name = decoded.name || decoded.given_name + ' ' + decoded.family_name;
      const picture = decoded.picture;
      
      // Verificar se usuário já existe
      let userData = await getUserByEmail(email);
      
      if (!userData) {
        // Criar novo usuário
        const newUser: User = {
          id: uuidv4(),
          email,
          name,
          image: picture,
          role: 'advogado',
          company: '',
        };
        
        // Salvar no banco com uma senha aleatória (nunca será usada)
        await createUser(newUser, uuidv4());
        userData = newUser;
      }
      
      // Define o usuário no estado
      setUser(userData);
      
      // Importa os contratos legados se necessário
      const importKey = `advcontro-imported-${userData.id}`;
      const hasImported = localStorage.getItem(importKey) === 'true';
      
      if (!hasImported) {
        const importedCount = importLegacyContracts(userData.id);
        console.log(`${importedCount} contratos importados para o usuário ${userData.name}`);
        localStorage.setItem(importKey, 'true');
        setHasImportedLegacyContracts(true);
      }
      
      // Armazena no localStorage para persistência
      localStorage.setItem('advcontro-user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      return false;
    }
  };

  // Monta o valor do contexto
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
    updateUser,
    hasImportedLegacyContracts
  };
  
  // Retorna o provider com o valor
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
