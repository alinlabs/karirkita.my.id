
import React, { useState, useEffect, useRef } from 'react';
import { CardPelamar } from './CardPelamar';
import { Search, Code2, Users, Loader2, Zap } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { Skeleton } from '../../komponen/ui/Skeleton';

export const DaftarPelamar = () => {
  const { talents, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
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
  const promotedTalents = talents.filter(t => t.promosi);
  const displayFeatured = promotedTalents.length > 0 ? promotedTalents : talents;
  const shouldScroll = displayFeatured.length > itemsVisible;
  const carouselItems = shouldScroll ? [...displayFeatured, ...displayFeatured] : displayFeatured;

  useEffect(() => {
    // Fetch Hero Content
    routingData.getPageData().then(data => {
        if (data && data.pelamar) {
            const pelamar = data.pelamar;
            const isMobile = window.innerWidth < 768;
            const content = isMobile ? pelamar.mobile : pelamar.desktop;

            setHeroContent({
                title: content.judul || "Database Talenta",
                description: content.deskripsi || "Temukan profesional dan tenaga kerja terampil asli Purwakarta untuk bisnis Anda.",
                image: content.hero
            });
        } else {
            setHeroContent({
                title: "Temukan Digital Talent Terbaik",
                description: "Rekrut profesional freelance atau full-time yang siap membantu mengembangkan bisnis Anda."
            });
        }
    });
  }, []);

  const filteredTalents = talents.filter(talent => 
    talent.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.keahlian.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="relative bg-purple-900 pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroContent?.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"} 
            alt="Collaboration background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-slate-900/90"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-100 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
             <Users className="w-3.5 h-3.5" />
             Talent Marketplace
          </div>
          
          {!heroContent ? (
              <div className="space-y-4 max-w-2xl mx-auto flex flex-col items-center">
                  <Skeleton className="h-12 w-full md:w-3/4 bg-purple-800/50" />
                  <Skeleton className="h-6 w-5/6 bg-purple-800/50" />
              </div>
          ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    <Text>{heroContent.title}</Text>
                </h1>
                <p className="text-purple-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
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
                placeholder="Cari nama, role, atau skill..." 
                className="w-full pl-12 h-12 md:h-14 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm md:text-base bg-slate-50/50 focus:bg-white truncate"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-12 md:h-14 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 border-none font-bold w-full md:w-auto">
              Cari Talent
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 overflow-x-auto no-scrollbar pb-1">
            <span className="font-semibold shrink-0">Populer:</span>
            <div className="flex gap-2">
                {['React', 'Design', 'Marketing', 'Golang'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors text-xs font-medium whitespace-nowrap"
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Rising Stars (Featured) */}
      {!loading && displayFeatured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 overflow-hidden select-none">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500 fill-purple-500" />
                Rising Stars
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
                        {carouselItems.map((talent, index) => (
                            <div key={`${talent.user_id}-scroll-${index}`} className="flex-shrink-0 p-2 h-full" style={{ width: `${100 / itemsVisible}%` }}>
                                <div className="h-full pointer-events-none">
                                    <div className="pointer-events-auto h-full">
                                        <CardPelamar talent={talent} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {carouselItems.map((talent, index) => (
                        <div key={`${talent.user_id}-static-${index}`} className="h-full">
                            <CardPelamar talent={talent} />
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* 4. Talent Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg md:text-xl font-bold text-slate-900">Semua Talent</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredTalents.map((talent, index) => (
              <div key={`${talent.user_id}-${index}`} className="h-full">
                 <CardPelamar talent={talent} />
              </div>
            ))}
            {filteredTalents.length === 0 && (
               <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Tidak ada talent yang cocok dengan pencarian Anda.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
