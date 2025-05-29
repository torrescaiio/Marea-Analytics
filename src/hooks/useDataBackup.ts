import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useDataBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const backupData = async (startDate: Date, endDate: Date) => {
    setIsBackingUp(true);
    
    try {
      // Buscar dados dentro do período especificado
      const { data, error } = await supabase
        .from('SalesData')
        .select('*')
        .gte('data_fiscal', startDate.toISOString().split('T')[0])
        .lte('data_fiscal', endDate.toISOString().split('T')[0]);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          title: "Atenção",
          description: "Não há dados para backup no período selecionado.",
          variant: "destructive",
        });
        return;
      }

      // Criar o arquivo de backup
      const backupContent = JSON.stringify(data, null, 2);
      const blob = new Blob([backupContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Nome do arquivo com período
      const fileName = `marea-backup-${startDate.toISOString().split('T')[0]}_ate_${endDate.toISOString().split('T')[0]}.json`;
      
      // Criar link para download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Perguntar se deseja remover os dados após o backup
      if (window.confirm('Backup realizado com sucesso! Deseja remover estes dados do banco?')) {
        const { error: deleteError } = await supabase
          .from('SalesData')
          .delete()
          .gte('data_fiscal', startDate.toISOString().split('T')[0])
          .lte('data_fiscal', endDate.toISOString().split('T')[0]);

        if (deleteError) {
          throw deleteError;
        }

        // Invalidar queries para atualizar os dados
        await queryClient.invalidateQueries({ queryKey: ['salesData'] });
        await queryClient.invalidateQueries({ queryKey: ['salesStats'] });
        await queryClient.invalidateQueries({ queryKey: ['salesDataCount'] });

        toast({
          title: "Dados removidos com sucesso",
          description: "Os dados do período selecionado foram removidos após o backup.",
          duration: 5000,
        });
      }

      toast({
        title: "Backup realizado com sucesso",
        description: `${data.length} registros foram exportados para ${fileName}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao fazer backup:', error);
      toast({
        title: "Erro ao fazer backup",
        description: "Ocorreu um erro ao tentar fazer o backup dos dados.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreData = async (file: File) => {
    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      if (!Array.isArray(data)) {
        throw new Error('Arquivo de backup inválido');
      }

      // Inserir dados de volta no banco
      const { error } = await supabase
        .from('SalesData')
        .insert(data);

      if (error) {
        throw error;
      }

      // Invalidar queries para atualizar os dados
      await queryClient.invalidateQueries({ queryKey: ['salesData'] });
      await queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      await queryClient.invalidateQueries({ queryKey: ['salesDataCount'] });

      toast({
        title: "Dados restaurados com sucesso",
        description: `${data.length} registros foram importados do backup`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro ao restaurar backup",
        description: "Ocorreu um erro ao tentar restaurar os dados do backup.",
        variant: "destructive",
      });
    }
  };

  return {
    backupData,
    restoreData,
    isBackingUp
  };
}; 