import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilters } from "@/contexts/FilterContext";

interface DateRangePickerProps {
  className?: string;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({ className, onDateChange }: DateRangePickerProps) {
  const { filters } = useFilters();
  const [date, setDate] = React.useState<DateRange | undefined>(filters.dateRange);
  const [clickCount, setClickCount] = React.useState(0);

  // Sincronizar com o estado global dos filtros
  React.useEffect(() => {
    setDate(filters.dateRange);
    setClickCount(0);
  }, [filters.dateRange]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!newDate?.from) {
      setClickCount(0);
      setDate(undefined);
      onDateChange?.(undefined);
      return;
    }

    if (!newDate.to) {
      setClickCount(prev => prev + 1);
      if (clickCount >= 2) {
        setClickCount(0);
        setDate(undefined);
        onDateChange?.(undefined);
        return;
      }
    }

    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white hover:bg-gray-50",
              !date && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={ptBR}
            className="bg-white"
            classNames={{
              day_selected: "bg-ocean-600 text-white hover:bg-ocean-700",
              day_today: "bg-ocean-50 text-ocean-600",
              day_range_middle: "bg-ocean-50",
              day_range_end: "bg-ocean-600 text-white hover:bg-ocean-700",
              day_range_start: "bg-ocean-600 text-white hover:bg-ocean-700"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
