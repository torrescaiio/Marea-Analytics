import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

export interface FilterState {
  dateRange?: DateRange;
  selectedCategories: string[];
  selectedWaiter: string;
  selectedPdv: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedWaiter: 'todos',
    selectedPdv: 'todos'
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCategories: [],
      selectedWaiter: 'todos',
      selectedPdv: 'todos',
      dateRange: undefined
    });
  };

  const hasActiveFilters = 
    filters.selectedCategories.length > 0 || 
    filters.selectedWaiter !== 'todos' || 
    filters.selectedPdv !== 'todos' ||
    filters.dateRange !== undefined;

  return (
    <FilterContext.Provider value={{
      filters,
      updateFilters,
      clearFilters,
      hasActiveFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};
