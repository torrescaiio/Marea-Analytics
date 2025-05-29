import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';

export interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  activeWaiters: number;
  formattedTotalSales: string;
  formattedAverageTicket: string;
}

export const useSalesStats = () => {
  // Hook para acessar filtros, com fallback para quando o contexto não estiver disponível
  let filters;
  try {
    const filterContext = useFilters();
    filters = filterContext.filters;
  } catch {
    // Se o contexto não estiver disponível, usar valores padrão
    filters = {
      selectedCategories: [],
      selectedWaiter: 'todos',
      selectedPdv: 'todos',
      dateRange: undefined
    };
  }

  return useQuery({
    queryKey: ['salesStats', filters],
    queryFn: async () => {
      console.log('Calculando estatísticas no Supabase com filtros:', filters);
      
      let query = supabase
        .from('SalesData')
        .select('*');

      // Aplicar filtros
      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        query = query.in('grupo', filters.selectedCategories);
      }

      if (filters.selectedWaiter && filters.selectedWaiter !== 'todos') {
        query = query.eq('atendente', filters.selectedWaiter);
      }

      if (filters.selectedPdv && filters.selectedPdv !== 'todos') {
        query = query.eq('nome_pdv', filters.selectedPdv);
      }

      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('data_fiscal', filters.dateRange.from.toISOString())
          .lte('data_fiscal', filters.dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          totalSales: 0,
          totalOrders: 0,
          averageTicket: 0,
          activeWaiters: 0,
          formattedTotalSales: 'R$ 0,00',
          formattedAverageTicket: 'R$ 0,00'
        };
      }

      // Calcular estatísticas
      const totalSales = data.reduce((sum, item) => sum + Number(item.valor_total || 0), 0);
      const totalOrders = data.length;
      const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
      const uniqueWaiters = new Set(data.map(item => item.atendente).filter(Boolean)).size;

      const formattedTotalSales = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalSales);

      const formattedAverageTicket = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(averageTicket);

      console.log('Estatísticas calculadas:', {
        totalSales,
        totalOrders,
        averageTicket,
        activeWaiters: uniqueWaiters
      });

      return {
        totalSales,
        totalOrders,
        averageTicket,
        activeWaiters: uniqueWaiters,
        formattedTotalSales,
        formattedAverageTicket
      } as SalesStats;
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};
