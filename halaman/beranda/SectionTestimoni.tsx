
import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Quote, Star } from 'lucide-react';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { Testimoni } from '../../types';

export const SectionTestimoni = () => {
  const [testimonials, setTestimonials] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragTranslate, setDragTranslate] = useState(0);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    // Fetch testimonials from KV via routingData
    routingData.getTestimonials()
      .then(data => {
        setTestimonials(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch testimonials", err);
        setLoading(false);
      });
  }, []);

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

  // Duplicate items for seamless loop
  const carouselItems = [...testimonials, ...testimonials];

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Auto Slide
  useEffect(() => {
    resetTimeout();
    if (isTransitioning && !isDragging && testimonials.length > 0) {
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 5000);
    }
    return () => resetTimeout();
  }, [currentIndex, isTransitioning, isDragging, testimonials.length]);

  // Seamless Loop Reset Logic
  useEffect(() => {
    if (testimonials.length > 0 && currentIndex === testimonials.length) {
        const timeout = setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(0);
        }, 500); // Wait for transition to finish
        return () => clearTimeout(timeout);
    }
  }, [currentIndex, testimonials.length]);

  // Restore Transition
  useEffect(() => {
    if (!isTransitioning) {
        const timeout = setTimeout(() => {
            setIsTransitioning(true);
        }, 50);
        return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    if (currentIndex < testimonials.length) {
        setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
    } else {
        setCurrentIndex(testimonials.length - 1);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
    resetTimeout();
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;
    setDragTranslate(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);
    
    if (dragTranslate < -50) {
        nextSlide();
    } else if (dragTranslate > 50) {
        prevSlide();
    }
    setDragTranslate(0);
  };
  
  // Only render if we have data
  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-10 md:py-24 bg-slate-900 text-white overflow-hidden relative select-none">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-4 md:gap-6">
            <div className="max-w-2xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4"><Text>Apa Kata Mereka?</Text></h2>
                <p className="text-sm md:text-base text-slate-400">
                    <Text>Cerita sukses dari talenta digital dan perusahaan yang telah menggunakan platform KarirKita.</Text>
                </p>
            </div>
        </div>

        <div className="overflow-hidden touch-pan-y">
            <div 
                className={cn(
                    "flex h-full",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                style={{ 
                    transform: `translateX(calc(-${currentIndex * (100 / itemsVisible)}% + ${dragTranslate}px))`,
                    transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                {carouselItems.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3 md:p-4">
                        <Card className="p-6 md:p-8 bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors relative flex flex-col h-full rounded-[2rem] pointer-events-none">
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-blue-500/20 absolute top-6 right-6" />
                        
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
                            <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-slate-600"
                            />
                            <div>
                            <h4 className="font-bold text-white text-base md:text-lg leading-tight">{item.name}</h4>
                            <p className="text-[10px] md:text-xs text-blue-400 uppercase font-semibold tracking-wide mt-1"><Text>{item.role}</Text></p>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-slate-300 italic leading-relaxed mb-4 md:mb-6 flex-1 relative z-10">
                            "<Text>{item.text}</Text>"
                        </p>

                        <div className="flex gap-1 mt-auto text-yellow-500 relative z-10">
                            {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < item.rating ? 'fill-yellow-500' : 'text-slate-600 fill-slate-600'}`} />
                            ))}
                        </div>

                        </Card>
                    </div>
                ))}
            </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {testimonials.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        setIsTransitioning(true);
                        setCurrentIndex(idx);
                    }}
                    className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        currentIndex % testimonials.length === idx 
                            ? "bg-blue-500 w-4" 
                            : "bg-slate-700 hover:bg-slate-600"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};
