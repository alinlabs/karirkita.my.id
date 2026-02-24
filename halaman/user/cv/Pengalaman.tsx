
import React, { useState } from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Button } from '../../../komponen/ui/Button';
import { MetricBuilder } from '../../../komponen/ui/MetricBuilder';
import { Combobox } from '../../../komponen/ui/Combobox';
import { Trash2, Plus, X, Image as ImageIcon, Link as LinkIcon, FileText, UserPlus } from 'lucide-react';
import { Pengalaman } from '../../../types';

interface PengalamanProps {
    experiences: Partial<Pengalaman>[];
    setExperiences: (data: any) => void;
}

export const PengalamanCV: React.FC<PengalamanProps> = ({ experiences, setExperiences }) => {
    
    const updateItem = (id: any, field: string, value: any) => {
        setExperiences(experiences.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const updateReference = (id: any, field: string, value: any) => {
        setExperiences(experiences.map(item => {
            if (item.id !== id) return item;
            const currentRef = item.referensi || { nama: '', posisi: '', kontak: '', tipe_kontak: 'email' };
            return { ...item, referensi: { ...currentRef, [field]: value } };
        }));
    };

    const removeItem = (id: any) => {
        setExperiences(experiences.filter(item => item.id !== id));
    };

    const addExperience = () => {
        setExperiences([...experiences, { 
            id: `exp-${Date.now()}`, posisi: '', nama_perusahaan: '', 
            logo_perusahaan_url: '', tanggal_mulai: '', tanggal_selesai: '', 
            deskripsi: '', tanggung_jawab: [''], metrik: [],
            sosial_media_perusahaan: '', tautan_paklaring: '',
            referensi: { nama: '', posisi: '', kontak: '', tipe_kontak: 'email' }
        }]);
    };

    const updateSubList = (itemId: any, field: string, index: number, value: string) => {
        setExperiences(experiences.map(item => {
            if (item.id !== itemId) return item;
            const newList = [...(item[field as keyof Pengalaman] as string[] || [])];
            newList[index] = value;
            return { ...item, [field]: newList };
        }));
    };

    const addSubListItem = (itemId: any, field: string) => {
        setExperiences(experiences.map(item => {
            if (item.id !== itemId) return item;
            const currentList = item[field as keyof Pengalaman] as string[] || [];
            return { ...item, [field]: [...currentList, ''] };
        }));
    };

    const removeSubListItem = (itemId: any, field: string, index: number) => {
        setExperiences(experiences.map(item => {
            if (item.id !== itemId) return item;
            const currentList = item[field as keyof Pengalaman] as string[] || [];
            return { ...item, [field]: currentList.filter((_:any, i:number) => i !== index) };
        }));
    };

    const contactTypeOptions = [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {experiences.map((exp) => (
                <Card key={exp.id} className="p-6 md:p-8 relative group border-slate-200 hover:border-blue-200 transition-all rounded-[2rem] shadow-sm hover:shadow-md">
                    <button onClick={() => removeItem(exp.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all z-10"><Trash2 className="w-5 h-5" /></button>
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Left: Big Logo Input Preview */}
                        <div className="w-full md:w-32 shrink-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                            <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group/img">
                                {exp.logo_perusahaan_url ? (
                                    <img src={exp.logo_perusahaan_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Preview</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Main Inputs */}
                        <div className="flex-1 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Posisi" value={exp.posisi} onChange={(e) => updateItem(exp.id, 'posisi', e.target.value)} placeholder="Contoh: Senior Designer" />
                                <Input label="Perusahaan" value={exp.nama_perusahaan} onChange={(e) => updateItem(exp.id, 'nama_perusahaan', e.target.value)} placeholder="Contoh: Gojek" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input 
                                    label="Link Logo Perusahaan" 
                                    value={exp.logo_perusahaan_url} 
                                    onChange={(e) => updateItem(exp.id, 'logo_perusahaan_url', e.target.value)} 
                                    placeholder="https://..." 
                                    icon={<ImageIcon className="w-4 h-4"/>}
                                />
                                <Input 
                                    label="Sosial Media Perusahaan" 
                                    value={exp.sosial_media_perusahaan} 
                                    onChange={(e) => updateItem(exp.id, 'sosial_media_perusahaan', e.target.value)} 
                                    placeholder="Instagram / LinkedIn URL" 
                                    icon={<LinkIcon className="w-4 h-4"/>}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Mulai (Tahun)" value={exp.tanggal_mulai} onChange={(e) => updateItem(exp.id, 'tanggal_mulai', e.target.value)} placeholder="2020" type="number" />
                                <Input label="Selesai (Tahun)" value={exp.tanggal_selesai} onChange={(e) => updateItem(exp.id, 'tanggal_selesai', e.target.value)} placeholder="Present / 2024" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Singkat</label>
                        <textarea 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                            rows={3} 
                            placeholder="Ringkasan umum tentang peran Anda..."
                            value={exp.deskripsi}
                            onChange={(e) => updateItem(exp.id, 'deskripsi', e.target.value)}
                        />
                    </div>

                    <div className="mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            Detail Pekerjaan (Bullet Points)
                        </label>
                        <div className="space-y-3">
                            {exp.tanggung_jawab?.map((tj, i) => (
                                <div key={i} className="flex gap-3 items-center group/item">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 group-focus-within/item:bg-blue-500 transition-colors shrink-0"></div>
                                    <Input 
                                        className="bg-white h-11" 
                                        placeholder="Tulis tanggung jawab atau pencapaian..." 
                                        value={tj} 
                                        onChange={(e) => updateSubList(exp.id, 'tanggung_jawab', i, e.target.value)}
                                    />
                                    <button onClick={() => removeSubListItem(exp.id, 'tanggung_jawab', i)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X className="w-5 h-5"/></button>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" onClick={() => addSubListItem(exp.id, 'tanggung_jawab')} className="text-blue-600 font-bold hover:bg-blue-50">
                                + Tambah Poin Pekerjaan
                            </Button>
                        </div>
                    </div>

                    {/* DOKUMEN & REFERENSI - STACKED VERTICALLY */}
                    <div className="space-y-6 mb-6">
                        {/* 1. Dokumen Pendukung */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-orange-500" /> Dokumen Pendukung
                            </label>
                            <Input 
                                label="Link Paklaring (Drive/Cloud)" 
                                value={exp.tautan_paklaring} 
                                onChange={(e) => updateItem(exp.id, 'tautan_paklaring', e.target.value)} 
                                placeholder="https://drive.google.com/..." 
                                className="bg-white"
                            />
                        </div>

                        {/* 2. Kontak Referensi */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-green-500" /> Kontak Referensi
                            </label>
                            <div className="space-y-4">
                                <Input 
                                    label="Nama Referensi"
                                    placeholder="Contoh: Budi Santoso (Atasan)" 
                                    value={exp.referensi?.nama} 
                                    onChange={(e) => updateReference(exp.id, 'nama', e.target.value)}
                                    className="bg-white" 
                                />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Jabatan"
                                        placeholder="Contoh: CTO" 
                                        value={exp.referensi?.posisi} 
                                        onChange={(e) => updateReference(exp.id, 'posisi', e.target.value)}
                                        className="bg-white" 
                                    />
                                    <div className="flex gap-2">
                                        <div className="w-1/3">
                                            <Combobox 
                                                label="Tipe"
                                                options={contactTypeOptions}
                                                value={exp.referensi?.tipe_kontak}
                                                onChange={(val) => updateReference(exp.id, 'tipe_kontak', val)}
                                                placeholder="Tipe"
                                                className="bg-white"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input 
                                                label="Kontak"
                                                placeholder="Email / No. HP" 
                                                value={exp.referensi?.kontak} 
                                                onChange={(e) => updateReference(exp.id, 'kontak', e.target.value)}
                                                className="bg-white" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METRIC BUILDER */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <MetricBuilder 
                            metrics={exp.metrik || []} 
                            onChange={(newMetrics) => updateItem(exp.id, 'metrik', newMetrics)} 
                        />
                    </div>

                </Card>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full border-dashed border-2 h-14 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 gap-2 text-base font-bold">
                <Plus className="w-5 h-5" /> Tambah Pengalaman
            </Button>
        </div>
    );
};
