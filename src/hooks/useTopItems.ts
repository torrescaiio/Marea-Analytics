import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFilters } from "@/contexts/FilterContext";

interface TopItem {
  id: string;
  name: string;
  quantity: number;
  totalValue: number;
  unitValue: number;
  sales: number;
}

export const useTopItems = () => {
  const { filters } = useFilters();

  return useQuery<TopItem[]>({
    queryKey: ["top-items", filters],
    queryFn: async () => {
      // Se não houver filtro de data, usar o mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const fromDate = filters.dateRange?.from || startOfMonth;
      const toDate = filters.dateRange?.to || endOfMonth;

      let query = supabase
        .from("SalesData")
        .select("*")
        .gte("data_fiscal", fromDate.toISOString().split('T')[0])
        .lte("data_fiscal", toDate.toISOString().split('T')[0]);

      // Aplicar outros filtros ativos
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

      if (error) {
        throw error;
      }

      // Agrupar por item e calcular métricas
      const itemMap = new Map<string, {
        quantity: number;
        totalValue: number;
        sales: number;
      }>();

      data.forEach((sale) => {
        const key = sale.nome_item;
        if (!key) return;

        const current = itemMap.get(key) || {
          quantity: 0,
          totalValue: 0,
          sales: 0
        };

        current.quantity += Number(sale.quantidade || 0);
        current.totalValue += Number(sale.valor_total || 0);
        current.sales += 1;

        itemMap.set(key, current);
      });

      // Converter para array e calcular valor unitário médio
      const items = Array.from(itemMap.entries())
        .map(([name, stats]) => ({
          id: name,
          name,
          quantity: stats.quantity,
          totalValue: stats.totalValue,
          unitValue: stats.totalValue / stats.quantity,
          sales: stats.sales
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

      return items;
    }
  });
}; 