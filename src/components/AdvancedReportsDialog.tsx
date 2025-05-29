import { Dialog, DialogContent } from "@/components/ui/custom-dialog";
import { DateRangePicker } from "@/components/DateRangePicker";
import DetailedSalesReport from "@/components/DetailedSalesReport";
import { FileBarChart } from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvancedReportsDialog = ({ open, onOpenChange }: AdvancedReportsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-gray-200">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
            <div className="h-10 w-10 bg-ocean-100 rounded-lg flex items-center justify-center">
              <FileBarChart className="h-6 w-6 text-ocean-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h2>
              <p className="text-gray-600">Análise detalhada de vendas e desempenho</p>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Selecione o Período</h3>
            <DateRangePicker className="w-full bg-white border-gray-200 focus:ring-ocean-600" />
          </div>

          {/* Report Content */}
          <DetailedSalesReport />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedReportsDialog; 