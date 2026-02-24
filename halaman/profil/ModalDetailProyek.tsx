import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Layers } from 'lucide-react';
import { Proyek } from '../../types';
import { MetricVisualizer } from './SectionPortofolio';
import { cn } from '../../utils/cn';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomSheet } from '../../komponen/ui/MobileBottomSheet';

interface ModalDetailProyekProps {
    project: Proyek;
    onClose: () => void;
}

export const ModalDetailProyek: React.FC<ModalDetailProyekProps> = ({ project, onClose }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeImage, setActiveImage] = useState<string>(
        project.banner_custom_url || project.gambar_url
    );

    // Collect all images: banner/main image + gallery images
    const allImages = [
        project.banner_custom_url || project.gambar_url,
        ...(project.galeri_url || [])
    ].filter(Boolean) as string[];

    // Ensure unique images
    const uniqueImages = Array.from(new Set(allImages));

    const Content = () => (
        <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-5 md:p-8 space-y-6">
                
                {/* Title & Action */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{project.judul}</h2>
                    {project.tautan_eksternal && (
                        <a 
                            href={project.tautan_eksternal} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full transition-all w-fit shrink-0"
                        >
                            Kunjungi Project <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Tentang Project</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {project.deskripsi}
                    </p>
                </div>

                {/* Mini Gallery */}
                {uniqueImages.length > 1 && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" /> Galeri Project
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                            {uniqueImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start",
                                        activeImage === img ? "border-blue-600 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Project Metrics */}
                {project.metrik && project.metrik.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Project Impact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.metrik.map((metric, idx) => (
                                <div key={idx} className="h-full">
                                    <MetricVisualizer metric={metric} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <MobileBottomSheet isOpen={true} onClose={onClose} contentClassName="p-0">
                <div className="relative h-48 shrink-0 bg-slate-100 group">
                    <img 
                        src={activeImage} 
                        alt={project.judul} 
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                </div>
                <Content />
            </MobileBottomSheet>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Main Image Area */}
                <div className="relative h-48 md:h-80 shrink-0 bg-slate-100 group">
                    <img 
                        src={activeImage} 
                        alt={project.judul} 
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <Content />
            </div>
        </div>
    );
};
