import { StatsCard } from "@/components/StatsCard";

const StatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
