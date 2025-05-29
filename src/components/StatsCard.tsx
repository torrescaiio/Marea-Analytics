import { Card } from "@/components/ui/card";
import { useStats } from "@/hooks/useStats";
import { formatCurrency } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  type: "currency" | "number";
  metric: "totalSales" | "totalOrders" | "averageTicket" | "activeWaiters";
}

export const StatsCard = ({ title, type, metric }: StatsCardProps) => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 h-7 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  const value = stats?.[metric] ?? 0;
  const formattedValue = type === "currency" ? formatCurrency(value) : value;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{formattedValue}</p>
        </div>
      </div>
    </Card>
  );
};
