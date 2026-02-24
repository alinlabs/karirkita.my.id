
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Option {
  value: string;
  label: string;
  image?: string;
}

interface ComboboxProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  name?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  allowCustomValue?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  className,
  inputClassName,
  name,
  icon,
  disabled,
  allowCustomValue = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal query with external value prop
  useEffect(() => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
      setQuery(selectedOption.label);
    } else if (value) {
      setQuery(value);
    } else {
      setQuery(""); 
    }
  }, [value, options]);

  // Calculate position and open dropdown
  const openDropdown = () => {
      if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setDropdownStyle({
              position: 'fixed',
              top: `${rect.bottom + 8}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              maxHeight: '300px',
              zIndex: 99999 // Always on top
          });
          setIsOpen(true);
      }
  };

  // Update position on scroll or resize to prevent detachment
  useEffect(() => {
      if (isOpen) {
          const handleScrollOrResize = (e: Event) => {
             // CRITICAL FIX: Only close if scroll happens OUTSIDE the dropdown
             // If the event target is inside the dropdownRef, allow scrolling
             if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
                 return;
             }

             // Otherwise (scrolling the main page), close it to prevent detachment
             setIsOpen(false);
             inputRef.current?.blur();
          };

          // Use 'true' for capture phase to catch scroll events
          window.addEventListener('scroll', handleScrollOrResize, true);
          window.addEventListener('resize', handleScrollOrResize);
          
          return () => {
              window.removeEventListener('scroll', handleScrollOrResize, true);
              window.removeEventListener('resize', handleScrollOrResize);
          };
      }
  }, [isOpen]);

  // Handle Click Outside (Modified for Portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside both Container AND Portal Dropdown
      if (
          containerRef.current && !containerRef.current.contains(target) &&
          dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        // Restore label if valid selection exists
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
          setQuery(selectedOption.label);
        } else if (!value) {
          setQuery("");
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options, isOpen]);

  // Filter options
  const filteredOptions = useMemo(() => {
    return query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );
  }, [query, options]);

  const handleInputFocus = () => {
    if (!disabled) {
        setQuery(""); 
        openDropdown();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (allowCustomValue) {
        onChange(newValue);
    }
    if (!isOpen) openDropdown();
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setQuery(optionLabel);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(""); 
      setQuery(""); 
      setIsOpen(false); 
      inputRef.current?.blur();
  };

  return (
    <div className={cn("w-full group relative", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Icon Left */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full h-12 rounded-xl border border-slate-200 bg-white/50 focus:bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 ease-out",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm hover:border-blue-300 font-medium truncate pr-10",
            icon && "pl-11",
            disabled && "opacity-60 cursor-not-allowed bg-slate-100",
            inputClassName
          )}
        />

        {/* Icons Right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {value && !disabled && (
                <button 
                    type="button"
                    onClick={handleClear}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-20"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
            <ChevronDown 
                className={cn(
                    "w-4 h-4 text-slate-400 transition-transform duration-300 pointer-events-none", 
                    isOpen && "rotate-180 text-blue-500"
                )} 
            />
        </div>

        {/* Portal Dropdown Options */}
        {isOpen && !disabled && createPortal(
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            className="fixed bg-white rounded-xl border border-slate-100 shadow-2xl overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-200 custom-scrollbar p-1.5"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center italic">
                Tidak ada opsi yang cocok.
              </div>
            ) : (
              <ul className="space-y-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onMouseDown={() => handleOptionClick(option.value, option.label)}
                    className={cn(
                      "cursor-pointer select-none relative flex items-center justify-between py-2.5 px-3.5 rounded-lg text-sm font-medium transition-colors",
                      option.value === value
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {option.image && (
                            <img src={option.image} alt="" className="w-6 h-6 object-contain rounded-md" />
                        )}
                        <span className="block truncate">{option.label}</span>
                    </div>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};
