
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth/auth-context";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Falha no login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    
    try {
      const success = await loginWithGoogle(credentialResponse.credential);
      
      if (success) {
        toast({
          title: "Login com Google realizado com sucesso",
          description: "Bem-vindo de volta!",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Falha no login com Google",
          description: "Não foi possível autenticar com o Google. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login com Google",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLoginError = () => {
    toast({
      title: "Erro ao fazer login com Google",
      description: "Ocorreu um erro na autenticação com o Google. Tente novamente mais tarde.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Entrar</CardTitle>
              <CardDescription className="text-center">
                Faça login para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    useOneTap
                    locale="pt-BR"
                    text="signin_with"
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    logo_alignment="center"
                    width="100%"
                  />
                </div>
              </div>
              <div className="relative flex items-center">
                <span className="border-t w-full absolute"></span>
                <span className="text-muted-foreground text-sm bg-white px-2 relative mx-auto">
                  ou
                </span>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Button variant="link" size="sm" className="px-0 text-xs">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-contrato-600 hover:bg-contrato-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" onClick={() => navigate("/register")} className="text-xs text-muted-foreground">
                Não tem uma conta? Cadastre-se
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
