
import React from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Button } from '../../../komponen/ui/Button';
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Organisasi } from '../../../types';

interface OrganisasiProps {
    organizations: Partial<Organisasi>[];
    setOrganizations: (data: any) => void;
}

export const OrganisasiCV: React.FC<OrganisasiProps> = ({ organizations, setOrganizations }) => {
    
    const updateItem = (id: any, field: string, value: any) => {
        setOrganizations(organizations.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id: any) => {
        setOrganizations(organizations.filter(item => item.id !== id));
    };

    const addOrganization = () => {
        setOrganizations([...organizations, { 
            id: `org-${Date.now()}`, nama_organisasi: '', logo_url: '', 
            peran: '', tanggal_mulai: '', tanggal_selesai: '', deskripsi: '', tautan_sertifikat: ''
        }]);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {organizations.map((org) => (
                <Card key={org.id} className="p-6 md:p-8 relative border-slate-200 hover:border-blue-200 transition-all rounded-[2rem] shadow-sm hover:shadow-md">
                    <button onClick={() => removeItem(org.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all z-10"><Trash2 className="w-5 h-5" /></button>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                        {/* Left: Big Logo */}
                        <div className="w-full md:w-32 shrink-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                            <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                {org.logo_url ? (
                                    <img src={org.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                        </div>

                        {/* Right: Inputs */}
                        <div className="flex-1 space-y-4">
                            <Input label="Nama Organisasi" value={org.nama_organisasi} onChange={(e) => updateItem(org.id, 'nama_organisasi', e.target.value)} placeholder="Nama Organisasi" />
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input 
                                    label="Link Logo Organisasi" 
                                    value={org.logo_url} 
                                    onChange={(e) => updateItem(org.id, 'logo_url', e.target.value)} 
                                    placeholder="https://..." 
                                    icon={<ImageIcon className="w-4 h-4"/>}
                                />
                                <Input 
                                    label="Link SK / Sertifikat" 
                                    value={org.tautan_sertifikat} 
                                    onChange={(e) => updateItem(org.id, 'tautan_sertifikat', e.target.value)} 
                                    placeholder="URL Bukti..." 
                                    icon={<LinkIcon className="w-4 h-4"/>}
                                />
                            </div>

                            <Input label="Peran" value={org.peran} onChange={(e) => updateItem(org.id, 'peran', e.target.value)} placeholder="Contoh: Ketua Divisi" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Mulai (Tahun)" type="number" value={org.tanggal_mulai} onChange={(e) => updateItem(org.id, 'tanggal_mulai', e.target.value)} placeholder="2020" />
                                <Input label="Selesai (Tahun)" value={org.tanggal_selesai} onChange={(e) => updateItem(org.id, 'tanggal_selesai', e.target.value)} placeholder="2022" />
                            </div>
                        </div>
                    </div>

                    <textarea 
                        className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        rows={3}
                        placeholder="Deskripsi kegiatan atau tanggung jawab..." 
                        value={org.deskripsi} 
                        onChange={(e) => updateItem(org.id, 'deskripsi', e.target.value)} 
                    />
                </Card>
            ))}
            <Button variant="outline" onClick={addOrganization} className="w-full border-dashed border-2 h-14 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 gap-2 text-base font-bold">
                <Plus className="w-5 h-5" /> Tambah Organisasi
            </Button>
        </div>
    );
};
