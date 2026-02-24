
import React, { useState } from 'react';
import { Input } from './Input';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUrlInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onClear?: () => void;
}

export const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ label, value, onChange, onClear, className, placeholder, ...props }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full">
        {label && (
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        )}
        <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
                <Input 
                    value={value}
                    onChange={(e) => {
                        setHasError(false);
                        if(onChange) onChange(e);
                    }}
                    placeholder={placeholder || "https://..."}
                    className={className}
                    icon={<ImageIcon className="w-4 h-4" />}
                    {...props}
                />
            </div>
            
            {/* Preview Box */}
            <div className="w-12 h-12 shrink-0 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-sm group">
                {value && !hasError ? (
                    <img 
                        src={value as string} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                )}
                
                {value && onClear && (
                    <button 
                        type="button"
                        onClick={onClear}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};
