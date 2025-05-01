
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erro de Cadastro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de Senha",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    // Implementação do registro
    try {
      // Importar a função de criação de usuário diretamente aqui
      const { createUser } = await import("@/lib/services/user-service");
      const { v4: uuidv4 } = await import("uuid");
      
      // Criar um novo usuário com ID único
      const newUser = {
        id: uuidv4(),
        name: formData.name,
        email: formData.email,
        role: "advogado", // Papel padrão
        company: "", // Pode ser preenchido posteriormente
        image: ""
      };
      
      // Salvar o usuário no banco de dados
      const success = await createUser(newUser, formData.password);
      
      if (success) {
        toast({
          title: "Cadastro Realizado",
          description: "Conta criada com sucesso! Por favor, faça login para continuar.",
        });
        navigate("/login"); // Redirecionar para a página de login
      } else {
        throw new Error("Falha ao criar usuário");
      }
    } catch (error) {
      toast({
        title: "Erro no Cadastro",
        description: "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Simulação de registro com Google
      const { v4: uuidv4 } = await import("uuid");
      const { createUser } = await import("@/lib/services/user-service");
      
      // Gerar um e-mail único baseado em timestamp para evitar conflitos
      const timestamp = new Date().getTime();
      const googleUser = {
        id: uuidv4(),
        name: `Usuário Google ${timestamp}`,
        email: `google_user_${timestamp}@exemplo.com`,
        role: "advogado",
        company: "",
        image: ""
      };
      
      // Senha aleatória (na implementação real, seria gerenciada pelo OAuth)
      const randomPassword = uuidv4().substring(0, 8);
      
      // Criar usuário no banco de dados
      const success = await createUser(googleUser, randomPassword);
      
      if (success) {
        toast({
          title: "Cadastro com Google Realizado",
          description: "Conta criada com sucesso! Por favor, faça login para continuar.",
        });
        navigate("/login");
      } else {
        throw new Error("Falha ao criar usuário com Google");
      }
    } catch (error) {
      toast({
        title: "Erro no Cadastro com Google",
        description: "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
              <CardDescription className="text-center">
                Cadastre-se para começar a analisar contratos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleRegister}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-2"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19958629,21.2936293 7.26054966,24 12,24 C15.0540074,24 17.7444196,22.9461078 19.8022969,21.0166306 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.8023969,21.0167306 C21.9486328,19.0671482 23.2794958,16.1313448 23.4530401,12.9279983 L23.4545455,12.9272727 L12,12.9272727 L12,17.8181818 L18.4013196,17.8181818 C18.0569812,19.1436596 17.2727273,20.2818857 16.0407269,21.0125889 L19.8023969,21.0167306 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                  Cadastrar com Google
                </Button>
              </div>
              <div className="relative flex items-center">
                <span className="border-t w-full absolute"></span>
                <span className="text-muted-foreground text-sm bg-white px-2 relative mx-auto">
                  ou
                </span>
              </div>
              <form onSubmit={handleRegisterSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="João Silva"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      required 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-contrato-400 hover:bg-contrato-500 text-white"
                  >
                    Criar conta
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" onClick={() => navigate("/login")} className="text-xs text-muted-foreground">
                Já tem uma conta? Entrar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
