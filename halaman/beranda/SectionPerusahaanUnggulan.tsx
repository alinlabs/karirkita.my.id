
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { Skeleton } from '../../komponen/ui/Skeleton';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { useData } from '../../context/DataContext';

export const SectionPerusahaanUnggulan = () => {
  const { companies: allCompanies, loading: companiesLoading } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Default placeholders
  const [brandImage, setBrandImage] = useState("https://placehold.co/400x600/1e293b/ffffff?text=Brand+Ambassador"); 
  const [mainBanner, setMainBanner] = useState("https://placehold.co/1200x240/1e293b/ffffff?text=Mitra+Perusahaan+Terpercaya");

  // --- LOGIC DATA DISPLAY ---
  // 1. Ambil yang promosi
  const promotedOnly = allCompanies.filter(c => c.promosi);
  // 2. Jika tidak ada promosi, ambil semua (limit 6 untuk beranda), jika ada pakai promosi
  const displayList = promotedOnly.length > 0 ? promotedOnly : allCompanies.slice(0, 6);

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

  useEffect(() => {
    const fetchIdentity = async () => {
        try {
            const data: any = await routingData.getIdentity();
            const ambassador = data.brandAmbassador || data.dutaMerek;
            const banners = data.banners || data.spanduk;

            if (ambassador) {
                setBrandImage(ambassador.companies || ambassador.perusahaan || "https://placehold.co/400x600/1e293b/ffffff?text=Brand+Ambassador");
            }
            if (banners) {
                setMainBanner(banners.companies || banners.perusahaan || "https://placehold.co/1200x240/1e293b/ffffff?text=Mitra+Perusahaan+Terpercaya");
            }
        } catch (err) {
            console.error("Failed to fetch brand ambassador/banner image", err);
        }
    };

    fetchIdentity();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-white border-y border-slate-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-8 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 md:mb-3">
              <BadgeCheck className="w-4 h-4" />
              <Text>Official Partners</Text>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">
              <Text>Top</Text> <span className="text-blue-600 underline decoration-wavy decoration-blue-300 underline-offset-4"><Text>Companies</Text></span>
            </h2>
            <p className="text-slate-600 max-w-xl text-sm md:text-lg">
              <Text>Bergabunglah dengan tim terbaik yang sedang membangun masa depan teknologi Indonesia.</Text>
            </p>
          </div>
          
          <div className="flex gap-2 items-center justify-center w-full md:w-auto">
             <Link to="/perusahaan">
                <Button variant="ghost" className="hidden md:flex rounded-full hover:bg-slate-100"><Text>Lihat Semua</Text> <ArrowRight className="ml-2 w-4 h-4" /></Button>
             </Link>
          </div>
        </div>

        {/* --- STATIC BANNER --- */}
        <div className="w-full aspect-[5/1] rounded-2xl md:rounded-3xl overflow-hidden mb-8 relative shadow-lg group">
            <img 
              src={mainBanner} 
              alt="Banner Perusahaan" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </div>

        {companiesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6">
             <Skeleton className="h-80 rounded-[2rem] lg:col-span-1 hidden lg:block" />
             {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-[2rem] lg:col-span-1" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
            {/* STATIC LEFT IMAGE (Desktop Only) */}
            <div className="lg:col-span-1 hidden lg:block relative h-full">
                <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-transparent">
                   <img 
                        src={brandImage}
                        alt="Brand Ambassador" 
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="lg:col-span-3 rounded-[2rem]">
                
                {/* MOBILE: Horizontal Scroll (2 items visible) */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-hide"
                >
                    {displayList.map((company, index) => (
                        <div key={`${company.perusahaan_id}-mob-${index}`} className="snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[300px]">
                            <CompanyCardItem company={company} index={index} width="100%" />
                        </div>
                    ))}
                </div>

                {/* Mobile Indicators */}
                <div className="flex justify-center gap-2 lg:hidden mb-6">
                    {displayList.map((_, idx) => (
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

                {/* DESKTOP: Grid */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-full">
                    {displayList.map((company, index) => (
                        <CompanyCardItem key={`${company.perusahaan_id}-desk-${index}`} company={company} index={index} width="100%" />
                    ))}
                </div>

            </div>
          </div>
        )}
        
        <div className="mt-8 md:hidden">
          <Link to="/perusahaan">
            <Button variant="outline" className="w-full h-12 rounded-xl text-slate-600"><Text>Lihat Semua Perusahaan</Text></Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Extracted Card Component for Reusability
const CompanyCardItem = ({ company, index, width }: any) => (
    <div 
        className="flex-shrink-0 h-full"
        style={{ width: width }}
    >
         <Link 
            to={`/perusahaan/${company.slug}`} 
            className="group block h-full"
         >
            <div className="relative h-full bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 flex flex-col">
                <div className="h-20 md:h-28 w-full relative overflow-hidden group-hover:h-24 md:group-hover:h-32 transition-all duration-500 shrink-0">
                    <img 
                        src={company.banner_url || company.coverImage} 
                        alt={`${company.nama} office`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                        index % 2 === 0 ? 'from-blue-600/20 to-indigo-600/40' : 'from-purple-600/20 to-pink-600/40'
                    } transition-opacity duration-300`}></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="px-3 md:px-5 pb-3 md:pb-5 flex-1 flex flex-col relative text-center">
                    <div className="-mt-8 md:-mt-12 mb-3 md:mb-4 relative z-10 mx-auto">
                        <div className="w-16 h-16 md:w-24 md:h-24 p-1.5 bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                            <img 
                            src={company.logo_url} 
                            alt={company.nama} 
                            className="w-full h-full object-contain rounded-xl md:rounded-2xl pointer-events-none" 
                            />
                        </div>
                    </div>

                    <div className="mb-2 md:mb-3 flex-1">
                        <div className="flex items-center justify-center gap-2 mb-1 md:mb-1.5">
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 md:px-2 py-0.5 rounded-md truncate max-w-full">
                            <Text>{company.industri}</Text>
                        </span>
                        </div>
                        <h3 className="font-bold text-xs md:text-xl text-slate-900 leading-tight mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {company.nama}
                        </h3>
                        <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        <Text>{company.deskripsi}</Text>
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-center pt-2 md:pt-3 border-t border-slate-100 border-dashed shrink-0 text-center">
                        <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-semibold text-slate-500">
                            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="truncate max-w-[150px]">{company.lokasi || [company.kota, company.provinsi].filter(Boolean).join(', ') || 'Indonesia'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);
