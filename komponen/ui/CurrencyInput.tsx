
import React from 'react';
import { Input } from './Input';
import { cn } from '../../utils/cn';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  className, 
  ...props 
}) => {
  
  // Format number to 1.000.000
  const formatNumber = (val: string) => {
    if (!val) return '';
    return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    onChange(rawValue);
  };

  // Display value with formatting
  const displayValue = formatNumber(String(value));

  return (
    <div className="relative group">
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        className={cn("pl-16 font-mono font-medium tracking-wide", className)}
        placeholder="0"
      />
      {/* IDR Badge inside Input */}
      <div className="absolute left-4 top-[calc(50%+2px)] -translate-y-1/2 md:top-[calc(50%+14px)] md:-translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 pointer-events-none group-focus-within:border-blue-200 group-focus-within:bg-blue-50 group-focus-within:text-blue-600 transition-all">
        IDR
      </div>
    </div>
  );
};
