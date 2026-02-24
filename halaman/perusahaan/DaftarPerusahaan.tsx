
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../komponen/ui/Button';
import { MapPin, Building2, Search, Loader2, Star, Filter, ChevronDown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { routingData } from '../../services/routingData';
import { cn } from '../../utils/cn';
import { City } from '../../types';
import { Text } from '../../komponen/ui/Text';
import { Skeleton } from '../../komponen/ui/Skeleton';

export const DaftarPerusahaan = () => {
  const { companies, loading: companiesLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  
  // Hero Content State
  const [heroContent, setHeroContent] = useState<{ title: string; description: string; image?: string } | null>(null);

  // --- Carousel State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragTranslate, setDragTranslate] = useState(0);
  const timeoutRef = useRef<any>(null);

  // --- FEATURED LOGIC ---
  const promotedCompanies = companies.filter(c => c.promosi);
  const displayFeatured = promotedCompanies.length > 0 ? promotedCompanies : companies;
  const shouldScroll = displayFeatured.length > itemsVisible;
  const carouselItems = shouldScroll ? [...displayFeatured, ...displayFeatured] : displayFeatured;

  useEffect(() => {
    // 1. Fetch Cities
    routingData.getCities()
      .then(data => {
        setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(err => console.error("Gagal memuat data kota:", err));

    // 2. Fetch Hero Content
    routingData.getPageData().then(data => {
        if (data && data.perusahaan) {
            const perusahaan = data.perusahaan;
            const isMobile = window.innerWidth < 768;
            const content = isMobile ? perusahaan.mobile : perusahaan.desktop;

            setHeroContent({
                title: content.judul || "Jelajahi Perusahaan Impian",
                description: content.deskripsi || "Temukan budaya kerja yang cocok dan peluang karir di perusahaan-perusahaan paling inovatif di Indonesia.",
                image: content.hero
            });
        } else {
            setHeroContent({
                title: "Jelajahi Perusahaan Impian",
                description: "Temukan budaya kerja yang cocok dan peluang karir di perusahaan-perusahaan paling inovatif di Indonesia."
            });
        }
    });
  }, []);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.industri.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if lokasi exists before calling toLowerCase
    const matchesLocation = locationFilter === '' || 
                            (c.lokasi && c.lokasi.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesLocation;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsVisible(3);
      else if (window.innerWidth >= 768) setItemsVisible(2);
      else setItemsVisible(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (!shouldScroll) return;

    resetTimeout();
    if (isTransitioning && !isDragging && displayFeatured.length > 0) {
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 4000);
    }
    return () => resetTimeout();
  }, [currentIndex, isTransitioning, isDragging, displayFeatured.length, shouldScroll]);

  useEffect(() => {
    if (!shouldScroll) return;

    if (displayFeatured.length > 0 && currentIndex === displayFeatured.length) {
        const timeout = setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(0);
        }, 500);
        return () => clearTimeout(timeout);
    }
  }, [currentIndex, displayFeatured.length, shouldScroll]);

  useEffect(() => {
    if (!shouldScroll) return;

    if (!isTransitioning) {
        const timeout = setTimeout(() => {
            setIsTransitioning(true);
        }, 50);
        return () => clearTimeout(timeout);
    }
  }, [isTransitioning, shouldScroll]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!shouldScroll) return;
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
    resetTimeout();
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !shouldScroll) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;
    setDragTranslate(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging || !shouldScroll) return;
    setIsDragging(false);
    setIsTransitioning(true);
    
    if (dragTranslate < -50) {
        setCurrentIndex((prev) => prev + 1);
    } else if (dragTranslate > 50) {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    }
    setDragTranslate(0);
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      {/* 1. Hero Section */}
      <div className="relative bg-slate-900 pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroContent?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"} 
            alt="City skyscrapers" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-slate-200 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
             <Building2 className="w-3.5 h-3.5" />
             Top Companies
          </div>
          
          {!heroContent ? (
              <div className="space-y-4 max-w-2xl mx-auto flex flex-col items-center">
                  <Skeleton className="h-12 w-full md:w-3/4 bg-slate-800" />
                  <Skeleton className="h-6 w-5/6 bg-slate-800" />
              </div>
          ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                    <Text>{heroContent.title}</Text>
                </h1>
                <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                    <Text>{heroContent.description}</Text>
                </p>
              </>
          )}
        </div>
      </div>

      {/* 2. Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 md:-mt-12">
        <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-900/10 border border-slate-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama perusahaan atau industri..." 
                className="w-full pl-12 h-12 md:h-14 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm md:text-base bg-slate-50/50 focus:bg-white truncate"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* ... Location & Filter Button ... */}
            <div className="relative md:w-1/3 lg:w-1/4">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <select 
                className="w-full pl-12 pr-10 h-12 md:h-14 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-slate-50/50 focus:bg-white text-sm md:text-base text-slate-700 cursor-pointer truncate"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">Semua Lokasi</option>
                <optgroup label="Kota Populer">
                    {cities.slice(0, 5).map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Semua Kota">
                    {cities.slice(5).map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <Button className="h-12 md:h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 w-full md:w-auto shrink-0 bg-slate-900 hover:bg-slate-800 text-white">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Featured Companies (Adaptive) */}
      {!companiesLoading && displayFeatured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 overflow-hidden select-none">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Perusahaan Unggulan
            </h2>
            {shouldScroll ? (
                <div className="overflow-visible relative touch-pan-y">
                    <div 
                        className={cn("flex h-full", isDragging ? "cursor-grabbing" : "cursor-grab")}
                        style={{ 
                            transform: `translateX(calc(-${currentIndex * (100 / itemsVisible)}% + ${dragTranslate}px))`,
                            transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
                        }}
                        onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}
                    >
                        {carouselItems.map((company, index) => (
                            <div key={`${company.perusahaan_id}-scroll-${index}`} className="flex-shrink-0 p-2 h-full" style={{ width: `${100 / itemsVisible}%` }}>
                                <div className="h-full pointer-events-none">
                                    <div className="pointer-events-auto h-full">
                                        <CompanyFeaturedCard company={company} draggable={false} dragTranslate={dragTranslate} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {carouselItems.map((company, index) => (
                        <div key={`${company.perusahaan_id}-static-${index}`} className="h-full">
                            <CompanyFeaturedCard company={company} draggable={false} dragTranslate={0} />
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* 4. Company Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg md:text-xl font-bold text-slate-900">Direktori Perusahaan</h2>
           <span className="text-xs md:text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{companiesLoading ? '...' : `${filteredCompanies.length} Perusahaan`}</span>
        </div>

        {companiesLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company, index) => (
                <Link key={`${company.perusahaan_id}-${index}`} to={`/perusahaan/${company.slug}`} className="group relative bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-slate-200 shadow-sm flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-slate-100 p-1 bg-white shadow-sm flex items-center justify-center shrink-0">
                        <img src={company.logo_url} alt={company.nama} className="w-full h-full object-contain rounded-lg" />
                    </div>
                  </div>
                  <div className="mb-4 flex-1">
                      <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 transition-colors line-clamp-2">{company.nama}</h3>
                      <p className="text-xs md:text-sm text-slate-500 mb-2 font-medium">{company.industri}</p>
                      <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">{company.deskripsi}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{company.lokasi || [company.kota, company.provinsi].filter(Boolean).join(', ') || 'Indonesia'}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Perusahaan tidak ditemukan</h3>
                <p className="text-slate-500 text-sm">Coba ubah kata kunci atau lokasi pencarian Anda.</p>
                <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setLocationFilter('');}}>Reset Filter</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for Featured Card
const CompanyFeaturedCard = ({ company, draggable, dragTranslate }: any) => (
    <Link 
        to={`/perusahaan/${company.slug}`}
        className="group relative bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-blue-200/60 shadow-sm flex flex-col h-full"
        onClick={(e: React.MouseEvent) => { if (Math.abs(dragTranslate) > 5) e.preventDefault(); }}
        draggable={draggable}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-slate-100 p-1 bg-white shadow-sm flex items-center justify-center shrink-0">
                <img src={company.logo_url} alt={company.nama} className="w-full h-full object-contain rounded-lg pointer-events-none" />
            </div>
            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Top
            </span>
        </div>
        <div className="mb-4 flex-1">
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 transition-colors line-clamp-2">{company.nama}</h3>
            <p className="text-xs md:text-sm text-slate-500 mb-2 font-medium">{company.industri}</p>
            <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">{company.deskripsi}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{company.lokasi || [company.kota, company.provinsi].filter(Boolean).join(', ') || 'Indonesia'}</span>
        </div>
    </Link>
);
