import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFilterOptions = () => {
  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('SalesData')
        .select('grupo, grupo_fixo, atendente, nome_pdv')
        .order('data_fiscal', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  const filterOptions = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      return {
        categories: [],
        waiters: [],
        pdvs: []
      };
    }

    // Extrair grupos únicos
    const uniqueGroups = [...new Set(
      salesData
        .map(item => item.grupo || item.grupo_fixo)
        .filter(Boolean)
    )].sort();

    // Extrair atendentes únicos
    const uniqueWaiters = [...new Set(
      salesData
        .map(item => item.atendente)
        .filter(Boolean)
    )].sort();

    // Extrair PDVs únicos
    const uniquePdvs = [...new Set(
      salesData
        .map(item => item.nome_pdv)
        .filter(Boolean)
    )].sort();

    return {
      categories: uniqueGroups,
      waiters: uniqueWaiters,
      pdvs: uniquePdvs
    };
  }, [salesData]);

  return { 
    filterOptions, 
    isLoading, 
    error 
  };
};
