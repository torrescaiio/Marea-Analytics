import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';

export const useMonthlySales = () => {
  const { filters } = useFilters();

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['monthlySales', filters],
    queryFn: async () => {
      // Obter o primeiro dia de 6 meses atrás
      const today = new Date();
      const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      
      // Construir query base
      let query = supabase
        .from('SalesData')
        .select('*')
        .gte('data_fiscal', sixMonthsAgo.toISOString().split('T')[0])
        .order('data_fiscal', { ascending: true });

      // Aplicar todos os filtros ativos
      if (filters.selectedPdv && filters.selectedPdv !== 'todos') {
        query = query.eq('nome_pdv', filters.selectedPdv);
      }
      if (filters.selectedWaiter && filters.selectedWaiter !== 'todos') {
        query = query.eq('atendente', filters.selectedWaiter);
      }
      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        query = query.in('grupo', filters.selectedCategories);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30 // 30 segundos
  });

  const monthlySales = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      // Retorna dados de exemplo se não houver dados
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      return months.map(mes => ({
        mes,
        vendas: 0,
        metas: 50000
      }));
    }

    // Agrupar vendas por mês
    const monthlyGroups = salesData.reduce((acc, sale) => {
      const date = new Date(sale.data_fiscal);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          mes: monthKey,
          vendas: 0,
          metas: 50000 // Meta padrão
        };
      }
      acc[monthKey].vendas += Number(sale.valor_total || 0);
      return acc;
    }, {} as Record<string, any>);

    // Pegar os últimos 6 meses
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      months.push({
        mes: monthKey,
        vendas: monthlyGroups[monthKey]?.vendas || 0,
        metas: monthlyGroups[monthKey]?.metas || 50000
      });
    }

    return months;
  }, [salesData]);

  return { monthlySales, isLoading, error };
};
