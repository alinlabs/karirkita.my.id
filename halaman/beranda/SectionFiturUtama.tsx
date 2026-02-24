
import React, { useState, useRef, useEffect } from 'react';
import { Rocket, Users, Building2, LucideIcon } from 'lucide-react';
import { Card } from '../../komponen/ui/Card';
import { cn } from '../../utils/cn';
import { Text } from '../../komponen/ui/Text';
import { FeatureItem } from '../../types';

export const SectionFiturUtama = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hardcoded features with all blue colors as requested
  const features: FeatureItem[] = [
    {
      judul: "Pencarian Cepat",
      deskripsi: "Algoritma cerdas untuk menemukan pekerjaan yang sesuai keahlian Anda di seluruh Indonesia.",
      warna: "bg-blue-100 text-blue-600",
      warnaHover: "group-hover:bg-blue-600 group-hover:text-white"
    },
    {
      judul: "Profil Profesional",
      deskripsi: "Buat profil profesional berstandar internasional layaknya situs web pribadi yang menawan.",
      warna: "bg-blue-100 text-blue-600",
      warnaHover: "group-hover:bg-blue-600 group-hover:text-white"
    },
    {
      judul: "Koneksi Langsung",
      deskripsi: "Terhubung langsung dengan HRD dari perusahaan terkemuka nasional dan multinasional.",
      warna: "bg-blue-100 text-blue-600",
      warnaHover: "group-hover:bg-blue-600 group-hover:text-white"
    }
  ];

  const ICONS: LucideIcon[] = [Rocket, Users, Building2];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4"><Text>Kenapa Memilih KarirKita?</Text></h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            <Text>Platform kami didesain khusus untuk Talenta Indonesia guna memaksimalkan potensi karir dengan fitur-fitur modern berkelas dunia.</Text>
          </p>
        </div>
        
        {/* Mobile: Full Width Slider with Edge Snapping */}
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex md:grid md:grid-cols-3 md:gap-8 overflow-x-auto md:overflow-visible pb-6 md:pb-0 -mx-4 px-4 md:mx-0 snap-x snap-mandatory md:snap-none no-scrollbar"
        >
          {features.map((feature, idx) => {
            const Icon = ICONS[idx] || Rocket; // Default fallback
            return (
              <div key={idx} className="w-full sm:w-[300px] md:w-auto flex-shrink-0 snap-center mr-4 md:mr-0 last:mr-4 md:last:mr-0 pr-4 md:pr-0">
                <Card className="group h-full p-6 md:p-8 text-center border border-slate-100 shadow-sm bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center relative overflow-hidden rounded-3xl">
                  
                  {/* Decorative Background Blob on Hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                  <div className="relative z-10">
                      {/* Icon Container */}
                      <div className={cn(
                          "w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg",
                          feature.warna,
                          feature.warnaHover
                      )}>
                        <Icon className="w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:rotate-6" />
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                          <Text>{feature.judul}</Text>
                      </h3>
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed group-hover:text-slate-600">
                          <Text>{feature.deskripsi}</Text>
                      </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* Mobile Indicator */}
        <div className="flex justify-center gap-2 md:hidden mt-4">
           {features.map((_, idx) => (
               <button
                   key={idx}
                   onClick={() => scrollToSlide(idx)}
                   className={cn(
                       "h-1.5 rounded-full transition-all duration-300",
                       activeIndex === idx ? "w-4 bg-blue-600" : "w-1.5 bg-slate-200"
                   )}
                   aria-label={`Go to slide ${idx + 1}`}
               />
           ))}
        </div>
      </div>
    </section>
  );
};
