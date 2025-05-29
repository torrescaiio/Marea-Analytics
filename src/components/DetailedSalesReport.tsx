import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useDetailedReports } from "@/hooks/useDetailedReports";

type ReportType = 'by-item' | 'by-category' | 'by-growth' | 'by-waiter-performance';

const DetailedSalesReport = () => {
  const [reportType, setReportType] = useState<ReportType>('by-item');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useDetailedReports(reportType);

  useEffect(() => {
    setExpandedCategory(null);
  }, [reportType]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm p-6">
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm p-6">
        <div className="flex flex-col items-center justify-center h-96 text-red-600">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-center max-w-md">
            {error.message || 'Ocorreu um erro ao buscar os dados do relatório. Por favor, tente novamente.'}
          </p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm p-6">
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <Package className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
          <p className="text-sm text-center max-w-md">
            Não foram encontrados dados para o período selecionado. 
            Tente ajustar os filtros ou selecionar outro tipo de relatório.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Relatório Detalhado</h2>
        <Select 
          value={reportType} 
          onValueChange={(value: ReportType) => setReportType(value)}
        >
          <SelectTrigger className="w-[240px] bg-white border-gray-200 focus:ring-ocean-600 focus:border-ocean-600">
            <SelectValue placeholder="Selecione o tipo de relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="by-item">Por Item (Ranking de Vendas)</SelectItem>
            <SelectItem value="by-category">Por Categoria</SelectItem>
            <SelectItem value="by-growth">Crescimento de Itens (vs. Mês Anterior)</SelectItem>
            <SelectItem value="by-waiter-performance">Desempenho de Garçom (vs. Mês Anterior)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm p-6">
        {reportType === 'by-item' && (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {data.map((item: any) => (
              <motion.div
                key={item.nome}
                variants={item}
                className="p-4 rounded-lg bg-gradient-to-r from-ocean-50 to-white border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.nome}</h3>
                    <p className="text-sm text-gray-600">{item.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.quantidade} unidades • {item.vendas} vendas
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {reportType === 'by-category' && (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {data.map((category: any) => (
              <motion.div
                key={category.nome}
                variants={item}
                className="rounded-lg bg-gradient-to-r from-ocean-50 to-white border border-gray-200 overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setExpandedCategory(expandedCategory === category.nome ? null : category.nome)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {expandedCategory === category.nome ? (
                        <ChevronUp className="h-4 w-4 text-ocean-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-ocean-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.nome}</h3>
                        <p className="text-sm text-gray-600">{category.totalItens} itens diferentes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {category.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-600">{category.quantidade} unidades</p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo expandido */}
                {expandedCategory === category.nome && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 bg-white/50">
                      <div className="space-y-3">
                        {category.items?.map((item: any) => (
                          <div key={item.nome} className="flex justify-between items-center py-2 px-4 rounded-lg hover:bg-white/80">
                            <div>
                              <p className="font-medium text-gray-900">{item.nome}</p>
                              <p className="text-sm text-gray-600">{item.quantidade} unidades vendidas</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-sm text-gray-600">{item.vendas} vendas</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {reportType === 'by-growth' && (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {data.map((item: any) => (
              <motion.div
                key={item.nome}
                variants={item}
                className="p-4 rounded-lg bg-gradient-to-r from-ocean-50 to-white border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.nome}</h3>
                    <p className="text-sm text-gray-600">{item.categoria}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-600">Crescimento em Valor:</span>
                      <span className={`font-semibold ${item.crescimentoValor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.crescimentoValor.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-600">Crescimento em Quantidade:</span>
                      <span className={`font-semibold ${item.crescimentoQuantidade >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.crescimentoQuantidade.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      <p>Atual: R$ {item.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {item.quantidadeAtual} un.</p>
                      <p>Anterior: R$ {item.valorAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {item.quantidadeAnterior} un.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {reportType === 'by-waiter-performance' && (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {data.map((waiter: any) => (
              <motion.div
                key={waiter.nome}
                variants={item}
                className="p-4 rounded-lg bg-gradient-to-r from-ocean-50 to-white border border-gray-200"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{waiter.nome}</h3>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {waiter.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {waiter.vendasAtual} vendas • {waiter.itensVendidosAtual} itens
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Crescimento em Vendas</p>
                      <p className={`font-semibold ${waiter.crescimentoVendas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {waiter.crescimentoVendas.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {waiter.vendasAnterior} → {waiter.vendasAtual}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Crescimento em Valor</p>
                      <p className={`font-semibold ${waiter.crescimentoValor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {waiter.crescimentoValor.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        R$ {waiter.valorAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → 
                        R$ {waiter.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Crescimento Ticket Médio</p>
                      <p className={`font-semibold ${waiter.crescimentoTicket >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {waiter.crescimentoTicket.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        R$ {waiter.ticketMedioAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → 
                        R$ {waiter.ticketMedioAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default DetailedSalesReport;
