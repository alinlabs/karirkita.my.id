
import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className, label, error, icon, ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
          {label}
        </label>
      )}
      <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-0.5">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full h-12 rounded-xl border border-slate-200 bg-white/50 focus:bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 ease-out",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm hover:border-blue-300",
            icon && "pl-11",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            "disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};
