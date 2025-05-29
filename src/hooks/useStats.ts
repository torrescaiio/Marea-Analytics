import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFilters } from "@/contexts/FilterContext";

interface Stats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  activeWaiters: number;
}

export const useStats = () => {
  const { filters } = useFilters();

  return useQuery<Stats>({
    queryKey: ["stats", filters],
    queryFn: async () => {
      // Se não houver filtro de data, usar o mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const fromDate = filters.dateRange?.from || startOfMonth;
      const toDate = filters.dateRange?.to || endOfMonth;

      // Buscar dados de vendas
      const { data: salesData, error: salesError } = await supabase
        .from("SalesData")
        .select("valor_total, atendente")
        .gte("data_fiscal", fromDate.toISOString())
        .lte("data_fiscal", toDate.toISOString());

      if (salesError) {
        throw salesError;
      }

      // Calcular estatísticas
      const totalSales = salesData.reduce((sum, sale) => sum + (sale.valor_total || 0), 0);
      const totalOrders = salesData.length;
      const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Contar garçons únicos ativos (que fizeram vendas no período)
      const activeWaiters = new Set(salesData.map(sale => sale.atendente)).size;

      return {
        totalSales,
        totalOrders,
        averageTicket,
        activeWaiters
      };
    }
  });
}; 