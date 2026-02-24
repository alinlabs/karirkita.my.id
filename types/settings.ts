
export type LanguageCode = 'id' | 'en' | 'ja' | 'ko';
export type CurrencyCode = 'IDR' | 'USD' | 'JPY' | 'KRW';

export interface Language {
  code: LanguageCode;
  name: string;
  flagCode: string; // ISO 3166-1 alpha-2 code for flagcdn
}

export interface Currency {
  code: CurrencyCode;
  name: string;
  flagCode: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'id', name: 'Indonesia', flagCode: 'id' },
  { code: 'en', name: 'English', flagCode: 'us' },
  { code: 'ja', name: '日本語', flagCode: 'jp' },
  { code: 'ko', name: '한국어', flagCode: 'kr' },
];

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'IDR', name: 'Rupiah', flagCode: 'id' },
  { code: 'USD', name: 'US Dollar', flagCode: 'us' },
  { code: 'JPY', name: 'Yen', flagCode: 'jp' },
  { code: 'KRW', name: 'Won', flagCode: 'kr' },
];
