
import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SUPPORTED_LANGUAGES, SUPPORTED_CURRENCIES, Language, Currency } from '../../types/settings';
import { ChevronDown, Globe, Coins } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TranslateProps {
  className?: string;
}

export const Translate: React.FC<TranslateProps> = ({ className }) => {
  const { language, setLanguage, currency, setCurrency } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const currentCurr = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "flex items-center gap-2 p-2 rounded-xl transition-colors border",
            className || "text-slate-700 hover:bg-slate-100 border-transparent hover:border-slate-200"
        )}
      >
        <div className="relative w-6 h-4 rounded overflow-hidden shadow-sm">
            <img 
                src={getFlagUrl(currentLang?.flagCode || 'id')} 
                alt="Flag" 
                className="w-full h-full object-cover"
            />
        </div>
        <span className="text-sm font-bold hidden sm:block">{currency}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900">
            
            {/* Language Section */}
            <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Bahasa / Language
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                // setIsOpen(false); // Optional: keep open to change currency too
                            }}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-xl text-sm font-medium transition-all",
                                language === lang.code 
                                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" 
                                    : "hover:bg-slate-50 text-slate-600"
                            )}
                        >
                            <img src={getFlagUrl(lang.flagCode)} alt={lang.name} className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 my-3"></div>

            {/* Currency Section */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Coins className="w-3 h-3" /> Mata Uang / Currency
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                        <button
                            key={curr.code}
                            onClick={() => {
                                setCurrency(curr.code);
                                // setIsOpen(false);
                            }}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-xl text-sm font-medium transition-all",
                                currency === curr.code
                                    ? "bg-green-50 text-green-700 ring-1 ring-green-200" 
                                    : "hover:bg-slate-50 text-slate-600"
                            )}
                        >
                            <span className="w-6 font-bold text-xs">{curr.code}</span>
                            {curr.name}
                        </button>
                    ))}
                </div>
            </div>

        </div>
      )}
    </div>
  );
};
