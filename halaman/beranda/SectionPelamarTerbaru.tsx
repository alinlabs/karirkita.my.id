
import React, { useState, useEffect, useRef } from 'react';
import { CardPelamar } from '../pelamar/CardPelamar';
import { Button } from '../../komponen/ui/Button';
import { Skeleton } from '../../komponen/ui/Skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils/cn';

export const SectionPelamarTerbaru = () => {
  const { talents: allTalents, loading: talentsLoading } = useData();
  const [displayTalents, setDisplayTalents] = useState<any[]>([]);
  
  // Default placeholders
  const [brandImage, setBrandImage] = useState("https://placehold.co/400x600/7c3aed/ffffff?text=Talenta+Terbaik");
  const [mainBanner, setMainBanner] = useState("https://placehold.co/1200x240/7c3aed/ffffff?text=Database+Talenta+Digital");

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const autoPlayRef = useRef<any>(null);

  useEffect(() => {
    if (!talentsLoading && allTalents.length > 0) {
         const promoted = allTalents.filter(t => t.promosi);
         // Fallback logic
         setDisplayTalents(promoted.length > 0 ? promoted : allTalents.slice(0, 6));
    }

    routingData.getIdentity()
      .then((data: any) => {
        const ambassador = data.brandAmbassador || data.dutaMerek;
        const banners = data.banners || data.spanduk;

        if(ambassador) {
            setBrandImage(ambassador.talents || ambassador.talenta || "https://placehold.co/400x600/7c3aed/ffffff?text=Talenta+Terbaik");
        }
        if(banners) {
            setMainBanner(banners.talents || banners.talenta || "https://placehold.co/1200x240/7c3aed/ffffff?text=Database+Talenta+Digital");
        }
      })
      .catch(err => console.error(err));
  }, [allTalents, talentsLoading]);

  // --- CAROUSEL LOGIC ---
  const totalItems = displayTalents.length;
  // Duplicate list for infinite loop effect
  const extendedList = [...displayTalents, ...displayTalents];

  const nextSlide = () => {
    if (totalItems === 0) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (totalItems === 0) return;
    if (currentIndex === 0) {
      setIsResetting(true);
      setCurrentIndex(totalItems);
      setTimeout(() => {
        setIsResetting(false);
        setCurrentIndex(totalItems - 1);
      }, 50);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= totalItems) {
      setIsResetting(true);
      setCurrentIndex(0);
      // Small timeout to allow render at 0 before re-enabling transition
      setTimeout(() => {
        setIsResetting(false);
      }, 50);
    }
  };

  // Auto Play
  useEffect(() => {
    if (totalItems === 0) return;
    const startAutoPlay = () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 4000);
    };

    startAutoPlay();
    return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalItems, isResetting]); // Restart timer on reset/state change to avoid double jumps? 
  // Actually, simple interval is fine, but we should pause on hover ideally. 
  // For now, simple auto play.

  const pauseAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  return (
    <section className="py-8 md:py-20 bg-white border-t border-slate-100 overflow-hidden relative select-none">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-100/50 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-8 gap-6">
          <div className="w-full md:w-auto">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">
                    <Text>Talenta</Text> <span className="text-purple-600"><Text>Digital</Text></span> <Text>Kreatif</Text>
                    </h2>
                    <p className="text-slate-600 text-sm md:text-lg max-w-xl leading-relaxed">
                    <Text>Kolaborasi dengan freelancer dan profesional yang siap membawa ide liarmu menjadi kenyataan.</Text>
                    </p>
                </div>

                <Link to="/pelamar" className="md:hidden shrink-0 p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm active:scale-95">
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
          </div>
          
          <div className="flex gap-2 items-center justify-center w-full md:w-auto">
             <Link to="/pelamar">
                <Button variant="ghost" className="hidden md:flex hover:bg-slate-50 hover:shadow-sm transition-all rounded-full px-6">
                  <Text>View All Talents</Text> <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </Link>
          </div>
        </div>

        {/* --- STATIC BANNER --- */}
        <div className="w-full aspect-[5/1] rounded-2xl md:rounded-3xl overflow-hidden mb-8 relative shadow-lg group">
            <img 
              src={mainBanner} 
              alt="Banner Talent" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
          
          <div className="lg:col-span-1 hidden lg:block relative h-full">
                <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-transparent">
                    <img 
                        src={brandImage}
                        alt="Brand Ambassador Talents" 
                        className="w-full h-full object-cover object-bottom"
                    />
                </div>
          </div>

          <div className="lg:col-span-3 rounded-[2rem]">
              {talentsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3].map(i => <div key={i} className="h-96 bg-slate-200 rounded-[2rem] animate-pulse"></div>)}
                  </div>
              ) : (
                  <>
                      {/* MOBILE: Infinite Carousel (2 items visible) */}
                      <div 
                        className="relative lg:hidden group"
                        onMouseEnter={pauseAutoPlay}
                        onMouseLeave={() => {
                            if (totalItems > 0) {
                                autoPlayRef.current = setInterval(() => setCurrentIndex(p => p + 1), 4000);
                            }
                        }}
                      >
                          <div className="overflow-hidden rounded-[2rem]">
                              <div 
                                  className="flex"
                                  style={{ 
                                      transform: `translateX(-${currentIndex * 50}%)`,
                                      transition: isResetting ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                                  }}
                                  onTransitionEnd={handleTransitionEnd}
                              >
                                  {extendedList.map((talent, index) => (
                                      <div key={`${talent.user_id}-carousel-${index}`} className="w-1/2 flex-shrink-0 p-2">
                                          <div className="h-full">
                                              <CardPelamar talent={talent} />
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Navigation Buttons */}
                          <button 
                            onClick={(e) => { e.preventDefault(); prevSlide(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                              <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); nextSlide(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                              <ChevronRight className="w-5 h-5" />
                          </button>

                          {/* Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                              {displayTalents.map((_, idx) => (
                                  <button
                                      key={idx}
                                      onClick={(e) => {
                                          e.preventDefault();
                                          setIsResetting(false);
                                          setCurrentIndex(idx);
                                      }}
                                      className={cn(
                                          "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                          currentIndex % totalItems === idx 
                                              ? "bg-purple-600 w-4" 
                                              : "bg-white/80 hover:bg-white w-1.5"
                                      )}
                                      aria-label={`Go to slide ${idx + 1}`}
                                  />
                              ))}
                          </div>
                      </div>

                      {/* DESKTOP: Grid */}
                      <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-full">
                          {displayTalents.map((talent, index) => (
                              <div key={`${talent.user_id}-static-${index}`} className="h-full">
                                  <CardPelamar talent={talent} />
                              </div>
                          ))}
                      </div>
                  </>
              )}
          </div>
        
        </div>
      </div>
    </section>
  );
};
