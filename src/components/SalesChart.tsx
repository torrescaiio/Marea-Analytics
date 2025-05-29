import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMonthlySales } from "@/hooks/useMonthlySales";
import { motion } from "framer-motion";

const SalesChart = () => {
  const { monthlySales, isLoading } = useMonthlySales();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Vendas Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          Vendas Mensais
          <motion.div 
            className="ml-auto flex items-center space-x-4 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-3 h-3 bg-ocean-500 rounded-full mr-2"></div>
              Vendas
            </motion.div>
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              Metas
            </motion.div>
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="h-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="mes" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value) => [`R$ ${value.toLocaleString()}`, ""]}
                animationDuration={300}
              />
              <Bar 
                dataKey="vendas" 
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                name="Vendas"
                animationDuration={1000}
                animationBegin={0}
              />
              <Bar 
                dataKey="metas" 
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                name="Metas"
                animationDuration={1000}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
