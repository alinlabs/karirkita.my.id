
import React from 'react';
import { Link } from 'react-router-dom';
import { Lowongan } from '../../types';
import { cn } from '../../utils/cn';
import { MapPin, Building2, Briefcase, GraduationCap } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { Text } from '../../komponen/ui/Text';

interface CardLowonganProps {
  // Allow job to have either id or lowongan_id for component flexibility
  job: Lowongan & { id?: string };
  variant?: 'list' | 'grid';
  className?: string;
  isHomeSection?: boolean;
}

export const CardLowongan: React.FC<CardLowonganProps> = ({ job, variant = 'list', className, isHomeSection = false }) => {
  const isGrid = variant === 'grid';
  const { formatCurrencyString } = useSettings();

  // Use lowongan_id or fallback to id
  const jobId = job.lowongan_id || job.id;
  const slug = job.slug || '#';

  // Prioritize job cover image, then company cover image, then placeholder
  // Handles missing relational data gracefully
  const companyName = job.perusahaan?.nama || 'Perusahaan';
  const companyLogo = job.perusahaan?.logo_url || 'https://placehold.co/100x100/e2e8f0/64748b?text=Logo';
  const jobBanner = job.banner || job.perusahaan?.banner_url || `https://placehold.co/800x400/1e293b/ffffff?text=${encodeURIComponent(job.posisi)}`;

  // Determine Job Mode (Remote/Onsite) for display logic
  const getJobMode = (loc: string) => {
    if (job.sistem_kerja) return job.sistem_kerja;
    if (!loc) return 'On-site';
    const lowerLoc = loc.toLowerCase();
    if (lowerLoc.includes('remote')) return 'Remote';
    if (lowerLoc.includes('hybrid')) return 'Hybrid';
    return 'On-site';
  };

  const jobMode = getJobMode(job.lokasi);

  return (
    <Link 
      to={`/pekerjaan/${slug}`}
      className={cn(
        "group block relative bg-white rounded-2xl md:rounded-[1.5rem] overflow-hidden border border-slate-200 h-full flex flex-col",
        !isGrid && "md:flex-row",
        className
      )}
    >
      {/* --- 1. Cover Image Section --- */}
      <div className={cn(
        "relative overflow-hidden bg-slate-100 shrink-0",
        isGrid ? "h-24 md:h-36 w-full" : "h-24 md:h-auto md:w-72"
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60" />
        <img 
          src={jobBanner}
          alt={job.posisi} 
          className="w-full h-full object-cover"
        />
        
        {/* Badge Tipe Kontrak */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
          <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-900 shadow-sm border border-white/20">
            {job.tipe_pekerjaan}
          </span>
        </div>

        {/* Floating Logo - Moved to Bottom Left of Cover */}
        <div className={cn(
          "absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-white p-1 rounded-lg md:rounded-xl shadow-sm border border-slate-100 flex items-center justify-center z-20",
          "w-10 h-10 md:w-14 md:h-14"
        )}>
          <img 
            src={companyLogo} 
            alt={companyName} 
            className="w-full h-full object-contain rounded md:rounded-lg"
          />
        </div>

        {/* Company Name - Bottom Right of Cover */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-20 max-w-[50%] text-right">
             <span className="text-[10px] md:text-xs font-bold text-white drop-shadow-md truncate block bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-[2px]">
                {companyName}
             </span>
        </div>
      </div>

      {/* --- 2. Content Section --- */}
      <div className="relative p-3 md:p-5 flex flex-col flex-1">
        
        {/* Content */}
        <div className="mt-0">
           {/* Title */}
           <div className="mb-2 md:mb-3">
              <h3 className="text-sm md:text-lg font-bold text-slate-900 transition-colors line-clamp-2 leading-tight mb-0.5 md:mb-1">
                {job.posisi}
              </h3>
           </div>

           {/* Tags: Location, Mode, Education */}
           {/* MOBILE LAYOUT */}
           <div className="flex flex-col gap-1 w-full md:hidden mb-3">
                {isHomeSection ? (
                    // HOME SECTION LAYOUT (Grouped)
                    <>
                        <div className="flex items-center gap-3">
                            {job.pendidikan_minimal && (
                                <div className="flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="text-[10px] font-medium text-slate-500">{job.pendidikan_minimal}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="text-[10px] font-medium text-slate-500">{jobMode}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-medium text-slate-500 truncate">{job.lokasi}</span>
                        </div>
                    </>
                ) : (
                    // STANDARD LAYOUT (Vertical List)
                    <>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-medium text-slate-500 truncate">{job.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-medium text-slate-500">{jobMode}</span>
                        </div>
                        {job.pendidikan_minimal && (
                            <div className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="text-[10px] font-medium text-slate-500">{job.pendidikan_minimal}</span>
                            </div>
                        )}
                    </>
                )}
           </div>

           {/* DESKTOP LAYOUT */}
           <div className="hidden md:flex md:flex-row md:flex-wrap items-center gap-y-2 gap-x-4 mb-4 text-xs font-medium text-slate-500 w-full">
              <div className="flex items-center gap-1.5 w-auto">
                 <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                 <span className="truncate max-w-[120px]">{job.lokasi}</span>
              </div>
              <div className="flex items-center gap-1.5 w-auto">
                 <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                 <span>{jobMode}</span>
              </div>
              {job.pendidikan_minimal && (
                  <div className="flex items-center gap-1.5 w-auto">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.pendidikan_minimal}</span>
                  </div>
              )}
           </div>
        </div>

        {/* Footer: Salary Only (Black Text, No Date) */}
        <div className="mt-auto pt-3 md:pt-4 border-t border-slate-100">
           {/* MOBILE SALARY LAYOUT */}
           <div className="flex flex-col w-full md:hidden">
              {isHomeSection ? (
                  // HOME SECTION LAYOUT (Split)
                  <>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider"><Text>Est. Gaji</Text></span>
                      <div className="flex justify-between items-end mt-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider"><Text>{`Per ${job.sistem_gaji || 'Bulan'}`}</Text></span>
                          <span className="text-slate-900 font-black text-xs">
                             {job.rentang_gaji ? formatCurrencyString(job.rentang_gaji) : 'Disclosed'}
                          </span>
                      </div>
                  </>
              ) : (
                  // STANDARD LAYOUT (Stacked)
                  <>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider"><Text>{`Est. Gaji / ${job.sistem_gaji || 'Bulan'}`}</Text></span>
                      <div className="text-slate-900 font-black text-xs mt-0.5">
                         <span>{job.rentang_gaji ? formatCurrencyString(job.rentang_gaji) : 'Disclosed'}</span>
                      </div>
                  </>
              )}
           </div>

           {/* DESKTOP SALARY LAYOUT */}
           <div className="hidden md:flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider"><Text>{`Est. Gaji / ${job.sistem_gaji || 'Bulan'}`}</Text></span>
                  <div className="text-slate-900 font-black text-sm mt-0.5">
                     <span>{job.rentang_gaji ? formatCurrencyString(job.rentang_gaji) : 'Disclosed'}</span>
                  </div>
               </div>
           </div>
        </div>

      </div>
    </Link>
  );
};
