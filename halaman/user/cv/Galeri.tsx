
import React from 'react';
import { Button } from '../../../komponen/ui/Button';
import { Input } from '../../../komponen/ui/Input';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface GaleriProps {
    gallery: string[];
    setGallery: (data: string[]) => void;
}

export const GaleriCV: React.FC<GaleriProps> = ({ gallery, setGallery }) => {
    
    const addGalleryImage = () => setGallery([...gallery, '']);

    const updateGalleryImage = (index: number, val: string) => {
        const newGallery = [...gallery];
        newGallery[index] = val;
        setGallery(newGallery);
    };

    const removeGalleryImage = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((img, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative">
                        <button 
                            onClick={() => removeGalleryImage(idx)} 
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all z-10 shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                            <Input 
                                label={`Link Gambar ${idx + 1}`}
                                value={img} 
                                onChange={(e) => updateGalleryImage(idx, e.target.value)} 
                                placeholder="Paste URL Gambar..."
                                className="bg-slate-50"
                            />
                            
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center relative">
                                {img ? (
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-300 gap-2">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-xs font-medium">Preview</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                <button 
                    onClick={addGalleryImage} 
                    className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all group bg-slate-50/30"
                >
                    <div className="p-4 bg-white rounded-full mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-base font-bold">Tambah Foto</span>
                </button>
            </div>
        </div>
    );
};
