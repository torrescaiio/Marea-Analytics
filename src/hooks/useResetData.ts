import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useResetData = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetData = async () => {
    setIsResetting(true);
    
    try {
      // Deletar todos os dados da tabela
      const { error } = await supabase
        .from('SalesData')
        .delete()
        .neq('id', 0); // Deleta todos os registros

      if (error) {
        throw error;
      }

      // Invalidar todas as queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['salesData'] });
      await queryClient.invalidateQueries({ queryKey: ['salesStats'] });
      await queryClient.invalidateQueries({ queryKey: ['salesDataCount'] });

      toast({
        title: "Dados redefinidos com sucesso",
        description: "Todos os dados foram removidos do banco de dados.",
      });
    } catch (error) {
      console.error('Erro ao redefinir dados:', error);
      
      toast({
        title: "Erro ao redefinir dados",
        description: "Ocorreu um erro ao tentar limpar o banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return { resetData, isResetting };
}; 