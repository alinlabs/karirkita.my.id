import React, { useEffect } from 'react';
import { DaftarPerusahaan } from './DaftarPerusahaan';
import { SEO } from '../../komponen/umum/SEO';
import { useData } from '../../context/DataContext';
import { siteConfig } from '../../config/site';

export const Container = () => {
  const { refreshData } = useData();
  const seoData = siteConfig.pages.perusahaan;

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords="daftar perusahaan purwakarta, pt di bic, kawasan industri indotaisei, profil perusahaan, lowongan kerja pabrik"
        image={seoData.image}
      />
      <DaftarPerusahaan />
    </div>
  );
};
