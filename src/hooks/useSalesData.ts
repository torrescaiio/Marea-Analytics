import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client'; // Verifique se este caminho está correto
import { useFilters } from '@/contexts/FilterContext'; // Verifique se este caminho está correto
import { useToast } from '@/components/ui/use-toast';

// Interface para os itens de venda (permanece a mesma)
export interface SalesDataItem {
  id: number;
  data_fiscal: string;
  nome_pdv: string; // <- Você já havia corrigido este nome, ótimo!
  nome_item: string;
  quantidade: number;
  valor_produto: number;
  desconto: number;
  tx_servico: number;
  valor_total: number;
  atendente: string;
  grupo_fixo: string;
  grupo: string;
  created_at: string;
}

/**
 * Hook para buscar DADOS BRUTOS de vendas com paginação
 */
export const useSalesData = (limit: number = 50, offset: number = 0) => {
  const { filters } = useFilters();

  return useQuery({
    queryKey: ['salesData', limit, offset, filters],
    queryFn: async () => {
      let query = supabase
        .from('SalesData')
        .select('*')
        .order('data_fiscal', { ascending: false });

      // Aplicar filtros
      if (filters.selectedCategories.length > 0) {
        query = query.in('grupo', filters.selectedCategories);
      }

      if (filters.selectedWaiter !== 'todos') {
        query = query.eq('atendente', filters.selectedWaiter);
      }

      if (filters.selectedPdv !== 'todos') {
        query = query.eq('nome_pdv', filters.selectedPdv);
      }

      if (filters.dateRange?.from) {
        query = query.gte('data_fiscal', filters.dateRange.from.toISOString().split('T')[0]);
      }

      if (filters.dateRange?.to) {
        query = query.lte('data_fiscal', filters.dateRange.to.toISOString().split('T')[0]);
      }

      // Aplicar paginação se necessário
      if (limit > 0) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as SalesDataItem[];
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};

/**
 * Hook para buscar a contagem total de registros
 */
export const useSalesDataCount = () => {
  const { filters } = useFilters();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['salesDataCount', filters],
    queryFn: async () => {
      let query = supabase
        .from('SalesData')
        .select('*', { count: 'exact', head: true });

      // Aplicar os mesmos filtros da query principal
      if (filters.selectedCategories.length > 0) {
        query = query.in('grupo', filters.selectedCategories);
      }

      if (filters.selectedWaiter !== 'todos') {
        query = query.eq('atendente', filters.selectedWaiter);
      }

      if (filters.selectedPdv !== 'todos') {
        query = query.eq('nome_pdv', filters.selectedPdv);
      }

      if (filters.dateRange?.from) {
        query = query.gte('data_fiscal', filters.dateRange.from.toISOString().split('T')[0]);
      }

      if (filters.dateRange?.to) {
        query = query.lte('data_fiscal', filters.dateRange.to.toISOString().split('T')[0]);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      // Verificar se está próximo do limite
      if (count && count > 25000) { // Aviso quando atingir 83.33% do limite
        toast({
          title: "Atenção ao limite de registros",
          description: `Você tem ${count.toLocaleString('pt-BR')} registros. O limite é de 30.000 registros. Considere fazer backup dos dados antigos.`,
          variant: "destructive",
          duration: 10000, // 10 segundos
        });
      }

      return count;
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};

/**
 * Hook refatorado para buscar ESTATÍSTICAS AGREGADAS diretamente do Supabase.
 * Este hook fará os cálculos (soma, contagem, etc.) no lado do servidor.
 */
export const useSalesStats = () => {
  let filters;
  try {
    const filterContext = useFilters();
    filters = filterContext.filters;
  } catch (e) {
    console.warn('[useSalesStats] FilterContext não encontrado. Usando filtros padrão.');
    filters = {
      selectedCategory: 'todas',
      selectedWaiter: 'todos',
      dateRange: { from: undefined, to: undefined },
    };
  }

  // A queryKey DEVE incluir os filtros para que o React Query
  // refaça a busca automaticamente quando os filtros mudarem.
  const queryKey = ['aggregatedSalesStats', filters];

  const {
    data: aggregatedData, // Este será o objeto { totalSales, totalOrders, activeWaiters }
    isLoading,
    error,
    isFetching, // Útil para mostrar feedback de atualização
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log('[useSalesStats] Iniciando busca de estatísticas agregadas com filtros:', JSON.stringify(filters));

      // Construir as queries base
      let totalSalesQueryBuilder = supabase.from('SalesData').select('total_sales:valor_total.sum()');
      let totalOrdersQueryBuilder = supabase.from('SalesData').select('*', { count: 'exact', head: true });
      let distinctWaitersQueryBuilder = supabase.from('SalesData').select('atendente');

      // Função auxiliar para aplicar filtros dinamicamente às queries do Supabase
      const applyFiltersToQuery = (queryBuilder: any) => {
        let qb = queryBuilder; // Evitar modificar o original diretamente se for usado em múltiplos lugares

        // Filtro de Categoria (Exemplo: se categoria pode estar em 'grupo' OU 'grupo_fixo')
        // Adapte esta lógica para como suas categorias são definidas!
        if (filters.selectedCategory && filters.selectedCategory !== 'todas') {
          // Se você tem certeza que 'grupo' é a coluna de categoria:
          qb = qb.eq('grupo', filters.selectedCategory);
          // Se puder ser 'grupo' OU 'grupo_fixo':
          // qb = qb.or(`grupo.eq.${filters.selectedCategory},grupo_fixo.eq.${filters.selectedCategory}`);
          console.log(`[useSalesStats] Filtro de categoria aplicado: ${filters.selectedCategory}`);
        }

        // Filtro de Garçom
        if (filters.selectedWaiter && filters.selectedWaiter !== 'todos') {
          qb = qb.eq('atendente', filters.selectedWaiter);
          console.log(`[useSalesStats] Filtro de garçom aplicado: ${filters.selectedWaiter}`);
        }

        // Filtro de Período (Data Fiscal)
        if (filters.dateRange?.from) {
          const fromDate = filters.dateRange.from instanceof Date
            ? filters.dateRange.from.toISOString().split('T')[0]
            : String(filters.dateRange.from).split('T')[0]; // Trata se já for string
          qb = qb.gte('data_fiscal', fromDate);
          console.log(`[useSalesStats] Filtro de data (início) aplicado: ${fromDate}`);
        }
        if (filters.dateRange?.to) {
          const toDate = filters.dateRange.to instanceof Date
            ? filters.dateRange.to.toISOString().split('T')[0]
            : String(filters.dateRange.to).split('T')[0]; // Trata se já for string
          qb = qb.lte('data_fiscal', toDate);
          console.log(`[useSalesStats] Filtro de data (fim) aplicado: ${toDate}`);
        }
        return qb;
      };

      // Aplicar os filtros a cada query builder
      totalSalesQueryBuilder = applyFiltersToQuery(totalSalesQueryBuilder);
      totalOrdersQueryBuilder = applyFiltersToQuery(totalOrdersQueryBuilder);
      distinctWaitersQueryBuilder = applyFiltersToQuery(distinctWaitersQueryBuilder);

      console.log('[useSalesStats] Queries prontas para execução.');

      // Executar todas as queries de agregação em paralelo
      const [
        salesQueryResult,
        ordersQueryResult,
        waitersQueryResult,
      ] = await Promise.all([
        totalSalesQueryBuilder.single(), // .single() porque esperamos um único objeto com a soma
        totalOrdersQueryBuilder,         // Retorna { data: null, count: X, error: null }
        distinctWaitersQueryBuilder,     // Retorna um array de objetos { atendente: 'nome' }
      ]);

      console.log('[useSalesStats] Resultados das queries:', { salesQueryResult, ordersQueryResult, waitersQueryResult });

      // Tratamento de erros individual para cada query
      if (salesQueryResult.error) {
        console.error('[useSalesStats] Erro ao buscar total de vendas agregado:', salesQueryResult.error);
        throw new Error(`Falha ao buscar total de vendas: ${salesQueryResult.error.message}`);
      }
      if (ordersQueryResult.error) {
        console.error('[useSalesStats] Erro ao buscar contagem total de pedidos:', ordersQueryResult.error);
        throw new Error(`Falha ao buscar contagem de pedidos: ${ordersQueryResult.error.message}`);
      }
      if (waitersQueryResult.error) {
        console.error('[useSalesStats] Erro ao buscar atendentes distintos:', waitersQueryResult.error);
        throw new Error(`Falha ao buscar atendentes: ${waitersQueryResult.error.message}`);
      }

      const totalSales = salesQueryResult.data?.total_sales || 0;
      const totalOrders = ordersQueryResult.count || 0;
      const activeWaiters = waitersQueryResult.data
        ? new Set(waitersQueryResult.data.map((item: any) => item.atendente).filter(Boolean)).size
        : 0;

      console.log('[useSalesStats] Estatísticas agregadas processadas:', { totalSales, totalOrders, activeWaiters });
      return { totalSales, totalOrders, activeWaiters };
    },
    staleTime: 1000 * 60,       // Dados são considerados "frescos" por 1 minuto
    // refetchInterval: 1000 * 60 * 5, // Opcional: refazer a busca a cada 5 minutos automaticamente
    retry: 1, // Tentar novamente 1 vez em caso de erro
  });

  // Calcular valores derivados e formatados usando React.useMemo
  // Este bloco permanece o mesmo, mas agora opera sobre `aggregatedData`
  const stats = React.useMemo(() => {
    if (isLoading || !aggregatedData) { // Removido 'error' daqui, pois será tratado abaixo
      return {
        totalSales: 0,
        totalOrders: 0,
        averageTicket: 0,
        activeWaiters: 0,
        formattedTotalSales: 'R$ 0,00',
        formattedAverageTicket: 'R$ 0,00',
      };
    }

    // Se houver erro na busca, aggregatedData pode não existir ou ser incompleto.
    // O error do useQuery já sinaliza isso.
    // Aqui, assumimos que se não está isLoading e aggregatedData existe, os dados são válidos.

    const { totalSales, totalOrders, activeWaiters } = aggregatedData;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    const formattedTotalSales = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalSales);

    const formattedAverageTicket = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(averageTicket);

    console.log('[useSalesStats] Estatísticas finais formatadas para UI:', {
      totalSales, totalOrders, averageTicket, activeWaiters, formattedTotalSales, formattedAverageTicket,
    });

    return {
      totalSales,
      totalOrders,
      averageTicket,
      activeWaiters,
      formattedTotalSales,
      formattedAverageTicket,
    };
  }, [aggregatedData, isLoading]); // Removido 'error' das dependências do useMemo, pois error é para a query

  return {
    stats,
    isLoading: isLoading || isFetching, // Combina isLoading inicial com isFetching para atualizações
    error, // Retorna o objeto de erro do useQuery
  };
};
