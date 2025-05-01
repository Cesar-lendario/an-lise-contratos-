
import React, { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContractList } from "@/components/contract/contract-list";
import { getUserContracts, deleteContract } from "@/lib/services/contract-service";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/components/ui/use-toast";

// Usar a mesma interface do componente para evitar incompatibilidades
import type { Contract as ContractListItem } from "@/components/contract/contract-list";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [filterTab, setFilterTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página.",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);
  
  // Carregar contratos do usuário ao montar o componente
  useEffect(() => {
    if (user) {
      loadUserContracts();
    }
  }, [user]);
  
  // Função para carregar contratos do usuário atual
  const loadUserContracts = () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Buscar contratos do usuário atual
      const userContracts = getUserContracts(user.id);
      
      // Converter para o formato esperado pelo ContractList
      const formattedContracts: ContractListItem[] = userContracts.map(contract => ({
        id: contract.id,
        name: contract.name,
        uploadDate: contract.created_at,
        riskLevel: contract.riskLevel as "high" | "medium" | "low" | "alto" | "medio" | "baixo"
      }));
      
      setContracts(formattedContracts);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus contratos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPdf = (id: string) => {
    console.log(`Exportando contrato ${id} como PDF`);
    // Implementação de exportação para PDF seria feita aqui
    toast({
      title: "Exportando PDF",
      description: "Iniciando exportação do contrato para PDF..."
    });
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    
    try {
      // Excluir contrato do armazenamento
      const success = deleteContract(id, user.id);
      
      if (success) {
        // Atualizar estado local
        setContracts(prevContracts => prevContracts.filter(contract => contract.id !== id));
        
        toast({
          title: "Contrato excluído",
          description: "O contrato foi removido com sucesso."
        });
      } else {
        throw new Error("Não foi possível excluir o contrato");
      }
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      toast({
        title: "Erro na exclusão",
        description: "Não foi possível excluir o contrato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Painel de Contratos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie e analise seus documentos
              </p>
            </div>
            <Button asChild className="bg-contrato-400 hover:bg-contrato-500">
              <Link to="/upload" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Contrato
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar contratos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={filterTab} onValueChange={setFilterTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="recent">Recentes</TabsTrigger>
              <TabsTrigger value="high-risk">Alto Risco</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Carregando seus contratos...</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não tem contratos analisados.</p>
                <Button asChild className="bg-contrato-400 hover:bg-contrato-500">
                  <Link to="/upload">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Analisar seu primeiro contrato
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <ContractList 
                    contracts={filteredContracts} 
                    onExportPdf={handleExportPdf} 
                    onDelete={handleDelete}
                  />
                </TabsContent>
                
                <TabsContent value="recent">
                  <ContractList 
                    contracts={filteredContracts.sort((a, b) => 
                      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
                    ).slice(0, 2)} 
                    onExportPdf={handleExportPdf} 
                    onDelete={handleDelete}
                  />
                </TabsContent>
                
                <TabsContent value="high-risk">
                  <ContractList 
                    contracts={filteredContracts.filter(c => c.riskLevel === 'high' || c.riskLevel === 'alto')} 
                    onExportPdf={handleExportPdf} 
                    onDelete={handleDelete}
                  />
                </TabsContent>
              </>
            )}
          
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
