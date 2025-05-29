import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30 // 30 segundos
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FilterProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="relative min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
            <Sidebar />
            <main className="relative ml-16 transition-all duration-300 min-h-screen">
              <div className="p-6">
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </FilterProvider>
  </QueryClientProvider>
);

export default App;
