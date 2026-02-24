
import React, { useState, useEffect } from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Input } from '../../../komponen/ui/Input';
import { Combobox } from '../../../komponen/ui/Combobox';
import { PhoneInput } from '../../../komponen/ui/PhoneInput';
import { Bot, Lock, MapPin, Activity, Mail, UserCircle, Video } from 'lucide-react';
import { useWilayah } from '../../../hooks/useWilayah';

interface InfoDasarProps {
    formData: any;
    setFormData: (data: any) => void;
    handleSmartKarirClick: () => void;
    isProUser: boolean;
}

export const InfoDasar: React.FC<InfoDasarProps> = ({
    formData, setFormData, handleSmartKarirClick, isProUser
}) => {
    const { provinces, regencies, districts, villages, fetchRegencies, fetchDistricts, fetchVillages } = useWilayah();
    
    // Local state for IDs to handle API logic
    const [selectedProvId, setSelectedProvId] = useState('');
    const [selectedRegId, setSelectedRegId] = useState('');
    const [selectedDistId, setSelectedDistId] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // Location Handlers
    const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedProvId(id);
        setFormData((prev: any) => ({ ...prev, provinsi: name, kota: '', kecamatan: '', kelurahan: '' }));
        fetchRegencies(id);
    };

    const onRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedRegId(id);
        setFormData((prev: any) => ({ ...prev, kota: name, kecamatan: '', kelurahan: '' }));
        fetchDistricts(id);
    };

    const onDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedDistId(id);
        setFormData((prev: any) => ({ ...prev, kecamatan: name, kelurahan: '' }));
        fetchVillages(id);
    };

    const onVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.options[e.target.selectedIndex].text;
        setFormData((prev: any) => ({ ...prev, kelurahan: name }));
    };
    
    return (
        <div className="space-y-6 animate-fade-in-up">
            <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-xl shadow-slate-200/40">
                <div className="flex items-center gap-2 mb-6">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Informasi Pribadi</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="font-bold text-lg h-14" />
                    </div>
                    
                    <div className="md:col-span-2">
                        <Input label="Headline / Role" name="headline" value={formData.headline} onChange={handleChange} placeholder="Contoh: Frontend Developer" className="h-12" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} />
                        <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} />
                    </div>

                    {/* EMSIFA Location Cascade & Detailed Address */}
                    <div className="md:col-span-2 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600"/> Alamat Domisili</h4>
                        
                        {/* Area Selector (Combobox Style) */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Provinsi</label>
                                <select className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" onChange={onProvinceChange} value={selectedProvId}>
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Kota/Kabupaten</label>
                                <select className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" onChange={onRegencyChange} value={selectedRegId} disabled={!selectedProvId}>
                                    <option value="">Pilih Kota/Kab</option>
                                    {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Kecamatan</label>
                                <select className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" onChange={onDistrictChange} value={selectedDistId} disabled={!selectedRegId}>
                                    <option value="">Pilih Kecamatan</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Kelurahan</label>
                                <select className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" onChange={onVillageChange} disabled={!selectedDistId}>
                                    <option value="">Pilih Kelurahan</option>
                                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Manual Detailed Input */}
                        <div className="space-y-4 pt-4 border-t border-slate-200/60">
                            <Input 
                                label="Nama Jalan / Blok / Nomor Rumah" 
                                name="jalan" 
                                value={formData.jalan} 
                                onChange={handleChange} 
                                placeholder="Jl. Mawar No. 123" 
                                className="bg-white"
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="RT" name="rt" value={formData.rt} onChange={handleChange} placeholder="001" className="bg-white" />
                                <Input label="RW" name="rw" value={formData.rw} onChange={handleChange} placeholder="005" className="bg-white" />
                                <Input label="Kode Pos" name="kode_pos" value={formData.kode_pos} onChange={handleChange} placeholder="41111" className="bg-white" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                        <Input label="Email Kontak" icon={<Mail className="w-4 h-4"/>} name="email_kontak" value={formData.email_kontak} onChange={handleChange} />
                        
                        <PhoneInput 
                            label="No. Telepon"
                            value={formData.telepon_kontak}
                            onChange={(val) => setFormData({...formData, telepon_kontak: val})}
                        />
                    </div>

                    {/* New: Video Profile Input */}
                    <div className="md:col-span-2">
                        <Input 
                            label="Video Profil (Direct .mp4 Link)" 
                            name="video_profil" 
                            value={formData.video_profil || ''} 
                            onChange={handleChange} 
                            placeholder="https://example.com/video.mp4" 
                            icon={<Video className="w-4 h-4 text-purple-500"/>}
                        />
                        <p className="text-[10px] text-slate-500 mt-1 ml-1">
                            *Masukkan link langsung ke file video (.mp4) untuk dijadikan background profil Anda.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <Combobox 
                            label="Status Ketersediaan"
                            value={formData.status_ketersediaan}
                            onChange={(val) => handleSelectChange('status_ketersediaan', val)}
                            options={[
                                { value: 'job_seeking', label: '🟢 Open to Work (Mencari Kerja)' },
                                { value: 'open_for_business', label: '🔵 Open for Business (Buka Jasa)' },
                                { value: 'unavailable', label: '🔴 Off (Tidak Tersedia)' }
                            ]}
                            placeholder="Pilih status saat ini..."
                            icon={<Activity className="w-5 h-5" />}
                        />
                    </div>

                    <div className="md:col-span-2 group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700 group-focus-within:text-blue-600 transition-colors">Bio / Ringkasan Diri</label>
                            <button 
                                type="button" 
                                onClick={handleSmartKarirClick}
                                className="text-xs flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm hover:shadow-purple-500/20"
                            >
                                <Bot className="w-3 h-3" /> {isProUser ? 'Generate with AI' : 'SmartKarir AI (Pro)'}
                                {!isProUser && <Lock className="w-3 h-3 ml-1" />}
                            </button>
                        </div>
                        <textarea 
                            name="tentang_saya" rows={6}
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 font-medium transition-all shadow-sm hover:border-blue-300 leading-relaxed"
                            value={formData.tentang_saya} onChange={handleChange}
                            placeholder="Ceritakan tentang diri Anda, pengalaman, dan tujuan karir..."
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};
