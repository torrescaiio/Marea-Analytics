import { Calendar, Filter, Users, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRangePicker } from "@/components/DateRangePicker";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { useFilters } from "@/contexts/FilterContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FilterPanel = () => {
  const { filterOptions, isLoading } = useFilterOptions();
  const { filters, updateFilters, clearFilters } = useFilters();

  const handleDateChange = (dateRange: any) => {
    updateFilters({ dateRange });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({
      selectedCategories: filters.selectedCategories.includes(category)
        ? filters.selectedCategories.filter(c => c !== category)
        : [...filters.selectedCategories, category]
    });
  };

  const handleWaiterChange = (waiter: string) => {
    updateFilters({ selectedWaiter: waiter });
  };

  const handlePdvChange = (pdv: string) => {
    updateFilters({ selectedPdv: pdv });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 text-ocean-600 mr-2" />
          Filtros de Análise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Período */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-ocean-600" />
              Período
            </label>
            <DateRangePicker onDateChange={handleDateChange} />
          </div>

          {/* Categorias */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Package className="h-4 w-4 mr-2 text-ocean-600" />
              Categorias
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white border-ocean-200"
                >
                  {filters.selectedCategories.length === 0 
                    ? "Todas" 
                    : `${filters.selectedCategories.length} selecionada(s)`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <ScrollArea className="h-72 pr-4">
                  <div className="space-y-2">
                    {!isLoading && filterOptions.categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <label
                          htmlFor={category}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Garçom */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Users className="h-4 w-4 mr-2 text-ocean-600" />
              Garçom
            </label>
            <Select value={filters.selectedWaiter} onValueChange={handleWaiterChange}>
              <SelectTrigger className="bg-white border-ocean-200">
                <SelectValue placeholder="Selecione um garçom" />
              </SelectTrigger>
              <SelectContent align="start">
                <ScrollArea className="h-72">
                  <SelectItem value="todos">Todos</SelectItem>
                  {!isLoading && filterOptions.waiters.map((waiter) => (
                    <SelectItem key={waiter} value={waiter}>
                      {waiter}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Ponto de Venda */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Store className="h-4 w-4 mr-2 text-ocean-600" />
              Ponto de Venda
            </label>
            <Select value={filters.selectedPdv} onValueChange={handlePdvChange}>
              <SelectTrigger className="bg-white border-ocean-200">
                <SelectValue placeholder="Selecione um PDV" />
              </SelectTrigger>
              <SelectContent align="start">
                <ScrollArea className="h-72">
                  <SelectItem value="todos">Todos</SelectItem>
                  {!isLoading && filterOptions.pdvs.map((pdv) => (
                    <SelectItem key={pdv} value={pdv}>
                      {pdv}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
