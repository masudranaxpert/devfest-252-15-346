import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  pageCount?: number;
  isDuplicate?: boolean;
  disabled?: boolean;
  isMatched?: boolean;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = '-- Select uploaded file --',
  disabled = false,
  ariaLabel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = useCallback((val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Hidden input for form standard compatibility */}
      <input type="hidden" id={id} name={name} value={value} />

      {/* Select Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full min-h-[38px] flex items-center justify-between text-left text-xs bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-800 transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 active:scale-[0.99]',
          disabled && 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed active:scale-100',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20'
        )}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption ? (
            <>
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate font-medium text-slate-800">
                {selectedOption.label}
              </span>
              {selectedOption.pageCount !== undefined && (
                <span className="shrink-0 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {selectedOption.pageCount}p
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150',
            isOpen && 'rotate-180 text-blue-600'
          )}
        />
      </button>

      {/* Dropdown Menu - Aligned 100% within card container bounds */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in-0 zoom-in-95 duration-100 motion-reduce:animate-none"
        >
          {/* Default unselect / placeholder option */}
          <button
            type="button"
            role="option"
            aria-selected={value === ''}
            onClick={() => handleSelect('')}
            className={cn(
              'w-full min-h-[36px] text-left px-3 py-2 text-xs flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:bg-slate-100',
              value === '' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <span>{placeholder}</span>
            {value === '' && <Check className="w-3.5 h-3.5 text-blue-600" />}
          </button>

          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                className={cn(
                  'w-full min-h-[36px] text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors focus-visible:outline-none focus-visible:bg-slate-100 active:bg-slate-100',
                  isSelected && 'bg-blue-50 text-blue-800 font-medium',
                  !isSelected && !opt.disabled && 'text-slate-800 hover:bg-slate-50',
                  opt.disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                )}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="truncate">{opt.label}</span>
                  {opt.pageCount !== undefined && (
                    <span className="shrink-0 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {opt.pageCount}p
                    </span>
                  )}
                  {opt.isDuplicate && (
                    <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Duplicate
                    </span>
                  )}
                  {opt.isMatched && !isSelected && (
                    <span className="shrink-0 text-[10px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded">
                      Matched
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
