import React from 'react';
import { SectionPromosi } from './SectionPromosi';
import { SEO } from '../../komponen/umum/SEO';
import { Hero } from '../../komponen/umum/Hero';

export const PenawaranContainer = () => {
    return (
        <>
            <SEO 
                title="Promosi Lowongan Kerja - KarirKita"
                description="Tingkatkan visibilitas lowongan kerja Anda dengan paket promosi premium kami. Jangkau ribuan kandidat potensial melalui fitur unggulan dan broadcast grup."
                keywords="promosi lowongan, iklan lowongan kerja, pasang loker premium, broadcast loker"
            />
            <main className="min-h-screen bg-slate-50 pb-10">
                <Hero pageKey="promosi" />
                <SectionPromosi />
            </main>
        </>
    );
};
