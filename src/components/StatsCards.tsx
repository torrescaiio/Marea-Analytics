import { StatsCard } from "@/components/StatsCard";
import { useIsMobile } from "@/hooks/use-mobile";

const StatsCards = () => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatsCard
        title="Vendas Totais"
        type="currency"
        metric="totalSales"
      />
      <StatsCard
        title="Pedidos"
        type="number"
        metric="totalOrders"
      />
      <StatsCard
        title="Ticket Médio"
        type="currency"
        metric="averageTicket"
      />
      <StatsCard
        title="Garçons Ativos"
        type="number"
        metric="activeWaiters"
      />
    </div>
  );
};

export default StatsCards;
