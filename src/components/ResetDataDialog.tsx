import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useResetData } from "@/hooks/useResetData";

interface ResetDataDialogProps {
  className?: string;
}

export function ResetDataDialog({ className }: ResetDataDialogProps) {
  const { resetData, isResetting } = useResetData();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`bg-white/90 border-red-200 hover:bg-red-50 text-red-700 ${className}`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {isResetting ? 'Redefinindo...' : 'Redefinir Dados'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-lg border-0 shadow-2xl">
        <AlertDialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-semibold text-gray-900">
            Tem certeza dessa ação?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-gray-600">
            Esta ação irá <span className="font-medium text-red-600">remover permanentemente</span> todos os dados de vendas do banco de dados.
            <p className="mt-2 text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 space-x-3">
          <AlertDialogCancel className="w-full bg-white hover:bg-gray-50 border-gray-200">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={resetData}
            className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {isResetting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Redefinindo...
              </div>
            ) : (
              'Sim, redefinir dados'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 