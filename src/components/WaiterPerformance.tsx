import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, ChevronDown, ChevronUp, Medal, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWaiterPerformance } from "@/hooks/useWaiterPerformance";
import { useWaiterPdvDetails } from "@/hooks/useWaiterPdvDetails";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "text-yellow-500"; // Ouro
    case 2:
      return "text-gray-400"; // Prata
    case 3:
      return "text-amber-700"; // Bronze
    default:
      return "";
  }
};

const WaiterPerformance = () => {
  const { waiterPerformance, isLoading } = useWaiterPerformance();
  const [expandedWaiter, setExpandedWaiter] = useState<string | null>(null);

  // Hook para buscar detalhes do PDV do garçom expandido
  const { data: pdvDetails, isLoading: isLoadingDetails } = useWaiterPdvDetails(expandedWaiter || '');

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-ocean-600 mr-2" />
            Performance dos Garçons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!waiterPerformance || waiterPerformance.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-ocean-600 mr-2" />
            Performance dos Garçons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sand-600">Nenhum dado disponível. Faça o upload de uma planilha para ver a performance dos garçons.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-ocean-600 mr-2" />
            Performance dos Garçons
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center text-sm text-sand-600 hover:text-ocean-600">
                  <Target className="h-4 w-4 mr-1" />
                  Meta Diária: R$ 2.000,00
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>A performance é calculada com base na meta diária de R$ 2.000,00.</p>
                <p>Exemplo: Se um garçom trabalhou 20 dias, sua meta total seria R$ 40.000,00.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {waiterPerformance.map((waiter) => (
            <div key={waiter.nome} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-ocean-gradient flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {waiter.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    {waiter.rank <= 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Medal className={`h-5 w-5 ${getMedalColor(waiter.rank)}`} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{waiter.nome}</p>
                    <p className="text-sm text-sand-600">{waiter.pedidos} pedidos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{waiter.vendas}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center justify-end">
                            <Star className="h-4 w-4 text-accent mr-1" />
                            <span className={`text-sm ${waiter.performance >= 100 ? 'text-green-600' : 'text-gray-600'}`}>
                              {waiter.performance}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Atingiu {waiter.performance}% da meta mensal</p>
                          <p className="text-xs text-gray-400 mt-1">Meta: R$ 2.000,00/dia</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => setExpandedWaiter(expandedWaiter === waiter.nome ? null : waiter.nome)}
                  >
                    {expandedWaiter === waiter.nome ? (
                      <ChevronUp className="h-5 w-5 text-ocean-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-ocean-600" />
                    )}
                  </Button>
                </div>
              </div>
              <Progress 
                value={waiter.performance} 
                className="h-2"
              />
              {/* PDV Details Section */}
              {expandedWaiter === waiter.nome && (
                <div className="mt-4 pl-13 space-y-3 bg-ocean-50/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-ocean-700 mb-2">Vendas por PDV</h4>
                  {isLoadingDetails ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-ocean-100 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pdvDetails?.map((pdv) => (
                        <div key={pdv.pdv} className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">{pdv.pdv}</span>
                            <span className="text-sand-600">({pdv.quantidadePedidos} pedidos)</span>
                          </div>
                          <span className="font-semibold text-ocean-600">{pdv.totalVendas}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaiterPerformance;
