import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatsCards from "@/components/StatsCards";
import TopItems from "@/components/TopItems";
import WaiterPerformance from "@/components/WaiterPerformance";
import FilterPanel from "@/components/FilterPanel";

const MobileLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
      {/* Header Mobile */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px]">
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-gray-900">Marea Analytics</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto p-4 space-y-6">
        <StatsCards />
        <div className="grid gap-6">
          <TopItems />
          <WaiterPerformance />
        </div>
      </main>
    </div>
  );
};

export default MobileLayout; 