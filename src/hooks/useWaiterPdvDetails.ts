import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';

export const useWaiterPdvDetails = (waiterName: string) => {
  const { filters } = useFilters();

  return useQuery({
    queryKey: ['waiterPdvDetails', waiterName, filters],
    queryFn: async () => {
      // Determinar o período de busca
      let startDate, endDate;
      
      if (filters.dateRange?.from && filters.dateRange?.to) {
        // Usar o período selecionado nos filtros
        startDate = new Date(filters.dateRange.from);
        endDate = new Date(filters.dateRange.to);
      } else {
        // Usar o mês atual como padrão
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }

      const { data, error } = await supabase
        .from('SalesData')
        .select('nome_pdv, valor_total')
        .eq('atendente', waiterName)
        .gte('data_fiscal', startDate.toISOString().split('T')[0])
        .lte('data_fiscal', endDate.toISOString().split('T')[0]);

      if (error) throw error;

      // Agrupar vendas por PDV
      const pdvSales = data.reduce((acc, sale) => {
        const pdv = sale.nome_pdv || 'Não identificado';
        if (!acc[pdv]) {
          acc[pdv] = {
            pdv,
            totalVendas: 0,
            quantidadePedidos: 0,
          };
        }
        acc[pdv].totalVendas += Number(sale.valor_total || 0);
        acc[pdv].quantidadePedidos += 1;
        return acc;
      }, {} as Record<string, any>);

      // Converter para array e ordenar por valor total
      return Object.values(pdvSales)
        .sort((a, b) => b.totalVendas - a.totalVendas)
        .map(pdv => ({
          ...pdv,
          totalVendas: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(pdv.totalVendas),
        }));
    },
    staleTime: 1000 * 60 // 1 minuto
  });
}; 