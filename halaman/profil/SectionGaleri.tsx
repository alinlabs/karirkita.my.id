
import React from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';

export const SectionGaleri = ({ gallery, onSelect }: { gallery: string[], onSelect: (img: string) => void }) => {
    if (!gallery || gallery.length === 0) return null;

    return (
        <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-slate-400" /> Galeri Aktivitas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onSelect(img)}
                      className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                    >
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-6 h-6 text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
