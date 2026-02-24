
import React from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import { PencariKerja } from '../../types';
import { SocialIcon } from '../../komponen/ui/SocialIcon';

export const SectionTentang = ({ talent, onSelectImage, experienceYears }: { talent: PencariKerja, onSelectImage: (img: string) => void, experienceYears: number }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center md:items-start">
                    
                    {/* Photo Column */}
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg rotate-3 border-4 border-white bg-slate-100">
                            <img 
                              src={talent.galeri_kegiatan?.[0] || talent.foto_profil} 
                              alt={talent.nama_lengkap} 
                              className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Hello, I'm {talent.nama_lengkap.split(' ')[0]}.</h2>
                        
                        {(talent.tempat_lahir || talent.tanggal_lahir) && (
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-6">
                                {talent.tempat_lahir ? `${talent.tempat_lahir}, ` : ''}{talent.tanggal_lahir}
                            </p>
                        )}

                        <div className="prose prose-lg prose-slate text-slate-600 leading-loose mx-auto md:mx-0 mb-8">
                            <p className="whitespace-pre-line">{talent.tentang_saya}</p>
                            <p>
                                Passion saya terletak pada {talent.headline}. Saya percaya bahwa desain yang baik bukan hanya tentang visual, tetapi tentang bagaimana menyelesaikan masalah pengguna dengan cara yang paling elegan dan efisien.
                            </p>
                        </div>
                        
                        {/* Full Socials */}
                        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 justify-center md:justify-start mb-8">
                            {talent.sosial_media.linkedin_url && (
                                <a href={talent.sosial_media.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 px-3 py-3 md:px-5 bg-[#0077b5] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-xs md:text-base">
                                    <SocialIcon name="linkedin" className="w-4 h-4 md:w-5 md:h-5" /> LinkedIn
                                </a>
                            )}
                            {talent.sosial_media.github_url && (
                                <a href={talent.sosial_media.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 px-3 py-3 md:px-5 bg-[#333] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-xs md:text-base">
                                    <SocialIcon name="github" className="w-4 h-4 md:w-5 md:h-5" /> GitHub
                                </a>
                            )}
                            {talent.sosial_media.instagram_url && (
                                <a href={talent.sosial_media.instagram_url} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 px-3 py-3 md:px-5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-xs md:text-base">
                                    <SocialIcon name="instagram" className="w-4 h-4 md:w-5 md:h-5" /> Instagram
                                </a>
                            )}
                            {talent.sosial_media.website_url && (
                                <a href={talent.sosial_media.website_url} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 px-3 py-3 md:px-5 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-xs md:text-base">
                                    <SocialIcon name="website" className="w-4 h-4 md:w-5 md:h-5" /> Website
                                </a>
                            )}
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-slate-100 pt-8">
                            <div className="text-center md:text-left">
                                <p className="text-2xl md:text-3xl font-black text-blue-600">{experienceYears}+</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Tahun Pengalaman</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl md:text-3xl font-black text-purple-600">{talent.portofolio.length}+</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Proyek Selesai</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl md:text-3xl font-black text-green-600">100%</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Kepuasan Klien</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section in About Tab */}
            {talent.galeri_kegiatan && talent.galeri_kegiatan.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-slate-400" /> Life & Activities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {talent.galeri_kegiatan.map((img, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => onSelectImage(img)}
                              className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                            >
                                <img src={img} alt="Life Gallery" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
