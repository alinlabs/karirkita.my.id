
import React, { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { SectionFiturUtama } from './SectionFiturUtama';
import { SectionStepCaraKerja } from './SectionStepCaraKerja';
import { SectionPerusahaanUnggulan } from './SectionPerusahaanUnggulan';
import { SectionDuniaKerja } from './SectionDuniaKerja';
import { SectionGroup } from './SectionGroup';
import { SectionPelamarTerbaru } from './SectionPelamarTerbaru';
import { SectionTestimoni } from './SectionTestimoni';
import { SectionCTA } from './SectionCTA';
import { SEO } from '../../komponen/umum/SEO';
import { routingData } from '../../services/routingData';
import { useData } from '../../context/DataContext';
import { useLoading } from '../../context/LoadingContext';
import { siteConfig } from '../../config/site';

export const Container = () => {
  const { refreshData } = useData();
  const { startLoading, stopLoading } = useLoading();
  const [isReady, setIsReady] = useState(false);
  // SEO Data from config
  const seoData = siteConfig.pages.beranda;

  useEffect(() => {
    const initPage = async () => {
      startLoading();
      
      try {
        await refreshData();
        // We still fetch page data for dynamic hero content if needed, 
        // but SEO is now static from config as requested.
        await routingData.getPageData(); 
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setIsReady(true);
        stopLoading();
      }
    };

    initPage();
  }, []);

  if (!isReady) return null;

  return (
    <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords="loker purwakarta, lowongan kerja purwakarta, loker bic, loker indotaisei, karirkita, jobstreet purwakarta, loker indonesia, cv builder, surat lamaran kerja"
        image={seoData.image}
      />
      <Hero />
      <SectionPerusahaanUnggulan />
      <SectionDuniaKerja />
      <SectionGroup />
      <SectionPelamarTerbaru />
      <SectionStepCaraKerja />
      <SectionFiturUtama />
      <SectionTestimoni />
      <SectionCTA />
    </div>
  );
};
