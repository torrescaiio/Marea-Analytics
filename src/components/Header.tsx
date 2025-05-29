import { Waves, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useExcelUpload } from "@/hooks/useExcelUpload";
import { ResetDataDialog } from "@/components/ResetDataDialog";
import { BackupManager } from "@/components/BackupManager";
import { Link } from "react-router-dom";

const Header = () => {
  const { uploadExcel, isUploading } = useExcelUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadExcel(file);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-ocean-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Waves className="h-8 w-8 text-ocean-600" />
              <div>
                <h1 className="text-2xl font-bold bg-ocean-gradient bg-clip-text text-transparent">
                  Marea Restaurante
                </h1>
                <p className="text-sm text-sand-700">Dashboard Analítico</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <ResetDataDialog />
            <BackupManager />
            <Button 
              variant="outline" 
              className="bg-white/90 border-ocean-200 hover:bg-ocean-50 text-ocean-700"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Processando...' : 'Upload Excel'}
            </Button>
            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-ocean-600 hover:bg-ocean-50"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
