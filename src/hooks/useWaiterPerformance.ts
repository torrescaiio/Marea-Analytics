import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';

export const useWaiterPerformance = () => {
  const { filters } = useFilters();

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['waiterPerformance', filters],
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

      // Construir a query base
      let query = supabase
        .from('SalesData')
        .select('*')
        .gte('data_fiscal', startDate.toISOString().split('T')[0])
        .lte('data_fiscal', endDate.toISOString().split('T')[0]);

      // Aplicar filtro de PDV se selecionado
      if (filters.selectedPdv && filters.selectedPdv !== 'todos') {
        query = query.eq('nome_pdv', filters.selectedPdv);
      }

      // Aplicar filtro de garçom se selecionado
      if (filters.selectedWaiter && filters.selectedWaiter !== 'todos') {
        query = query.eq('atendente', filters.selectedWaiter);
      }

      // Buscar dados do período
      const { data: periodData, error: periodError } = await query;

      if (periodError) {
        console.error('Erro ao buscar dados do período:', periodError);
        throw periodError;
      }

      return periodData || [];
    },
    staleTime: 1000 * 30 // 30 segundos
  });

  const waiterPerformance = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      return [];
    }

    // Agrupar por atendente
    const waiterGroups = salesData.reduce((acc, sale) => {
      const waiterName = sale.atendente || 'Não identificado';
      if (!acc[waiterName]) {
        acc[waiterName] = {
          nome: waiterName,
          vendas: 0,
          pedidos: 0,
          valorTotal: 0,
          metaDiaria: 2000 // Meta diária por garçom
        };
      }
      acc[waiterName].pedidos += 1;
      acc[waiterName].valorTotal += Number(sale.valor_total || 0);
      return acc;
    }, {} as Record<string, any>);

    // Calcular dias úteis no período
    const firstSaleDate = new Date(salesData[0].data_fiscal);
    const lastSaleDate = new Date(salesData[salesData.length - 1].data_fiscal);
    const workingDays = Math.ceil((lastSaleDate.getTime() - firstSaleDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Converter para array e ordenar por valor total
    const waitersArray = Object.values(waiterGroups)
      .sort((a: any, b: any) => b.valorTotal - a.valorTotal)
      .map((waiter: any, index: number) => {
        const metaAteHoje = waiter.metaDiaria * workingDays;
        const performance = Math.min(100, Math.max(0, Math.floor((waiter.valorTotal / metaAteHoje) * 100)));
        
        return {
          nome: waiter.nome,
          vendas: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(waiter.valorTotal),
          valorTotal: waiter.valorTotal,
          performance,
          pedidos: waiter.pedidos,
          rank: index + 1
        };
      });

    return waitersArray;
  }, [salesData]);

  return { waiterPerformance, isLoading, error };
};
