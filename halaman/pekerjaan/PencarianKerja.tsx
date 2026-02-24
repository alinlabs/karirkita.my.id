
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../komponen/ui/Button';
import { CardLowongan } from './CardLowongan';
import { Search, MapPin, Filter, Loader2, ChevronDown, Zap, Briefcase } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { routingData } from '../../services/routingData';
import { cn } from '../../utils/cn';
import { useDebounce } from '../../hooks/useDebounce';
import { City } from '../../types';
import { Text } from '../../komponen/ui/Text';
import { Skeleton } from '../../komponen/ui/Skeleton';
import { useSearchParams } from 'react-router-dom';
import { Combobox } from '../../komponen/ui/Combobox';

export const PencarianKerja = () => {
  const [searchParams] = useSearchParams();
  const { jobs, loading: jobsLoading } = useData();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('loc') || '');
  const [cities, setCities] = useState<City[]>([]);
  
  // Hero Content State
  const [heroContent, setHeroContent] = useState<{ title: string; description: string; image?: string } | null>(null);

  // Optimasi: Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Carousel State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragTranslate, setDragTranslate] = useState(0);
  const timeoutRef = useRef<any>(null);

  // --- FEATURED LOGIC ---
  const promotedJobs = jobs.filter(job => job.promosi);
  const displayFeatured = promotedJobs.length > 0 ? promotedJobs : jobs;
  const shouldScroll = displayFeatured.length > itemsVisible;
  const carouselItems = shouldScroll ? [...displayFeatured, ...displayFeatured] : displayFeatured;

  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    const loc = searchParams.get('loc');
    if (q !== null) setSearchTerm(q);
    if (loc !== null) setLocationFilter(loc);
  }, [searchParams]);

  useEffect(() => {
    // 1. Fetch Cities
    routingData.getCities()
      .then(data => {
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      })
      .catch(err => console.error("Failed to fetch cities:", err));

    // 2. Fetch Hero Content from KV
    routingData.getPageData().then(data => {
        if (data && data.pekerjaan) {
            const pekerjaan = data.pekerjaan;
            const isMobile = window.innerWidth < 768;
            const content = isMobile ? pekerjaan.mobile : pekerjaan.desktop;

            setHeroContent({
                title: content.judul || "Cari Lowongan Kerja",
                description: content.deskripsi || "Daftar lengkap lowongan kerja pabrik, kantor, dan freelance di Purwakarta.",
                image: content.hero
            });
        } else {
            // Fallback (Only if fetch fails)
            setHeroContent({
                title: "Temukan Pekerjaan Yang Berarti",
                description: "Eksplorasi ribuan lowongan dari perusahaan teknologi terdepan dan startup."
            });
        }
    });
  }, []);

  const filteredJobs = jobs.filter(job => {
    const term = debouncedSearchTerm.toLowerCase();
    const matchesSearch = job.posisi.toLowerCase().includes(term) ||
                          job.perusahaan.nama.toLowerCase().includes(term);
    
    const matchesLocation = locationFilter === '' || 
                            job.lokasi.toLowerCase().includes(locationFilter.toLowerCase()) ||
                            (locationFilter === 'remote' && job.lokasi.toLowerCase().includes('remote'));

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
      <div className="relative bg-blue-900 pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroContent?.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"} 
            alt="Office background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-slate-900/90"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
             <Briefcase className="w-3.5 h-3.5" />
             Karir Impian
          </div>
          
          {/* Dynamic Hero Text */}
          {!heroContent ? (
              <div className="space-y-4 max-w-2xl mx-auto flex flex-col items-center">
                  <Skeleton className="h-12 w-full md:w-3/4 bg-blue-800/50" />
                  <Skeleton className="h-6 w-5/6 bg-blue-800/50" />
              </div>
          ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    <Text>{heroContent.title}</Text>
                </h1>
                <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
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
                placeholder="Posisi atau perusahaan..." 
                className="w-full pl-12 h-12 md:h-14 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm md:text-base bg-slate-50/50 focus:bg-white truncate"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* ... Location Select & Filter Button ... */}
            <div className="relative md:w-1/3 lg:w-1/4">
              <Combobox 
                options={[
                    { value: "", label: "Semua Lokasi" },
                    { value: "remote", label: "Remote (WFH)" },
                    ...cities.map(c => ({ value: c.name, label: c.name }))
                ]}
                value={locationFilter}
                onChange={setLocationFilter}
                placeholder="Cari Lokasi..."
                icon={<MapPin className="w-5 h-5" />}
                allowCustomValue
                inputClassName="h-12 md:h-14"
              />
            </div>
            <Button className="h-12 md:h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 w-full md:w-auto shrink-0">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Featured / Promoted Jobs (Adaptive) */}
      {!jobsLoading && displayFeatured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 overflow-hidden select-none">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Lowongan Unggulan
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
                        {carouselItems.map((job, index) => (
                            <div key={`${job.lowongan_id}-scroll-${index}`} className="flex-shrink-0 p-2 h-full" style={{ width: `${100 / itemsVisible}%` }}>
                                <div className="h-full pointer-events-none">
                                    <div className="pointer-events-auto h-full">
                                        <CardLowongan job={job} variant="grid" className="h-full border-blue-200/60 shadow-sm bg-white" isHomeSection={true} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {carouselItems.map((job, index) => (
                        <CardLowongan key={`${job.lowongan_id}-static-${index}`} job={job} variant="grid" className="h-full border-blue-200/60 shadow-sm bg-white" isHomeSection={true} />
                    ))}
                </div>
            )}
        </div>
      )}

      {/* 4. Main Job Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg md:text-xl font-bold text-slate-900">Lowongan Terbaru</h2>
           <span className="text-xs md:text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{jobsLoading ? '...' : `${filteredJobs.length} Lowongan`}</span>
        </div>

        {jobsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <CardLowongan key={`${job.lowongan_id}-${index}`} job={job} variant="grid" />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak ada hasil ditemukan</h3>
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
