import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DatePickerProps {
  id?: string;
  name?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  name,
  value,
  onChange,
  disabled = false,
  ariaLabel,
  placeholder = 'YYYY-MM-DD',
  hasError = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view date from value or fallback to Oct 2026 (contest period)
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(2026, 9, 1); // Oct 2026
  });

  // Keep viewDate updated if value changes
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) setViewDate(parsed);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const startDayOfWeek = useMemo(() => {
    return new Date(year, month, 1).getDay(); // 0 = Sun
  }, [year, month]);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={handleDirectInput}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          maxLength={10}
          className={cn(
            'w-full min-h-[38px] text-xs font-mono rounded-lg py-2 pl-3 pr-9 border transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600',
            disabled
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : hasError
              ? 'border-rose-400 bg-rose-50/40 text-rose-900'
              : 'border-slate-300 bg-white text-slate-800'
          )}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            'absolute right-1.5 p-1.5 text-slate-400 hover:text-blue-600 rounded-md transition-colors active:scale-95',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          title="Open Calendar"
          aria-label="Toggle calendar popover"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>

      {/* In-Card Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Calendar date selector"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
          className="absolute right-0 sm:left-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-68 text-slate-800 animate-in fade-in-0 zoom-in-95 duration-100 motion-reduce:animate-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-800">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500 mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: startDayOfWeek }).map((_, idx) => (
              <span key={`empty-${idx}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const mm = String(month + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              const dateStr = `${year}-${mm}-${dd}`;
              const isSelected = value === dateStr;

              return (
                <button
                  key={day}
                  type="button"
                  aria-label={`${monthNames[month]} ${day}, ${year}`}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'h-7 w-7 sm:h-7.5 sm:w-7.5 mx-auto flex items-center justify-center rounded-md text-[11px] font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-rose-600 font-medium p-1 rounded transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('2026-10-20');
                setIsOpen(false);
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold p-1 rounded transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Deadline (Oct 20)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
