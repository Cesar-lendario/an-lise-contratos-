
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user/user-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Função para obter o rótulo da função
  const getFuncaoLabel = (role: string): string => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'advogado': return 'Advogado';
      case 'assistente': return 'Assistente Jurídico';
      case 'estagiario': return 'Estagiário';
      case 'empresario': return 'Empresário';
      default: return role;
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/aic-logo.svg" alt="ContratoAI Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-contrato-900">ContratoAI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Início
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Preços
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Sobre
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Botão de Painel de Contratos */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden md:flex items-center gap-1 bg-contrato-100 text-contrato-900 hover:bg-contrato-200 border-contrato-500"
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  <span>Painel de Contratos</span>
                </Link>
              </Button>

              {/* Perfil do usuário com nome */}
              <div className="hidden md:flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-gray-500">{getFuncaoLabel(user?.role || '')}</span>
                </div>
              </div>
              
              {/* Menu de usuário dropdown */}
              <UserMenu onLogout={handleLogout} />
              
              {/* Botão Sair */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 text-contrato-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild className="text-contrato-900 hover:text-contrato-700">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-contrato-400 hover:bg-contrato-500 text-white" 
                onClick={handleRegister}
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
