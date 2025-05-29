import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';
import { startOfMonth } from 'date-fns';

export const useCategorySales = () => {
  const { filters } = useFilters();

  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['categorySales', filters],
    queryFn: async () => {
      // Usar a data do filtro ou o mês atual
      const startDate = filters.dateRange?.from || startOfMonth(new Date());
      const endDate = filters.dateRange?.to || new Date();
      
      // Construir query base
      let query = supabase
        .from('SalesData')
        .select('*')
        .gte('data_fiscal', startDate.toISOString().split('T')[0])
        .lte('data_fiscal', endDate.toISOString().split('T')[0]);

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

  const categorySales = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      return [];
    }

    // Agrupar vendas por categoria
    const categoryGroups = salesData.reduce((acc, sale) => {
      const category = sale.grupo || 'Outros';
      
      if (!acc[category]) {
        acc[category] = {
          id: category,
          value: 0,
          totalValue: 0,
          color: getCategoryColor(category)
        };
      }
      acc[category].totalValue += Number(sale.valor_total || 0);
      return acc;
    }, {} as Record<string, any>);

    // Calcular percentuais
    const total = Object.values(categoryGroups).reduce((sum: number, cat: any) => sum + cat.totalValue, 0);
    
    return Object.values(categoryGroups).map((category: any) => ({
      ...category,
      value: Math.round((category.totalValue / total) * 100),
      formattedValue: category.totalValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }));
  }, [salesData]);

  return { categorySales, isLoading, error };
};

// Função auxiliar para definir cores por categoria
const getCategoryColor = (category: string): string => {
  const colors = {
    'Prato Principal': 'hsl(200, 95%, 14%)', // ocean-900
    'Entradas Quentes': 'hsl(22, 28%, 37%)', // sand-700
    'Entradas Frias': 'hsl(200, 70%, 25%)', // ocean-800
    'Cervejas': 'hsl(22, 40%, 20%)', // sand-900
    'Não Alcoólicos': 'hsl(200, 60%, 35%)', // ocean-700
    'Drink\'s': 'hsl(22, 35%, 45%)', // sand-600
    'Kids': 'hsl(200, 50%, 45%)', // ocean-600
    'Sobremesa': 'hsl(22, 45%, 30%)', // sand-800
    'Destilados': 'hsl(200, 40%, 55%)', // ocean-500
    'Sucos': 'hsl(22, 50%, 25%)', // sand-850
    'Room Service': 'hsl(200, 30%, 65%)', // ocean-400
    'Vinho Branco': 'hsl(22, 55%, 35%)', // sand-750
    'Champagnes e Espumantes': 'hsl(200, 85%, 20%)', // ocean-850
    'Outros': 'hsl(200, 20%, 75%)' // ocean-300
  };

  return colors[category as keyof typeof colors] || colors['Outros'];
}; 