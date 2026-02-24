
import React from 'react';
import { Briefcase, GraduationCap, Building } from 'lucide-react';
import { Pengalaman, Pendidikan } from '../../types';

// Helper to get a generic icon if no logo URL is present
const SchoolIcon = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center bg-slate-50 rounded-lg ${className}`}>
        <GraduationCap className="w-6 h-6 text-slate-400" />
    </div>
);

const CompanyIcon = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center bg-slate-50 rounded-lg ${className}`}>
        <Building className="w-6 h-6 text-slate-400" />
    </div>
);

export const getEducationLogo = (edu: Pendidikan | null | undefined): string => {
    return edu?.logo_institusi_url || "https://placehold.co/100x100/e2e8f0/64748b?text=School";
};

interface Props {
    experiences: Pengalaman[];
    educations?: Pendidikan[];
    onSelectExperience: (exp: Pengalaman) => void;
    onSelectEducation: (edu: Pendidikan) => void;
}

export const PengalamanKerjaDanSekolah = ({ experiences, educations, onSelectExperience, onSelectEducation }: Props) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Experience Column */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Briefcase className="w-5 h-5" /></div>
                    Pengalaman Kerja
                </h3>
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-2">
                    {experiences.length > 0 ? (
                        experiences.map((exp, idx) => (
                            <div key={idx} className="relative pl-8 group">
                                <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm group-hover:scale-125 transition-transform"></div>
                                
                                <div 
                                  onClick={() => onSelectExperience(exp)}
                                  className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex gap-4 items-start flex-row"
                                >
                                    <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                                        {exp.logo_perusahaan_url ? (
                                            <img 
                                              src={exp.logo_perusahaan_url} 
                                              alt={exp.nama_perusahaan} 
                                              className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <CompanyIcon className="w-full h-full" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                                            <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{exp.posisi}</h4>
                                            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-wider whitespace-nowrap w-fit">
                                                {exp.tanggal_mulai} - {exp.tanggal_selesai}
                                            </span>
                                        </div>
                                        <p className="text-blue-600 font-semibold text-sm md:text-base mb-2">{exp.nama_perusahaan}</p>
                                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2">{exp.deskripsi}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="pl-8 text-slate-500 italic">Belum ada pengalaman.</p>
                    )}
                </div>
            </div>

            {/* Education Column */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl text-green-600"><GraduationCap className="w-5 h-5" /></div>
                    Pendidikan
                </h3>
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-2">
                    {educations?.map((edu, idx) => (
                        <div key={idx} className="relative pl-8 group">
                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-green-600 shadow-sm group-hover:scale-125 transition-transform"></div>
                            
                            <div 
                              onClick={() => onSelectEducation(edu)}
                              className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer flex gap-4 items-start flex-row"
                            >
                                <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                                    {edu.logo_institusi_url ? (
                                        <img 
                                          src={edu.logo_institusi_url} 
                                          alt={edu.nama_institusi} 
                                          className="w-full h-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <SchoolIcon className="w-full h-full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                                        <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors truncate">{edu.nama_institusi}</h4>
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-50 text-green-700 text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-wider whitespace-nowrap w-fit">
                                            {edu.tanggal_mulai} - {edu.tanggal_selesai}
                                        </span>
                                    </div>
                                    <p className="text-green-700 font-semibold text-sm md:text-base mb-2">{edu.gelar}, {edu.bidang_studi}</p>
                                    {edu.deskripsi && <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2">{edu.deskripsi}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
