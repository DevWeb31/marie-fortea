import * as React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  id?: string;
  required?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  disabled = false,
  minDate,
  maxDate,
  className,
  id,
  required = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
            !value && "text-gray-500 dark:text-gray-400",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: fr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl" 
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => {
            if (disabled) return true;
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          initialFocus
          className="rounded-md border-0"
        />
      </PopoverContent>
    </Popover>
  );
}

// Composant DatePicker pour les formulaires avec Input natif en fallback
interface FormDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
  id?: string;
  required?: boolean;
  label?: string;
}

export function FormDatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  disabled = false,
  minDate,
  maxDate,
  className,
  id,
  required = false,
  label,
}: FormDatePickerProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);

  React.useEffect(() => {
    // Détecter si on est sur mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      onChange(dateString);
    }
    setShowCalendar(false);
  };

  const selectedDate = value ? new Date(value) : undefined;

  // Sur mobile, utiliser l'input natif avec un bouton pour ouvrir le calendrier
  if (isMobile) {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label} {required && '*'}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={minDate}
            max={maxDate}
            disabled={disabled}
            required={required}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800",
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-600"
            onClick={() => setShowCalendar(true)}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Calendrier en modal pour mobile */}
        {showCalendar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-4 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sélectionner une date</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCalendar(false)}
                  className="bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  ×
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  if (disabled) return true;
                  if (minDate && date < new Date(minDate)) return true;
                  if (maxDate && date > new Date(maxDate)) return true;
                  return false;
                }}
                initialFocus
                className="rounded-md border-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sur desktop, utiliser le DatePicker avec popover
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label} {required && '*'}
        </label>
      )}
      <DatePicker
        value={selectedDate}
        onChange={handleDateSelect}
        placeholder={placeholder}
        disabled={disabled}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        className={className}
        id={id}
        required={required}
      />
    </div>
  );
}
