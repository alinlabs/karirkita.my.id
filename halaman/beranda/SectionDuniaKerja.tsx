
import React, { useState, useEffect } from 'react';
import { CardLowongan } from '../pekerjaan/CardLowongan';
import { Button } from '../../komponen/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { useData } from '../../context/DataContext';

export const SectionDuniaKerja = () => {
  const { jobs: allJobs, loading: jobsLoading } = useData();
  const [displayJobs, setDisplayJobs] = useState<any[]>([]);
  // Default placeholders
  const [brandImage, setBrandImage] = useState("https://placehold.co/400x600/2563eb/ffffff?text=Profesional+Muda");
  const [mainBanner, setMainBanner] = useState("https://placehold.co/1200x240/2563eb/ffffff?text=Lowongan+Terbaru+Minggu+Ini");
  
  // 1. Fetch Data
  useEffect(() => {
    if (!jobsLoading && allJobs.length > 0) {
         const promoted = allJobs.filter(j => j.promosi);
         // Fallback: If no promoted jobs, show top 6 recent jobs
         const finalList = promoted.length > 0 ? promoted : allJobs.slice(0, 6);
         setDisplayJobs(finalList);
    }

    routingData.getIdentity()
      .then((data: any) => {
        const ambassador = data.brandAmbassador || data.dutaMerek;
        const banners = data.banners || data.spanduk;

        if(ambassador) {
            setBrandImage(ambassador.jobs || ambassador.pekerjaan || "https://placehold.co/400x600/2563eb/ffffff?text=Profesional+Muda");
        }
        if(banners) {
            setMainBanner(banners.jobs || banners.pekerjaan || "https://placehold.co/1200x240/2563eb/ffffff?text=Lowongan+Terbaru");
        }
      })
      .catch(err => console.error("Failed to load identity assets:", err));
  }, [allJobs, jobsLoading]);

  return (
    <section className="py-8 md:py-20 bg-slate-50/50 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-8 gap-6">
          <div className="relative w-full md:w-auto">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-300 rounded-full blur-xl opacity-50"></div>
            
            <div className="relative z-10 flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">
                        Dunia Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Masa Depan</span>
                    </h2>
                    <p className="text-slate-600 text-sm md:text-lg max-w-xl leading-relaxed">
                        Tinggalkan cara lama. Temukan karir di perusahaan yang menghargai kreativitas dan fleksibilitasmu.
                    </p>
                </div>

                <Link to="/pekerjaan" className="md:hidden shrink-0 p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95">
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
          </div>
          
          <div className="flex gap-2 items-center justify-center w-full md:w-auto">
             <Link to="/pekerjaan">
                <Button variant="ghost" className="hidden md:flex hover:bg-white hover:shadow-sm transition-all rounded-full px-6">
                  Explore All Jobs <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </Link>
          </div>
        </div>

        {/* --- STATIC BANNER --- */}
        <div className="w-full aspect-[5/1] rounded-2xl md:rounded-3xl overflow-hidden mb-8 relative shadow-lg group">
            <img 
              src={mainBanner} 
              alt="Banner Lowongan" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
          
          {/* DYNAMIC JOB CONTENT */}
          <div className="lg:col-span-3 rounded-[2rem]">
               {jobsLoading ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-slate-200 rounded-[2rem] animate-pulse"></div>)}
                   </div>
               ) : (
                   <>
                       {/* MOBILE: Horizontal Scroll */}
                       <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-hide">
                           {displayJobs.map((job, index) => (
                               <div key={`${job.lowongan_id}-mob-${index}`} className="snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[300px]">
                                   <div className="h-full">
                                      <CardLowongan job={job} variant="grid" className="h-full" isHomeSection={true} />
                                   </div>
                               </div>
                           ))}
                       </div>

                       {/* DESKTOP: Grid */}
                       <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-full">
                           {displayJobs.map((job, index) => (
                               <CardLowongan key={`${job.lowongan_id}-static-${index}`} job={job} variant="grid" className="h-full" isHomeSection={true} />
                           ))}
                       </div>
                   </>
               )}
          </div>

          {/* STATIC IMAGE COLUMN */}
          <div className="lg:col-span-1 hidden lg:block relative h-full">
                <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-transparent">
                    <img 
                        src={brandImage}
                        alt="Brand Ambassador Jobs" 
                        className="w-full h-full object-cover object-bottom"
                    />
                </div>
          </div>

        </div>
      </div>
    </section>
  );
};
