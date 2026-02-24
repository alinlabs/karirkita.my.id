import React, { useEffect, useState } from 'react';
import { routingData } from '../../services/routingData';

interface HeroProps {
    pageKey: string;
}

export const Hero: React.FC<HeroProps> = ({ pageKey }) => {
    const [heroData, setHeroData] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        routingData.getPageData().then(data => {
            if (data && data[pageKey]) {
                setHeroData(data[pageKey]);
            }
        });
    }, [pageKey]);

    if (!heroData) return null;

    const content = isMobile ? heroData.mobile : heroData.desktop;
    const heroImage = content.hero;

    // If hero is a lottie file or empty, we might handle it differently or return null
    // But per request, we assume it's an image link for these pages
    if (!heroImage || heroImage.endsWith('.lottie')) {
        return null; // Or handle lottie if needed, but user said "kecuali lottie" implying we focus on image heroes here
    }

    return (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-8 rounded-b-[2rem] md:rounded-b-[3rem] shadow-lg">
            <div className="absolute inset-0 bg-slate-900/50 z-10" />
            <img 
                src={heroImage} 
                alt={content.judul} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    {content.judul}
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium drop-shadow-md">
                    {content.deskripsi}
                </p>
            </div>
        </div>
    );
};
