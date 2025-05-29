import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useExcelUpload } from "@/hooks/useExcelUpload";
import { useRef } from "react";

const ExcelUpload = () => {
  const { uploadExcel, isUploading } = useExcelUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadExcel(file);
    }
  };

  return (
    <Card className="bg-ocean-gradient border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <Upload className={`h-12 w-12 mb-4 ${isUploading ? 'animate-spin' : 'animate-bounce'}`} />
          <h3 className="text-xl font-bold mb-3">Upload de Planilhas</h3>
          <p className="text-sm opacity-90 mb-6">
            Faça o upload dos seus dados mensais em formato Excel (.xlsx) para análise automática
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            className="w-full bg-white hover:bg-gray-50 text-ocean-600 font-medium"
            onClick={handleFileSelect}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Processando...' : 'Selecionar Arquivo Excel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;
