import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Users, ArrowRight, Linkedin, Briefcase, Award } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Mentor } from '../../types';
import { cn } from '../../utils/cn';

export const SectionMentor = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        routingData.getKelas().then(data => {
            if (data && data.mentors) {
                setMentors(data.mentors);
            }
        });
    }, []);

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
        <section>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-600" /> Mentor Pilihan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Belajar langsung dari para ahli industri.</p>
                </div>
                <Link to="/mentor/semua">
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                        Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </div>

            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 md:gap-6 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
            >
                {mentors.map((mentor) => (
                    <Link key={mentor.id} to={`/mentor/${mentor.slug}`} className="group min-w-[45%] md:min-w-0 snap-center">
                        <Card className="h-full p-3 md:p-6 border-slate-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-900/5 transition-all duration-300 text-center group-hover:-translate-y-1">
                            <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4">
                                <img 
                                    src={mentor.gambar} 
                                    alt={mentor.nama} 
                                    className="w-full h-full object-cover rounded-full border-2 md:border-4 border-white shadow-md group-hover:scale-105 transition-transform" 
                                />
                                <div className="absolute bottom-0 right-0 bg-white p-0.5 md:p-1 rounded-full shadow-sm border border-slate-100">
                                    <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-xs md:text-base text-slate-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">{mentor.nama}</h3>
                            <p className="text-[10px] md:text-xs text-slate-500 mb-2 md:mb-3 flex items-center justify-center gap-1 line-clamp-2 h-8 md:h-auto">
                                <Briefcase className="w-3 h-3 hidden md:block" /> {mentor.peran} at {mentor.perusahaan}
                            </p>

                            <div className="flex flex-wrap justify-center gap-1 mb-3 md:mb-4 h-12 md:h-auto overflow-hidden">
                                {mentor.keahlian.slice(0, 2).map((skill: string, idx: number) => (
                                    <span key={idx} className="text-[8px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 bg-slate-100 text-slate-600 rounded-full whitespace-nowrap">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-3 md:pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] md:text-xs">
                                <div className="flex items-center gap-1 text-slate-600">
                                    <Award className="w-3 h-3 text-yellow-500" /> {mentor.sesi} Sesi
                                </div>
                                <div className="font-bold text-slate-900">
                                    ⭐ {mentor.rating}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Mobile Indicators */}
            <div className="flex justify-center gap-2 md:hidden mt-4">
                {mentors.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            activeIndex === idx ? "w-4 bg-purple-600" : "w-1.5 bg-slate-200"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
