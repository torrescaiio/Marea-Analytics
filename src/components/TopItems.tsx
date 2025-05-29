import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTopItems } from "@/hooks/useTopItems";

const TopItems = () => {
  const { data: items, isLoading } = useTopItems();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">Top Itens do Mês</span>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">Top Itens do Mês</span>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum dado disponível para o período selecionado.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">Top Itens do Mês</span>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                ${index === 0 ? 'bg-ocean-600' : ''}
                ${index === 1 ? 'bg-gray-500' : ''}
                ${index === 2 ? 'bg-orange-500' : ''}
                ${index > 2 ? 'bg-gray-400' : ''}
              `}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.sales} vendas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/un
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TopItems;
