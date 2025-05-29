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
    <Card className="w-full bg-gradient-to-r from-ocean-500 to-ocean-600 border-0 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardContent className="p-12 text-center">
        <div className="max-w-2xl mx-auto">
          <Upload className={`h-20 w-20 mx-auto mb-6 ${isUploading ? 'animate-spin' : 'animate-bounce'}`} />
          <h3 className="text-3xl font-bold mb-4">Upload de Planilhas</h3>
          <p className="text-lg mb-8 opacity-90">
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
            size="lg" 
            className="bg-white text-ocean-600 hover:bg-gray-50 font-semibold px-8 py-6 h-auto text-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleFileSelect}
            disabled={isUploading}
          >
            <Upload className="h-6 w-6 mr-3" />
            {isUploading ? 'Processando...' : 'Selecionar Arquivo Excel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;
