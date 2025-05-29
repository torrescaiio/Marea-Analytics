import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/contexts/FilterContext";
import { startOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ResponsivePie } from "@nivo/pie";
import { useCategorySales } from "@/hooks/useCategorySales";
import { motion } from "framer-motion";

const CategorySalesChart = () => {
  const { filters } = useFilters();
  const { categorySales, isLoading } = useCategorySales();
  const currentMonth = format(filters.dateRange?.from || startOfMonth(new Date()), "MMMM 'de' yyyy", { locale: ptBR });

  if (isLoading) {
    return (
      <Card className="bg-white shadow-md border-none rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-xl font-bold">Vendas por Categoria</CardTitle>
          <span className="text-sm text-muted-foreground">{currentMonth}</span>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border-4 border-gray-200 border-t-ocean-500 animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md border-none rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl font-bold">Vendas por Categoria</CardTitle>
        <span className="text-sm text-muted-foreground">{currentMonth}</span>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="h-[350px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {categorySales.length > 0 ? (
            <ResponsivePie
              data={categorySales}
              margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ datum: 'data.color' }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={5}
              arcLinkLabelsTextColor="hsl(200, 95%, 14%)"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color", modifiers: [["darker", 0.3]] }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#ffffff"
              enableArcLabels={true}
              arcLabel={d => `${d.value}%`}
              arcLinkLabel={d => `${d.id}`}
              tooltip={({ datum }) => (
                <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
                  <strong className="text-ocean-900">{datum.id}</strong>
                  <div className="text-sm text-gray-600">
                    <div>Participação: {datum.value}%</div>
                    <div>Faturamento: {datum.data.formattedValue}</div>
                  </div>
                </div>
              )}
              motionConfig="gentle"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Nenhum dado disponível para o período selecionado.
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart; 