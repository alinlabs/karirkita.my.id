
import React from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Button } from '../../../komponen/ui/Button';
import { Trash2, Plus, Globe, X, Image as ImageIcon } from 'lucide-react';
import { Proyek } from '../../../types';

interface PortofolioProps {
    portfolio: Partial<Proyek>[];
    setPortfolio: (data: any) => void;
}

export const PortofolioCV: React.FC<PortofolioProps> = ({ portfolio, setPortfolio }) => {
    
    const updateItem = (id: any, field: string, value: any) => {
        setPortfolio(portfolio.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: any) => {
        setPortfolio(portfolio.filter(item => item.id !== id));
    };

    const addPortfolio = () => {
        setPortfolio([...portfolio, { 
            id: `port-${Date.now()}`, judul: '', deskripsi: '', 
            gambar_url: '', galeri_url: [], tautan_eksternal: '' 
        }]);
    };

    const addGalleryImage = (itemId: any) => {
        setPortfolio(portfolio.map(item => item.id === itemId ? { ...item, galeri_url: [...(item.galeri_url || []), ''] } : item));
    };

    const updateGalleryImage = (itemId: any, index: number, value: string) => {
        setPortfolio(portfolio.map(item => {
            if (item.id !== itemId) return item;
            const newGallery = [...(item.galeri_url || [])];
            newGallery[index] = value;
            return { ...item, galeri_url: newGallery };
        }));
    };

    const removeGalleryImage = (itemId: any, index: number) => {
        setPortfolio(portfolio.map(item => {
            if (item.id !== itemId) return item;
            const newGallery = (item.galeri_url || []).filter((_, i) => i !== index);
            return { ...item, galeri_url: newGallery };
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {portfolio.map((port) => (
                <Card key={port.id} className="p-0 overflow-hidden relative group border-slate-200 hover:border-blue-200 transition-all rounded-[2rem] shadow-sm hover:shadow-lg">
                    {/* Top 16:9 Cover Preview */}
                    <div className="relative w-full aspect-video bg-slate-100 group-hover:bg-slate-50 transition-colors border-b border-slate-100">
                        {port.gambar_url ? (
                            <img src={port.gambar_url} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="text-sm font-medium">Cover Preview 16:9</span>
                            </div>
                        )}
                        
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={() => removeItem(port.id)} className="p-2 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-xl shadow-sm hover:shadow-md transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <Input label="Judul Proyek" value={port.judul} onChange={(e) => updateItem(port.id, 'judul', e.target.value)} placeholder="Nama Proyek" className="text-lg font-bold" />
                        
                        <Input 
                            label="Link Gambar Utama (Cover)" 
                            value={port.gambar_url} 
                            onChange={(e) => updateItem(port.id, 'gambar_url', e.target.value)} 
                            placeholder="https://..." 
                            icon={<ImageIcon className="w-4 h-4"/>}
                        />
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Deskripsi Proyek</label>
                            <textarea 
                                className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm leading-relaxed" 
                                rows={4} 
                                placeholder="Jelaskan tentang proyek ini..."
                                value={port.deskripsi} 
                                onChange={(e) => updateItem(port.id, 'deskripsi', e.target.value)}
                            />
                        </div>
                        
                        <Input label="Link Eksternal / Demo" value={port.tautan_eksternal} onChange={(e) => updateItem(port.id, 'tautan_eksternal', e.target.value)} placeholder="https://..." icon={<Globe className="w-4 h-4"/>} />

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4">Galeri Tambahan</label>
                            <div className="space-y-4">
                                {port.galeri_url?.map((url, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-16 h-12 shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                            {url ? <img src={url} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-5 h-5 text-slate-300"/>}
                                        </div>
                                        <Input 
                                            className="flex-1 bg-white" 
                                            value={url} 
                                            onChange={(e) => updateGalleryImage(port.id, i, e.target.value)} 
                                            placeholder="URL Gambar Galeri..." 
                                        />
                                        <button onClick={() => removeGalleryImage(port.id, i)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all h-12"><X className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addGalleryImage(port.id)} className="w-full border-dashed border-slate-300 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Gambar Galeri
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            <Button variant="outline" onClick={addPortfolio} className="w-full border-dashed border-2 h-14 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 gap-2 text-base font-bold">
                <Plus className="w-5 h-5" /> Tambah Portofolio
            </Button>
        </div>
    );
};
