import { useState } from 'react';
import { Calendar, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DateRangePicker } from '@/components/DateRangePicker';
import { useDataBackup } from '@/hooks/useDataBackup';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DateRange } from 'react-day-picker';
import { Separator } from '@/components/ui/separator';

export const BackupManager = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const { backupData, restoreData, isBackingUp } = useDataBackup();
  const [isOpen, setIsOpen] = useState(false);

  const handleBackup = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      return;
    }
    await backupData(dateRange.from, dateRange.to);
    setIsOpen(false);
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await restoreData(file);
    event.target.value = '';
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/90 border-ocean-200 hover:bg-ocean-50 text-ocean-700">
          <Calendar className="h-4 w-4 mr-2" />
          Gerenciar Backup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white rounded-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 text-ocean-600 mr-2" />
            Gerenciamento de Backup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seção de Backup */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-ocean-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fazer Backup</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Label className="text-sm text-gray-700">Selecione o período para backup</Label>
              <DateRangePicker onDateChange={setDateRange} />
              <Button 
                onClick={handleBackup} 
                disabled={!dateRange?.from || !dateRange?.to || isBackingUp}
                className="w-full bg-ocean-600 hover:bg-ocean-700 text-white"
              >
                {isBackingUp ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Fazendo backup...
                  </div>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Fazer Backup
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Seção de Restauração */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-ocean-600" />
              <h3 className="text-lg font-semibold text-gray-900">Restaurar Backup</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Selecione um arquivo de backup válido (.json) para restaurar os dados. Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restore-file" className="text-sm text-gray-700">
                  Arquivo de backup
                </Label>
                <Input
                  id="restore-file"
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="cursor-pointer bg-white border-gray-200 file:bg-ocean-50 file:text-ocean-600 file:border-0 file:mr-4"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 