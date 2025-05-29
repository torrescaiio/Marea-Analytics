import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import SalesChart from "@/components/SalesChart";
import TopItems from "@/components/TopItems";
import WaiterPerformance from "@/components/WaiterPerformance";
import FilterPanel from "@/components/FilterPanel";
import ExcelUpload from "@/components/ExcelUpload";
import AdvancedFilters from "@/components/AdvancedFilters";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/contexts/FilterContext";

const Index = () => {
  const { clearFilters } = useFilters();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
        <Header />
        
        {/* Main Content */}
        <section className="container mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Dashboard do 
              <span className="bg-ocean-gradient bg-clip-text text-transparent"> Marea</span>
            </h2>
            <p className="text-lg text-sand-700 max-w-2xl mx-auto">
              Análise completa das vendas do seu restaurante. 
              Insights em tempo real para decisões estratégicas.
            </p>
          </div>

          {/* Excel Upload - Full Width */}
          <div className="mb-8">
            <ExcelUpload />
          </div>

          {/* Filters and Actions Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Panel - Left Side */}
            <div className="flex-1">
              <FilterPanel />
            </div>

            {/* Actions Panel - Right Side */}
            <div className="w-full lg:w-64">
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-gray-700">
                  Ações
                </div>
                <AdvancedFilters />
                <Button 
                  variant="outline" 
                  size="default"
                  className="w-full border-ocean-200"
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8">
            <StatsCards />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <SalesChart />
            <TopItems />
          </div>

          {/* Waiter Performance */}
          <div className="mt-8">
            <WaiterPerformance />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-ocean-200 mt-16">
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              © 2024 Marea Restaurante. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Index;
