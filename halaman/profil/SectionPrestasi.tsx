
import React from 'react';
import { Trophy, Award, ExternalLink } from 'lucide-react';
import { Sertifikasi } from '../../types';
import { cn } from '../../utils/cn';

export const SectionPrestasi = ({ achievements, compact = false }: { achievements: Sertifikasi[], compact?: boolean }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" /> Penghargaan & Sertifikasi
            </h3>
            <div className={cn("grid gap-4 flex-1", compact ? "grid-cols-1 content-start" : "grid-cols-1 md:grid-cols-2 gap-6")}>
                {achievements && achievements.length > 0 ? (
                    achievements.map((ach) => (
                        <div 
                            key={ach.id} 
                            className={cn(
                                "bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all flex hover:border-blue-300",
                                compact ? "rounded-2xl p-4 flex-row items-center gap-4" : "rounded-[2rem] p-4 md:p-6 flex-row md:flex-col gap-4 md:gap-0"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center shrink-0 border border-yellow-100",
                                compact ? "w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl" : "w-12 h-12 md:w-14 md:h-14 bg-yellow-50 text-yellow-600 rounded-xl md:rounded-2xl"
                            )}>
                                <Award className={compact ? "w-6 h-6" : "w-6 h-6 md:w-7 md:h-7"} />
                            </div>

                            <div className="flex-1 min-w-0">
                                {!compact && (
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{ach.tanggal}</span>
                                    </div>
                                )}
                                <h3 className={cn("font-bold text-slate-900 leading-tight truncate", compact ? "text-base mb-0.5" : "text-base md:text-lg mb-1")}>
                                    {ach.judul}
                                </h3>
                                <div className="flex items-center gap-2 text-xs md:text-sm">
                                    <p className="text-blue-600 font-semibold truncate">{ach.penerbit}</p>
                                    {compact && <span className="text-slate-300">•</span>}
                                    {compact && <span className="text-xs font-medium text-slate-400">{ach.tanggal}</span>}
                                </div>
                                
                                {!compact && (
                                    <>
                                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 mt-2 flex-1 line-clamp-2">{ach.deskripsi}</p>
                                        {ach.credential_id && (
                                            <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-[10px] md:text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">ID: {ach.credential_id}</span>
                                                <a href={ach.sertifikat_url || '#'} className="text-xs md:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                    Lihat <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-sm">Belum ada prestasi yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
