import React from 'react';
import { DaftarPelamar } from './DaftarPelamar';
import { SEO } from '../../komponen/umum/SEO';
import { siteConfig } from '../../config/site';

export const Container = () => {
  const seoData = siteConfig.pages.pelamar;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords="cari karyawan purwakarta, database pelamar, talent pool purwakarta, rekrutmen staff, cv online"
        image={seoData.image}
      />
      <DaftarPelamar />
    </div>
  );
};
