import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';

export type ReportType = 'by-item' | 'by-waiter' | 'by-growth' | 'by-hour' | 'by-category' | 'by-waiter-performance';

interface ReportData {
  data: any[];
  isLoading: boolean;
  error: any;
}

export const useDetailedReports = (reportType: ReportType): ReportData => {
  const { filters } = useFilters();

  // Função para obter dados do mês atual
  const getCurrentMonthData = async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    console.log('Buscando dados do mês atual:', {
      firstDayOfMonth: firstDayOfMonth.toISOString(),
      lastDayOfMonth: lastDayOfMonth.toISOString(),
      filters
    });

    let query = supabase
      .from('SalesData')
      .select('*');

    // Aplicar filtros de data se não houver um período específico selecionado
    if (!filters.dateRange?.from && !filters.dateRange?.to) {
      query = query
        .gte('data_fiscal', firstDayOfMonth.toISOString().split('T')[0])
        .lte('data_fiscal', lastDayOfMonth.toISOString().split('T')[0]);
    } else {
      // Usar o período selecionado nos filtros
      if (filters.dateRange?.from) {
        query = query.gte('data_fiscal', filters.dateRange.from.toISOString().split('T')[0]);
      }
      if (filters.dateRange?.to) {
        query = query.lte('data_fiscal', filters.dateRange.to.toISOString().split('T')[0]);
      }
    }

    // Aplicar filtros ativos
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
      console.error('Erro ao buscar dados do mês atual:', error);
      throw error;
    }

    console.log(`Dados do mês atual recuperados: ${data?.length || 0} registros`);
    return data || [];
  };

  // Função para obter dados do mês anterior
  const getLastMonthData = async () => {
    const today = new Date();
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    console.log('Buscando dados do mês anterior:', {
      firstDayOfLastMonth: firstDayOfLastMonth.toISOString(),
      lastDayOfLastMonth: lastDayOfLastMonth.toISOString(),
      filters
    });

    let query = supabase
      .from('SalesData')
      .select('*')
      .gte('data_fiscal', firstDayOfLastMonth.toISOString().split('T')[0])
      .lte('data_fiscal', lastDayOfLastMonth.toISOString().split('T')[0]);

    // Aplicar filtros ativos (exceto data)
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
      console.error('Erro ao buscar dados do mês anterior:', error);
      throw error;
    }

    console.log(`Dados do mês anterior recuperados: ${data?.length || 0} registros`);
    return data || [];
  };

  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['detailedReport', reportType, filters],
    queryFn: async () => {
      console.log('Iniciando busca de dados para o relatório:', reportType);
      console.log('Filtros ativos:', filters);

      try {
        const [currentMonthData, lastMonthData] = await Promise.all([
          getCurrentMonthData(),
          getLastMonthData()
        ]);

        console.log('Processando dados para o relatório...');

        let result = [];
        switch (reportType) {
          case 'by-item': {
            // Agrupar por item
            const itemGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const key = sale.nome_item;
              if (!key) return acc;
              
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  categoria: sale.grupo || sale.grupo_fixo || 'Sem categoria',
                  quantidade: 0,
                  valorTotal: 0,
                  vendas: 0
                };
              }
              acc[key].quantidade += Number(sale.quantidade || 0);
              acc[key].valorTotal += Number(sale.valor_total || 0);
              acc[key].vendas += 1;
              return acc;
            }, {});

            result = Object.values(itemGroups).sort((a: any, b: any) => b.valorTotal - a.valorTotal);
            break;
          }

          case 'by-waiter': {
            // Agrupar por garçom
            const waiterGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const key = sale.atendente;
              if (!key) return acc;
              
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  valorTotal: 0,
                  vendas: 0,
                  ticketMedio: 0,
                  itensVendidos: 0
                };
              }
              acc[key].valorTotal += Number(sale.valor_total || 0);
              acc[key].vendas += 1;
              acc[key].itensVendidos += Number(sale.quantidade || 0);
              return acc;
            }, {});

            // Calcular ticket médio
            Object.values(waiterGroups).forEach((waiter: any) => {
              waiter.ticketMedio = waiter.valorTotal / waiter.vendas;
            });

            result = Object.values(waiterGroups).sort((a: any, b: any) => b.valorTotal - a.valorTotal);
            break;
          }

          case 'by-growth': {
            // Agrupar dados do mês atual por item
            const currentItemGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const key = sale.nome_item;
              if (!key) return acc;
              
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  categoria: sale.grupo || sale.grupo_fixo || 'Sem categoria',
                  quantidade: 0,
                  valorTotal: 0
                };
              }
              acc[key].quantidade += Number(sale.quantidade || 0);
              acc[key].valorTotal += Number(sale.valor_total || 0);
              return acc;
            }, {});

            // Agrupar dados do mês anterior por item
            const lastItemGroups = lastMonthData.reduce((acc: any, sale: any) => {
              const key = sale.nome_item;
              if (!key) return acc;
              
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  quantidade: 0,
                  valorTotal: 0
                };
              }
              acc[key].quantidade += Number(sale.quantidade || 0);
              acc[key].valorTotal += Number(sale.valor_total || 0);
              return acc;
            }, {});

            // Calcular crescimento
            const growthData = Object.keys(currentItemGroups).map(itemName => {
              const current = currentItemGroups[itemName];
              const last = lastItemGroups[itemName] || { quantidade: 0, valorTotal: 0 };
              
              const quantityGrowth = last.quantidade === 0 
                ? 100 // Se não tinha vendas no mês anterior, considera 100% de crescimento
                : ((current.quantidade - last.quantidade) / last.quantidade) * 100;
              
              const revenueGrowth = last.valorTotal === 0
                ? 100
                : ((current.valorTotal - last.valorTotal) / last.valorTotal) * 100;

              return {
                nome: itemName,
                categoria: current.categoria,
                quantidadeAtual: current.quantidade,
                quantidadeAnterior: last.quantidade,
                crescimentoQuantidade: quantityGrowth,
                valorAtual: current.valorTotal,
                valorAnterior: last.valorTotal,
                crescimentoValor: revenueGrowth
              };
            });

            result = growthData.sort((a, b) => b.crescimentoValor - a.crescimentoValor);
            break;
          }

          case 'by-hour': {
            // Agrupar vendas por hora do dia
            const hourlyGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const date = new Date(sale.data_fiscal);
              if (isNaN(date.getTime())) return acc;
              
              const hour = date.getHours();
              const key = `${hour.toString().padStart(2, '0')}:00`;
              
              if (!acc[key]) {
                acc[key] = {
                  hora: key,
                  valorTotal: 0,
                  vendas: 0,
                  ticketMedio: 0
                };
              }
              acc[key].valorTotal += Number(sale.valor_total || 0);
              acc[key].vendas += 1;
              return acc;
            }, {});

            // Calcular ticket médio por hora
            Object.values(hourlyGroups).forEach((hour: any) => {
              hour.ticketMedio = hour.valorTotal / hour.vendas;
            });

            result = Object.values(hourlyGroups).sort((a: any, b: any) => {
              const hourA = parseInt(a.hora);
              const hourB = parseInt(b.hora);
              return hourA - hourB;
            });
            break;
          }

          case 'by-category': {
            // Agrupar por categoria
            const categoryGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const category = sale.grupo || sale.grupo_fixo || 'Sem categoria';
              if (!acc[category]) {
                acc[category] = {
                  nome: category,
                  valorTotal: 0,
                  quantidade: 0,
                  totalItens: 0,
                  items: {}
                };
              }
              acc[category].valorTotal += Number(sale.valor_total || 0);
              acc[category].quantidade += Number(sale.quantidade || 0);

              // Agrupar itens dentro da categoria
              const itemKey = sale.nome_item;
              if (!acc[category].items[itemKey]) {
                acc[category].items[itemKey] = {
                  nome: itemKey,
                  quantidade: 0,
                  valorTotal: 0,
                  vendas: 0
                };
              }
              acc[category].items[itemKey].quantidade += Number(sale.quantidade || 0);
              acc[category].items[itemKey].valorTotal += Number(sale.valor_total || 0);
              acc[category].items[itemKey].vendas += 1;

              return acc;
            }, {});

            // Processar os dados finais
            Object.values(categoryGroups).forEach((category: any) => {
              // Converter o objeto de itens em array e ordenar por valor total
              category.items = Object.values(category.items)
                .sort((a: any, b: any) => b.valorTotal - a.valorTotal);
              category.totalItens = category.items.length;
            });

            result = Object.values(categoryGroups).sort((a: any, b: any) => b.valorTotal - a.valorTotal);
            break;
          }

          case 'by-waiter-performance': {
            // Agrupar dados do mês atual por garçom
            const currentWaiterGroups = currentMonthData.reduce((acc: any, sale: any) => {
              const key = sale.atendente || 'Não informado';
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  vendas: 0,
                  valorTotal: 0,
                  itensVendidos: 0,
                  ticketMedio: 0
                };
              }
              acc[key].vendas += 1;
              acc[key].valorTotal += Number(sale.valor_total || 0);
              acc[key].itensVendidos += Number(sale.quantidade || 0);
              return acc;
            }, {});

            // Agrupar dados do mês anterior por garçom
            const lastWaiterGroups = lastMonthData.reduce((acc: any, sale: any) => {
              const key = sale.atendente || 'Não informado';
              if (!acc[key]) {
                acc[key] = {
                  nome: key,
                  vendas: 0,
                  valorTotal: 0,
                  itensVendidos: 0,
                  ticketMedio: 0
                };
              }
              acc[key].vendas += 1;
              acc[key].valorTotal += Number(sale.valor_total || 0);
              acc[key].itensVendidos += Number(sale.quantidade || 0);
              return acc;
            }, {});

            // Calcular métricas e crescimento
            const performanceData = Object.keys(currentWaiterGroups).map(waiterName => {
              const current = currentWaiterGroups[waiterName];
              const last = lastWaiterGroups[waiterName] || { 
                vendas: 0, 
                valorTotal: 0, 
                itensVendidos: 0 
              };

              // Calcular ticket médio
              current.ticketMedio = current.vendas > 0 ? current.valorTotal / current.vendas : 0;
              last.ticketMedio = last.vendas > 0 ? last.valorTotal / last.vendas : 0;

              // Calcular crescimento
              const salesGrowth = last.vendas === 0 
                ? 100 
                : ((current.vendas - last.vendas) / last.vendas) * 100;
              
              const revenueGrowth = last.valorTotal === 0
                ? 100
                : ((current.valorTotal - last.valorTotal) / last.valorTotal) * 100;

              const ticketGrowth = last.ticketMedio === 0
                ? 100
                : ((current.ticketMedio - last.ticketMedio) / last.ticketMedio) * 100;

              return {
                nome: waiterName,
                vendasAtual: current.vendas,
                vendasAnterior: last.vendas,
                crescimentoVendas: salesGrowth,
                valorAtual: current.valorTotal,
                valorAnterior: last.valorTotal,
                crescimentoValor: revenueGrowth,
                ticketMedioAtual: current.ticketMedio,
                ticketMedioAnterior: last.ticketMedio,
                crescimentoTicket: ticketGrowth,
                itensVendidosAtual: current.itensVendidos,
                itensVendidosAnterior: last.itensVendidos
              };
            });

            result = performanceData.sort((a, b) => b.crescimentoValor - a.crescimentoValor);
            break;
          }
        }

        console.log(`Relatório processado com sucesso. ${result.length} registros gerados.`);
        return result;
      } catch (err) {
        console.error('Erro ao processar relatório:', err);
        throw err;
      }
    },
    staleTime: 1000 * 30 // 30 segundos
  });

  return {
    data: reportData || [],
    isLoading,
    error
  };
}; 