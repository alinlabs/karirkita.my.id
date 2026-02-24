
import React from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Button } from '../../../komponen/ui/Button';
import { Combobox } from '../../../komponen/ui/Combobox';
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Sertifikasi } from '../../../types';

interface PrestasiProps {
    achievements: Partial<Sertifikasi>[];
    setAchievements: (data: any) => void;
}

export const PrestasiCV: React.FC<PrestasiProps> = ({ achievements, setAchievements }) => {
    
    const updateItem = (id: any, field: string, value: any) => {
        setAchievements(achievements.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: any) => {
        setAchievements(achievements.filter(item => item.id !== id));
    };

    const addAchievement = () => {
        setAchievements([...achievements, { 
            id: `ach-${Date.now()}`, judul: '', penerbit: '', tanggal: '', 
            deskripsi: '', logo_penerbit: '', tingkat: 'Nasional', tautan_sertifikat: ''
        }]);
    };

    const tingkatOptions = [
        { value: 'Internasional', label: 'Internasional' },
        { value: 'Nasional', label: 'Nasional' },
        { value: 'Provinsi', label: 'Provinsi' },
        { value: 'Lokal / Universitas', label: 'Lokal / Universitas' }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {achievements.map((ach) => (
                <Card key={ach.id} className="p-6 md:p-8 relative border-slate-200 hover:border-blue-200 transition-all rounded-[2rem] shadow-sm hover:shadow-md">
                    <button onClick={() => removeItem(ach.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all z-10"><Trash2 className="w-5 h-5" /></button>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                        {/* Left: Big Logo */}
                        <div className="w-full md:w-32 shrink-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                            <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                {ach.logo_penerbit ? (
                                    <img src={ach.logo_penerbit} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                        </div>

                        {/* Right: Inputs */}
                        <div className="flex-1 space-y-4">
                            <Input label="Nama Penghargaan" value={ach.judul} onChange={(e) => updateItem(ach.id, 'judul', e.target.value)} placeholder="Contoh: Juara 1 Hackathon" />
                            <Input label="Penerbit" value={ach.penerbit} onChange={(e) => updateItem(ach.id, 'penerbit', e.target.value)} placeholder="Contoh: Google" />
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input 
                                    label="Link Logo Penyelenggara" 
                                    value={ach.logo_penerbit} 
                                    onChange={(e) => updateItem(ach.id, 'logo_penerbit', e.target.value)} 
                                    placeholder="https://..." 
                                    icon={<ImageIcon className="w-4 h-4"/>}
                                />
                                <Input 
                                    label="Link Sertifikat / Bukti" 
                                    value={ach.tautan_sertifikat} 
                                    onChange={(e) => updateItem(ach.id, 'tautan_sertifikat', e.target.value)} 
                                    placeholder="Drive / URL..." 
                                    icon={<LinkIcon className="w-4 h-4"/>}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Tahun" type="number" value={ach.tanggal} onChange={(e) => updateItem(ach.id, 'tanggal', e.target.value)} placeholder="2023" />
                                <Combobox 
                                    label="Tingkat" 
                                    value={ach.tingkat} 
                                    onChange={(val) => updateItem(ach.id, 'tingkat', val)} 
                                    options={tingkatOptions}
                                    placeholder="Pilih tingkat"
                                />
                            </div>
                        </div>
                    </div>

                    <textarea 
                        className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        rows={3}
                        placeholder="Deskripsi singkat tentang pencapaian ini..." 
                        value={ach.deskripsi} 
                        onChange={(e) => updateItem(ach.id, 'deskripsi', e.target.value)} 
                    />
                </Card>
            ))}
            <Button variant="outline" onClick={addAchievement} className="w-full border-dashed border-2 h-14 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 gap-2 text-base font-bold">
                <Plus className="w-5 h-5" /> Tambah Prestasi
            </Button>
        </div>
    );
};
