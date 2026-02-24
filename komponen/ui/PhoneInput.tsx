
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatPhoneNumber, isValidPhoneNumber } from '../../utils/validators';

const COUNTRY_CODES = [
  { code: 'ID', dial: '62', name: 'Indonesia' },
  { code: 'US', dial: '1', name: 'United States' },
  { code: 'MY', dial: '60', name: 'Malaysia' },
  { code: 'SG', dial: '65', name: 'Singapore' },
  { code: 'JP', dial: '81', name: 'Japan' },
  { code: 'KR', dial: '82', name: 'South Korea' },
  { code: 'AU', dial: '61', name: 'Australia' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ 
  label, 
  value, 
  onChange, 
  error: externalError,
  className,
  ...props 
}) => {
  const [country, setCountry] = useState(COUNTRY_CODES[0]);
  const [localValue, setLocalValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value to determine country and local number
  useEffect(() => {
      if (!value) {
          setLocalValue('');
          return;
      }

      // Clean non-digits first
      const cleanValue = value.replace(/\D/g, '');
      
      // Try to match country code
      const foundCountry = COUNTRY_CODES.find(c => cleanValue.startsWith(c.dial));
      
      if (foundCountry) {
          setCountry(foundCountry);
          // Remove country code from display value
          const local = cleanValue.slice(foundCountry.dial.length);
          // Format local part
          setLocalValue(formatPhoneNumber(local));
      } else {
          // If no match (or just local number provided), keep as is or default to ID
          // If it starts with 0, it's likely local ID number
          if (cleanValue.startsWith('0')) {
              setCountry(COUNTRY_CODES[0]); // ID
              setLocalValue(formatPhoneNumber(cleanValue.substring(1))); // Remove leading 0
          } else {
              setLocalValue(formatPhoneNumber(cleanValue));
          }
      }
  }, [value]);

  // Toggle Dropdown with Portal positioning
  const toggleDropdown = () => {
      if (!isDropdownOpen && buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setDropdownStyle({
              position: 'fixed',
              top: `${rect.bottom + 8}px`,
              left: `${rect.left}px`,
              minWidth: '280px',
              maxHeight: '300px',
              zIndex: 99999
          });
      }
      setIsDropdownOpen(!isDropdownOpen);
  };

  // Close on Scroll/Resize
  useEffect(() => {
      if (isDropdownOpen) {
          const close = () => setIsDropdownOpen(false);
          window.addEventListener('scroll', close, true);
          window.addEventListener('resize', close);
          return () => {
              window.removeEventListener('scroll', close, true);
              window.removeEventListener('resize', close);
          };
      }
  }, [isDropdownOpen]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
          buttonRef.current && !buttonRef.current.contains(target) &&
          dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Format local part for display: 812-3456-7891
    const formatted = formatPhoneNumber(rawVal);
    setLocalValue(formatted);
    
    // Validate
    const rawDigits = formatted.replace(/\D/g, '');
    if (rawDigits.length > 5 && !isValidPhoneNumber(rawDigits)) {
        setInternalError("Nomor telepon tidak wajar (pola berulang/seri).");
    } else {
        setInternalError(null);
    }

    // Return FULL number to parent: CountryCode + LocalDigits
    // e.g. 62 + 8123456789 = 628123456789
    const fullNumber = `${country.dial}${rawDigits}`;
    onChange(fullNumber);
  };

  const handleCountryChange = (c: typeof COUNTRY_CODES[0]) => {
      setCountry(c);
      setIsDropdownOpen(false);
      
      // Update parent with new country code + existing local number
      const rawDigits = localValue.replace(/\D/g, '');
      const fullNumber = `${c.dial}${rawDigits}`;
      onChange(fullNumber);
  };

  // Display error priority: Internal validation > External prop error
  const displayError = internalError || externalError;

  return (
    <div className={cn("w-full group", className)} ref={containerRef}>
        {label && (
            <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
                {label}
            </label>
        )}
        <div className="flex gap-2 relative z-20">
            {/* Country Selector Button */}
            <button
                ref={buttonRef}
                type="button"
                className="flex items-center gap-2 h-12 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-w-[110px] justify-between"
                onClick={toggleDropdown}
            >
                <div className="flex items-center gap-2">
                    <img 
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} 
                        alt={country.code} 
                        className="w-6 h-4 object-cover rounded-sm border border-slate-100 shadow-sm"
                    />
                    <span className="text-sm font-bold text-slate-700">+{country.dial}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {/* Portal Dropdown */}
            {isDropdownOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    style={dropdownStyle}
                    className="fixed bg-white border border-slate-100 rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar p-1.5"
                >
                    <div className="py-1">
                        {COUNTRY_CODES.map((c) => (
                            <button
                                key={c.code}
                                type="button"
                                className={cn(
                                    "flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 text-left transition-colors rounded-lg",
                                    country.code === c.code ? "bg-blue-50" : ""
                                )}
                                onClick={() => handleCountryChange(c)}
                            >
                                <img 
                                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`} 
                                    alt={c.code} 
                                    className="w-6 h-4 object-cover rounded-sm border border-slate-100 shrink-0 shadow-sm"
                                />
                                <span className="text-sm text-slate-700 flex-1 truncate font-medium">{c.name}</span>
                                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">+{c.dial}</span>
                                {country.code === c.code && <Check className="w-4 h-4 text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}

            {/* Input Field */}
            <input 
                type="tel" 
                value={localValue}
                maxLength={16}
                onChange={handlePhoneChange}
                className={cn(
                    "flex-1 w-full h-12 rounded-xl border bg-white/50 focus:bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 ease-out font-medium",
                    displayError 
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"
                )}
                placeholder="812-3456-7891" 
                {...props}
            />
        </div>
        {displayError && (
            <p className="mt-1.5 text-xs font-medium text-red-500 animate-in slide-in-from-top-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {displayError}
            </p>
        )}
    </div>
  );
};
