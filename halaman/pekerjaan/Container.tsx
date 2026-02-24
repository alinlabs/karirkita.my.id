import React, { useEffect } from 'react';
import { PencarianKerja } from './PencarianKerja';
import { SEO } from '../../komponen/umum/SEO';
import { useData } from '../../context/DataContext';
import { siteConfig } from '../../config/site';

export const Container = () => {
  const { refreshData } = useData();
  const seoData = siteConfig.pages.pekerjaan;

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords="cari kerja purwakarta, loker pabrik purwakarta, lowongan administrasi purwakarta, loker operator produksi, cv builder"
        image={seoData.image}
      />
      <PencarianKerja />
    </div>
  );
};
