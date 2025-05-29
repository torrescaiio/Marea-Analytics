import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DetailedSalesReport from "@/components/DetailedSalesReport";
import { DateRangePicker } from "@/components/DateRangePicker";
import { useFilters } from "@/contexts/FilterContext";

const AdvancedFilters = () => {
  const { updateFilters } = useFilters();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white border-ocean-200">
          <Search className="h-4 w-4 mr-2" />
          Relatórios Avançados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 text-ocean-600 mr-2" />
            Selecione o Período do Relatório
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6 max-w-sm">
          <DateRangePicker onDateChange={(dateRange) => updateFilters({ dateRange })} />
        </div>

        <DetailedSalesReport />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilters;
