import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../komponen/umum/SEO';
import { Hero } from '../../komponen/umum/Hero';

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  heroPageKey?: string;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  icon,
  children,
  seoTitle,
  seoDescription,
  heroPageKey,
}) => {
  return (
    <div className={`min-h-screen bg-slate-50 ${heroPageKey ? 'pb-12 md:pb-20' : 'pt-20 pb-12 md:pt-24 md:pb-20'} font-sans`}>
      <SEO 
        title={seoTitle || title} 
        description={seoDescription || subtitle || `Halaman ${title} KarirKita`} 
      />
      
      {heroPageKey && <Hero pageKey={heroPageKey} />}

      <div className={`container mx-auto px-4 max-w-4xl ${heroPageKey ? '-mt-10 md:-mt-20 relative z-10' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-12 shadow-sm border border-slate-100"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6 md:mb-10 border-b border-slate-100 pb-6 md:pb-8">
            {icon && (
              <div className="p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl text-blue-600 w-fit shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1 md:mb-2 tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm md:text-lg text-slate-500 mb-2">{subtitle}</p>}
              {lastUpdated && (
                <p className="text-xs md:text-sm text-slate-400 font-medium bg-slate-50 inline-block px-2 md:px-3 py-1 rounded-full">
                  Terakhir diperbarui: {lastUpdated}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="prose prose-sm md:prose-lg max-w-none text-slate-600 leading-relaxed headings:font-bold headings:text-slate-900">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
