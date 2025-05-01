
import * as React from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, AlertTriangle, Calendar, MoreVertical, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contract {
  id: string;
  name: string;
  uploadDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'alto' | 'medio' | 'baixo';
}

interface ContractListProps {
  contracts: Contract[];
  onExportPdf: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContractList({ contracts, onExportPdf, onDelete }: ContractListProps) {
  const getRiskBadge = (risk: 'low' | 'medium' | 'high' | 'alto' | 'medio' | 'baixo') => {
    switch (risk) {
      case 'high':
      case 'alto':
        return <Badge variant="destructive">Alto Risco</Badge>;
      case 'medium':
      case 'medio':
        return <Badge className="bg-orange-500">Médio Risco</Badge>;
      case 'low':
      case 'baixo':
        return <Badge className="bg-green-500">Baixo Risco</Badge>;
      default:
        return <Badge className="bg-gray-500">Risco Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-gray-50">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Nenhum contrato analisado</h3>
          <p className="text-gray-500 mt-1 mb-4">Faça upload de um contrato para começar.</p>
          <Button asChild className="bg-contrato-600 hover:bg-contrato-700">
            <Link to="/upload">Analisar Contrato</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4">Contrato</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Data</th>
                  <th className="text-left py-3 px-4">Risco</th>
                  <th className="py-3 px-4 w-[70px]"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/contracts/${contract.id}`}
                        className="font-medium text-contrato-700 hover:text-contrato-800 flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{contract.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(contract.uploadDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRiskBadge(contract.riskLevel)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/contracts/${contract.id}`} className="cursor-pointer">
                              <FileText className="h-4 w-4 mr-2" />
                              <span>Ver detalhes</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportPdf(contract.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            <span>Exportar PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(contract.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
