
import { useState } from "react";
import { ArrowLeft, FileText, Download, Calendar, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import { useSalesData } from "@/hooks/useSalesData";
import Header from "@/components/Header";

const Reports = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const { data: salesData, isLoading } = useSalesData();
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = () => {
    setReportGenerated(true);
  };

  const downloadReport = () => {
    console.log("Baixando relatório...");
  };

  // Filtrar dados baseado nos filtros selecionados
  const filteredData = salesData?.filter(item => {
    let matchesFilters = true;

    // Filtro por categoria
    if (filters.selectedCategory !== 'todas') {
      const itemCategory = item.grupo || item.grupo_fixo;
      matchesFilters = matchesFilters && itemCategory === filters.selectedCategory;
    }

    // Filtro por garçom
    if (filters.selectedWaiter !== 'todos') {
      matchesFilters = matchesFilters && item.atendente === filters.selectedWaiter;
    }

    // Filtro por data
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const itemDate = new Date(item.data_fiscal);
      matchesFilters = matchesFilters && 
        itemDate >= filters.dateRange.from && 
        itemDate <= filters.dateRange.to;
    }

    return matchesFilters;
  }) || [];

  // Calcular estatísticas do relatório
  const reportStats = {
    totalVendas: filteredData.reduce((sum, item) => sum + Number(item.valor_total || 0), 0),
    totalItens: filteredData.length,
    ticketMedio: filteredData.length > 0 ? 
      filteredData.reduce((sum, item) => sum + Number(item.valor_total || 0), 0) / filteredData.length : 0,
    garçonsUnicos: new Set(filteredData.map(item => item.atendente).filter(Boolean)).size
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">Carregando relatório...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sand-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="bg-white border-ocean-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios Personalizados</h1>
              <p className="text-sand-700">Análise detalhada baseada nos filtros selecionados</p>
            </div>
          </div>
          
          {reportGenerated && (
            <Button 
              onClick={downloadReport}
              className="bg-ocean-gradient text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
          )}
        </div>

        {/* Filtros Aplicados */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 text-ocean-600 mr-2" />
              Filtros Aplicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-ocean-600" />
                <span className="text-sm">
                  <strong>Período:</strong> {
                    filters.dateRange?.from && filters.dateRange?.to
                      ? `${filters.dateRange.from.toLocaleDateString('pt-BR')} - ${filters.dateRange.to.toLocaleDateString('pt-BR')}`
                      : 'Todo o período'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-ocean-600" />
                <span className="text-sm">
                  <strong>Categoria:</strong> {filters.selectedCategory === 'todas' ? 'Todas' : filters.selectedCategory}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-ocean-600" />
                <span className="text-sm">
                  <strong>Garçom:</strong> {filters.selectedWaiter === 'todos' ? 'Todos' : filters.selectedWaiter}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Relatório */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-sand-700 mb-2">Total de Vendas</h3>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(reportStats.totalVendas)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-sand-700 mb-2">Total de Itens</h3>
              <p className="text-2xl font-bold text-gray-900">{reportStats.totalItens}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-sand-700 mb-2">Ticket Médio</h3>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(reportStats.ticketMedio)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-sand-700 mb-2">Garçons Únicos</h3>
              <p className="text-2xl font-bold text-gray-900">{reportStats.garçonsUnicos}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Relatório */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Detalhes das Vendas Filtradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <p className="text-center py-8 text-sand-600">
                Nenhum dado encontrado com os filtros aplicados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Data</th>
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Garçom</th>
                      <th className="text-left py-2">Categoria</th>
                      <th className="text-right py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 50).map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{new Date(item.data_fiscal).toLocaleDateString('pt-BR')}</td>
                        <td className="py-2">{item.nome_item}</td>
                        <td className="py-2">{item.atendente}</td>
                        <td className="py-2">{item.grupo || item.grupo_fixo}</td>
                        <td className="py-2 text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(Number(item.valor_total || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length > 50 && (
                  <p className="text-center py-4 text-sand-600">
                    Mostrando os primeiros 50 resultados de {filteredData.length} total.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {!reportGenerated && (
          <div className="text-center mt-8">
            <Button 
              onClick={generateReport}
              size="lg"
              className="bg-ocean-gradient text-white"
            >
              <FileText className="h-5 w-5 mr-2" />
              Gerar Relatório Completo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
