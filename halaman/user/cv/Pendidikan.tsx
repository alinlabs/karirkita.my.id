
import React from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Button } from '../../../komponen/ui/Button';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Pendidikan } from '../../../types';

interface PendidikanProps {
    education: Partial<Pendidikan>[];
    setEducation: (data: any) => void;
}

export const PendidikanCV: React.FC<PendidikanProps> = ({ education, setEducation }) => {
    
    const updateItem = (id: any, field: string, value: any) => {
        setEducation(education.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: any) => {
        setEducation(education.filter(item => item.id !== id));
    };

    const addEducation = () => {
        setEducation([...education, { 
            id: `edu-${Date.now()}`, nama_institusi: '', logo_institusi_url: '',
            gelar: '', bidang_studi: '', tanggal_mulai: '', tanggal_selesai: '' 
        }]);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {education.map((edu) => (
                <Card key={edu.id} className="p-6 md:p-8 relative group border-slate-200 hover:border-blue-200 transition-all rounded-[2rem] shadow-sm hover:shadow-md">
                    <button onClick={() => removeItem(edu.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all z-10"><Trash2 className="w-5 h-5" /></button>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                        {/* Left: Big Logo Preview */}
                        <div className="w-full md:w-32 shrink-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                            <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                {edu.logo_institusi_url ? (
                                    <img src={edu.logo_institusi_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                        </div>

                        {/* Right: Inputs */}
                        <div className="flex-1 space-y-4">
                            <Input label="Nama Institusi" value={edu.nama_institusi} onChange={(e) => updateItem(edu.id, 'nama_institusi', e.target.value)} placeholder="Contoh: Universitas Indonesia" />
                            
                            <Input 
                                label="Link Logo Institusi" 
                                value={edu.logo_institusi_url} 
                                onChange={(e) => updateItem(edu.id, 'logo_institusi_url', e.target.value)} 
                                placeholder="https://..." 
                                icon={<ImageIcon className="w-4 h-4"/>}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Gelar" value={edu.gelar} onChange={(e) => updateItem(edu.id, 'gelar', e.target.value)} placeholder="Contoh: Sarjana Komputer" />
                                <Input label="Bidang Studi" value={edu.bidang_studi} onChange={(e) => updateItem(edu.id, 'bidang_studi', e.target.value)} placeholder="Contoh: Teknik Informatika" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Mulai (Tahun)" value={edu.tanggal_mulai} onChange={(e) => updateItem(edu.id, 'tanggal_mulai', e.target.value)} placeholder="2018" type="number" />
                                <Input label="Selesai (Tahun)" value={edu.tanggal_selesai} onChange={(e) => updateItem(edu.id, 'tanggal_selesai', e.target.value)} placeholder="2022" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full border-dashed border-2 h-14 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 gap-2 text-base font-bold">
                <Plus className="w-5 h-5" /> Tambah Pendidikan
            </Button>
        </div>
    );
};
