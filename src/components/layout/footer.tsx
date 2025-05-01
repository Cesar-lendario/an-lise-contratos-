
import * as React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FileText className="h-6 w-6 text-contrato-600" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ContratoAI. Todos os direitos reservados.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link to="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Termos
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Privacidade
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}
