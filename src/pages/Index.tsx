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
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-6">
              <FilterPanel />
              <ExcelUpload />
            </aside>

            {/* Main Area */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <AdvancedFilters />
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sand-600 hover:text-sand-900"
                >
                  Limpar Filtros
                </Button>
              </div>

              <StatsCards />
              <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                <SalesChart />
                <TopItems />
              </div>
              <WaiterPerformance />
            </div>
          </div>
        </main>

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
