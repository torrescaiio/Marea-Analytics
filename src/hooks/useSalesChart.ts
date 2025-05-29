import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFilters } from "@/contexts/FilterContext";

interface SalesData {
  date: string;
  total: number;
}

export const useSalesChart = () => {
  const { filters } = useFilters();

  const { data: salesData, isLoading } = useQuery<SalesData[]>({
    queryKey: ["sales-chart", filters],
    queryFn: async () => {
      // Simulated data for now
      const today = new Date();
      const data: SalesData[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        data.unshift({
          date: format(date, "dd/MM", { locale: ptBR }),
          total: Math.floor(Math.random() * 10000) + 5000
        });
      }
      
      return data;
    }
  });

  const chartData = {
    labels: salesData?.map(item => item.date) ?? [],
    datasets: [
      {
        label: "Vendas",
        data: salesData?.map(item => item.total) ?? [],
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  return {
    data: chartData,
    isLoading
  };
}; 