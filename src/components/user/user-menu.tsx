
import * as React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  // Usando o contexto de autenticação para obter os dados do usuário
  const { user } = useAuth();
  
  // Não usamos mais notificações, removido conforme solicitado
  
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

  // Se não houver usuário, não renderiza o menu
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {/* Indicador de notificações removido conforme solicitado */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-contrato-100 text-contrato-700">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs font-semibold mt-1 text-contrato-600">
              {getFuncaoLabel(user.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Botão Meus Contratos removido conforme solicitado */}
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer flex w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          {/* Botão Notificações removido conforme solicitado */}
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
