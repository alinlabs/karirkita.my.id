import React from 'react';
import { SectionKelas } from './SectionKelas';
import { SectionMentor } from './SectionMentor';
import { SEO } from '../../komponen/umum/SEO';
import { Hero } from '../../komponen/umum/Hero';
import { siteConfig } from '../../config/site';

export const Container = () => {
    const seoData = siteConfig.pages.kelas;

    return (
        <>
            <SEO 
                title={seoData.title}
                description={seoData.description}
                image={seoData.image}
                keywords="kelas online, mentoring karir, kursus kerja, webinar karir, mentor profesional, pengembangan diri"
            />
            <main className="min-h-screen bg-slate-50 pb-10">
                <Hero pageKey="kelas" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="space-y-16">
                        <SectionMentor />
                        <SectionKelas />
                    </div>
                </div>
            </main>
        </>
    );
};
