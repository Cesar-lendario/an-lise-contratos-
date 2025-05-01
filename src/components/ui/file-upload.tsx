
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  isLoading?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  acceptedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  isLoading = false,
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      // Validate file types
      const invalidFiles = acceptedFiles.filter(
        (file) => !acceptedFileTypes.includes(file.type)
      );
      
      if (invalidFiles.length > 0) {
        setError(`Tipo de arquivo inválido. Apenas PDF, DOCX e TXT são permitidos.`);
        return;
      }

      // Validate file size
      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError(`Arquivo muito grande. O tamanho máximo é ${maxSize / (1024 * 1024)}MB.`);
        return;
      }

      // Set files
      setError(null);
      setFiles(acceptedFiles);
      onFileSelect(acceptedFiles);
    },
    [acceptedFileTypes, maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(
      acceptedFileTypes.map((type) => [type, []])
    ),
    maxSize,
    maxFiles,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFileSelect(newFiles);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors",
          isDragActive 
            ? "border-contrato-500 bg-contrato-50"
            : "border-gray-300 hover:border-contrato-300 hover:bg-contrato-50/50",
          className
        )}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="h-10 w-10 text-contrato-500 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Processando seu contrato...</p>
          </div>
        ) : files.length > 0 ? (
          <div className="w-full">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-contrato-50 rounded-md mb-2"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-contrato-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-center text-gray-500 mt-2">
              Clique ou arraste para trocar o arquivo
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-10 w-10 text-contrato-500 mx-auto mb-4" />
            <p className="mb-2 text-sm font-semibold">
              Clique ou arraste arquivos para começar
            </p>
            <p className="text-xs text-gray-500">
              Formatos suportados: PDF, DOCX, TXT (máx. {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-destructive text-sm mt-2">{error}</div>
      )}
    </div>
  );
}
