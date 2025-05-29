import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import SalesChart from "@/components/SalesChart";
import TopItems from "@/components/TopItems";
import WaiterPerformance from "@/components/WaiterPerformance";
import FilterPanel from "@/components/FilterPanel";
import ExcelUpload from "@/components/ExcelUpload";
import AdvancedFilters from "@/components/AdvancedFilters";
import CategorySalesChart from "@/components/CategorySalesChart";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/contexts/FilterContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "@/components/MobileLayout";

const Index = () => {
  const { clearFilters } = useFilters();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
        <Header />
        
        {/* Main Content */}
        <main className="container mx-auto p-6">
          <div className="flex justify-between gap-6">
            {/* Left Column - Filters and Upload */}
            <div className="w-[300px] space-y-6">
              <FilterPanel />
              <ExcelUpload />
            </div>

            {/* Right Column - Main Content */}
            <div className="flex-1 space-y-6">
              {/* Advanced Filters and Clear Button */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sand-600 hover:text-sand-900"
                >
                  Limpar Filtros
                </Button>
                <AdvancedFilters />
              </div>

              {/* Stats Cards */}
              <StatsCards />

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                <SalesChart />
                <TopItems />
              </div>

              {/* Category Sales Chart */}
              <CategorySalesChart />

              {/* Waiter Performance */}
              <WaiterPerformance />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-ocean-200 mt-16">
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              © 2025 Marea Restaurante. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Index;
