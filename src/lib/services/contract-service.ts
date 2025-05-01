/**
 * Serviço de Gerenciamento de Contratos
 * 
 * Permite armazenar contratos associados a usuários específicos
 * usando localStorage para persistência durante o desenvolvimento.
 */

import { v4 as uuidv4 } from 'uuid';
import { User } from '@/lib/auth/auth-context';

// Chave para armazenar dados dos contratos no localStorage
const CONTRACTS_STORAGE_KEY = 'advcontro-contracts-db';

// Interface para o contrato
export interface Contract {
  id: string;
  userId: string; // ID do usuário proprietário
  name: string;
  content: string;
  analysis: string;
  riskLevel: 'alto' | 'medio' | 'baixo';
  recommendations: string;
  deadlines: string;
  created_at: string;
  updated_at: string;
}

/**
 * Inicializa o armazenamento de contratos
 */
export function initContractStorage(): boolean {
  try {
    // Verifica se já existe dados de contratos
    if (!localStorage.getItem(CONTRACTS_STORAGE_KEY)) {
      // Cria um array vazio para armazenar contratos
      localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify([]));
    }
    
    console.log('Armazenamento de contratos inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar armazenamento de contratos:', error);
    return false;
  }
}

/**
 * Obtém todos os contratos de um usuário específico
 */
export function getUserContracts(userId: string): Contract[] {
  try {
    const contractsJson = localStorage.getItem(CONTRACTS_STORAGE_KEY) || '[]';
    const contracts: Contract[] = JSON.parse(contractsJson);
    
    // Filtra apenas os contratos do usuário especificado
    return contracts.filter(contract => contract.userId === userId);
  } catch (error) {
    console.error('Erro ao obter contratos do usuário:', error);
    return [];
  }
}

/**
 * Obtém um contrato específico pelo ID
 */
export function getContractById(contractId: string, userId: string): Contract | null {
  try {
    const contractsJson = localStorage.getItem(CONTRACTS_STORAGE_KEY) || '[]';
    const contracts: Contract[] = JSON.parse(contractsJson);
    
    // Encontra o contrato pelo ID e verifica se pertence ao usuário
    const contract = contracts.find(c => c.id === contractId && c.userId === userId);
    return contract || null;
  } catch (error) {
    console.error('Erro ao obter contrato por ID:', error);
    return null;
  }
}

/**
 * Salva um novo contrato
 */
export function saveContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Contract | null {
  try {
    const contractsJson = localStorage.getItem(CONTRACTS_STORAGE_KEY) || '[]';
    const contracts: Contract[] = JSON.parse(contractsJson);
    
    const now = new Date().toISOString();
    
    // Se o contrato já tem ID, é uma atualização
    if (contract.id) {
      const index = contracts.findIndex(c => c.id === contract.id && c.userId === contract.userId);
      
      if (index !== -1) {
        // Atualiza o contrato existente
        contracts[index] = {
          ...contracts[index],
          ...contract,
          updated_at: now
        };
        
        localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
        return contracts[index];
      }
      
      return null; // Contrato não encontrado
    }
    
    // Caso contrário, é um novo contrato
    const newContract: Contract = {
      ...contract,
      id: uuidv4(),
      created_at: now,
      updated_at: now
    } as Contract;
    
    contracts.push(newContract);
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
    
    return newContract;
  } catch (error) {
    console.error('Erro ao salvar contrato:', error);
    return null;
  }
}

/**
 * Remove um contrato pelo ID
 */
export function deleteContract(contractId: string, userId: string): boolean {
  try {
    const contractsJson = localStorage.getItem(CONTRACTS_STORAGE_KEY) || '[]';
    const contracts: Contract[] = JSON.parse(contractsJson);
    
    // Filtra mantendo apenas os contratos que não correspondem ao ID e usuário
    const updatedContracts = contracts.filter(c => !(c.id === contractId && c.userId === userId));
    
    // Se o tamanho for igual, nenhum contrato foi removido
    if (updatedContracts.length === contracts.length) {
      return false;
    }
    
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(updatedContracts));
    return true;
  } catch (error) {
    console.error('Erro ao excluir contrato:', error);
    return false;
  }
}

/**
 * Importa contratos existentes no sistema para um novo usuário
 * (Usado para manter compatibilidade com contratos criados antes da implementação do sistema por usuário)
 */
export function importLegacyContracts(userId: string): number {
  try {
    // Verifica se há contratos antigos no localStorage
    const legacyContracts = localStorage.getItem('contratos');
    if (!legacyContracts) return 0;
    
    const parsedLegacyContracts = JSON.parse(legacyContracts);
    if (!Array.isArray(parsedLegacyContracts) || parsedLegacyContracts.length === 0) return 0;
    
    // Obter contratos atuais
    const contractsJson = localStorage.getItem(CONTRACTS_STORAGE_KEY) || '[]';
    const contracts: Contract[] = JSON.parse(contractsJson);
    
    const now = new Date().toISOString();
    let importCount = 0;
    
    // Converter contratos legados para o novo formato
    parsedLegacyContracts.forEach((legacy: any) => {
      // Criar novo contrato no formato atual
      const newContract: Contract = {
        id: uuidv4(),
        userId,
        name: legacy.titulo || legacy.name || 'Contrato Importado',
        content: legacy.conteudo || legacy.content || '',
        analysis: legacy.analise || legacy.analysis || '',
        riskLevel: mapRiskLevel(legacy.nivel_risco || legacy.riskLevel || 'medio'),
        recommendations: legacy.recomendacoes || legacy.recommendations || '',
        deadlines: legacy.prazos || legacy.deadlines || '',
        created_at: legacy.data_criacao || legacy.created_at || now,
        updated_at: now
      };
      
      contracts.push(newContract);
      importCount++;
    });
    
    if (importCount > 0) {
      localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
      console.log(`${importCount} contratos antigos importados com sucesso`);
    }
    
    return importCount;
  } catch (error) {
    console.error('Erro ao importar contratos legados:', error);
    return 0;
  }
}

/**
 * Mapeia nível de risco para um dos valores aceitos
 */
function mapRiskLevel(risk: string): 'alto' | 'medio' | 'baixo' {
  const normalized = risk.toLowerCase().trim();
  
  if (normalized.includes('alto') || normalized === 'high') {
    return 'alto';
  } else if (normalized.includes('baixo') || normalized === 'low') {
    return 'baixo';
  } else {
    return 'medio';
  }
}
