
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, CurrencyCode, SUPPORTED_LANGUAGES } from '../types/settings';
import { routingData } from '../services/routingData';

interface SettingsContextType {
  language: LanguageCode;
  currency: CurrencyCode;
  setLanguage: (lang: LanguageCode) => void;
  setCurrency: (curr: CurrencyCode) => void;
  exchangeRates: Record<string, number>;
  convertPrice: (amountInIDR: number) => number;
  formatPrice: (amountInIDR: number) => string;
  formatCurrencyString: (text: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('id');
  const [currency, setCurrency] = useState<CurrencyCode>('IDR');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    // Subdomain Language Detection
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === subdomain);

    if (supportedLang) {
      setLanguage(supportedLang.code as LanguageCode);
    }

    // Fetch rates via routingData
    routingData.getExchangeRates().then(rates => {
      setExchangeRates(rates);
    });
  }, []);

  const convertPrice = (amountInIDR: number): number => {
    if (currency === 'IDR') return amountInIDR;
    const rate = exchangeRates[currency];
    if (!rate) return amountInIDR;
    return amountInIDR * rate;
  };

  const formatPrice = (amountInIDR: number): string => {
    if (!amountInIDR && amountInIDR !== 0) return '';
    
    const numericAmount = typeof amountInIDR === 'string' 
      ? parseInt((amountInIDR as string).replace(/[^0-9]/g, '')) 
      : amountInIDR;

    if (isNaN(numericAmount)) return String(amountInIDR);

    const converted = convertPrice(numericAmount);
    const localeToUse = currency === 'IDR' ? 'id-ID' : 'en-US';

    return new Intl.NumberFormat(localeToUse, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'IDR' || currency === 'KRW' || currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'IDR' || currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    }).format(converted);
  };

  const formatCurrencyString = (text: string): string => {
    if (!text) return '';
    if (/^\d+$/.test(text)) {
        return formatPrice(parseInt(text));
    }
    const regex = /(\d{1,3}(?:\.\d{3})+(?:,\d+)?)/g;
    if (!text.match(regex)) return text; 

    return text.replace(regex, (match) => {
      const rawNumber = parseInt(match.replace(/\./g, ''));
      if (isNaN(rawNumber)) return match;
      return formatPrice(rawNumber);
    }).replace(/IDR/g, '').trim(); 
  };

  return (
    <SettingsContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      exchangeRates,
      convertPrice,
      formatPrice,
      formatCurrencyString
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
