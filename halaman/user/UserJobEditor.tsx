
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { Combobox } from '../../komponen/ui/Combobox';
import { CurrencyInput } from '../../komponen/ui/CurrencyInput';
import { ImageUrlInput } from '../../komponen/ui/ImageUrlInput';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Sparkles, CheckCircle, HelpCircle, Save, Star, Image as ImageIcon } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { slugify } from '../../utils/slugify';

import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

export const UserJobEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast, showToast } = useToast();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);

  // Master Options State
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [jobLevels, setJobLevels] = useState<any[]>([]);
  const [workModes, setWorkModes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
      title: "",
      slug: "", // Added explicit slug state for preview/edit
      type: '',
      level: '',
      location: '',
      workMode: '',
      salary: '',
      description: '',
      banner_url: ''
  });

  const [requirements, setRequirements] = useState<string[]>(['']);
  const [facilities, setFacilities] = useState<string[]>(['']);

  // Load Options & Data
  useEffect(() => {
    // 1. Fetch Options
    routingData.getMasterOptions().then(data => {
        // Map from {label, nilai} to {label, value}
        if(data.tipePekerjaan) setJobTypes(data.tipePekerjaan.map((x: any) => ({label: x.label, value: x.nilai})));
        if(data.levelPekerjaan) setJobLevels(data.levelPekerjaan.map((x: any) => ({label: x.label, value: x.nilai})));
        if(data.modeKerja) setWorkModes(data.modeKerja.map((x: any) => ({label: x.label, value: x.nilai})));
    });

    // 2. Fetch Job Details if Edit Mode
    if (isEditMode) {
        routingData.getJobs().then(jobs => {
            const foundJob = jobs.find(j => j.lowongan_id === id);
            if (foundJob) {
                setFormData({
                    title: foundJob.posisi,
                    slug: foundJob.slug,
                    type: foundJob.tipe_pekerjaan,
                    level: '', // foundJob.level_pekerjaan removed. Set default empty or handle logic.
                    location: foundJob.lokasi, // lokasi_kerja -> lokasi
                    workMode: 'On-Site (WFO)', // Default fallback if missing
                    salary: foundJob.rentang_gaji || '',
                    description: foundJob.deskripsi_pekerjaan,
                    banner_url: foundJob.banner || '' // banner_url -> banner
                });
                if (foundJob.kualifikasi && foundJob.kualifikasi.length > 0) {
                    setRequirements(foundJob.kualifikasi);
                }
                if (foundJob.fasilitas && foundJob.fasilitas.length > 0) {
                    setFacilities(foundJob.fasilitas);
                }
            }
        });
    }
  }, [isEditMode, id]);

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...requirements];
    newReqs[index] = value;
    setRequirements(newReqs);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newReqs = requirements.filter((_, i) => i !== index);
      setRequirements(newReqs);
    }
  };

  const addFacility = () => {
    setFacilities([...facilities, '']);
  };

  const updateFacility = (index: number, value: string) => {
    const newFacs = [...facilities];
    newFacs[index] = value;
    setFacilities(newFacs);
  };

  const removeFacility = (index: number) => {
    if (facilities.length > 1) {
      const newFacs = facilities.filter((_, i) => i !== index);
      setFacilities(newFacs);
    }
  };

  const handleChange = (field: string, value: any) => {
      // Auto-generate slug when title changes, ONLY if not in edit mode (to preserve existing slugs)
      if (field === 'title' && !isEditMode) {
          setFormData(prev => ({ 
              ...prev, 
              [field]: value,
              slug: slugify(value)
          }));
      } else {
          setFormData(prev => ({ ...prev, [field]: value }));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const [kota, provinsi] = formData.location.split(',').map(s => s.trim());
        
        const payload: any = {
            posisi: formData.title,
            slug: formData.slug || slugify(formData.title),
            tipe_pekerjaan: formData.type,
            // level_pekerjaan: formData.level, 
            kota: kota || formData.location, // Fallback to full string if no comma
            provinsi: provinsi || '',
            // mode_kerja: formData.workMode, 
            rentang_gaji: formData.salary,
            deskripsi_pekerjaan: formData.description,
            banner: formData.banner_url,
            kualifikasi: requirements.filter(r => r.trim() !== ''),
            fasilitas: facilities.filter(f => f.trim() !== ''),
            status: isEditMode ? 'Active' : 'Draft', 
            updated_at: Date.now()
        };

        if (isEditMode && id) {
            await routingData.updateJob(id, payload);
            showToast({ message: 'Lowongan berhasil diperbarui', type: 'success' });
        } else {
            // For new job, we need company ID. 
            const userId = user?.id || 'user-001';
            let myCompany;
            
            // Try to find company for current user
            const companies = await routingData.getUserCompany(userId);
            if (companies && companies.length > 0) {
                myCompany = companies[0];
            } else if (userId === 'user-001') {
                // Fallback for demo user
                const c1Data = await routingData.getCompanies('c1');
                if (c1Data && c1Data.length > 0) myCompany = c1Data[0];
            }
            
            if (myCompany) {
                payload.perusahaan_id = myCompany.perusahaan_id;
                payload.created_at = Date.now();
                await routingData.createJob(payload);
                showToast({ message: 'Lowongan berhasil dibuat', type: 'success' });
            } else {
                 showToast({ message: 'Anda belum memiliki profil perusahaan. Silakan buat terlebih dahulu.', type: 'error' });
                 setIsLoading(false);
                 return;
            }
        }
        
        navigate('/user/jobs');
    } catch (error) {
        console.error("Failed to save job", error);
        showToast({ message: 'Gagal menyimpan lowongan', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full pb-10">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" className="pl-0 -ml-2 text-slate-500 hover:bg-transparent hover:text-blue-600" onClick={() => navigate('/user/jobs')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
                </Button>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Lowongan Kerja' : 'Buat Lowongan Baru'}
            </h1>
            <p className="text-slate-500">
                {isEditMode ? 'Perbarui informasi lowongan yang sudah ada.' : 'Isi formulir lengkap untuk menarik kandidat terbaik.'}
            </p>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                 <p className="text-sm font-medium text-slate-700">{isEditMode ? 'Published' : 'Draft'}</p>
             </div>
             <Button variant="outline" className="border-slate-200">
                <Save className="w-4 h-4 mr-2" /> Simpan Draft
             </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* Main Form Area */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Bagian 1: Informasi Dasar */}
            <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">1</span>
                      Detail Utama
                  </h3>
                  <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
              </div>
              <div className="p-6 space-y-5">
                <Input 
                    label="Judul Posisi" 
                    placeholder="Contoh: Senior Marketing Manager" 
                    className="h-12 text-lg" 
                    required 
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
                
                {/* Slug Preview Field (Read Only or Editable if needed) */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center">
                    <span className="font-bold uppercase tracking-wider shrink-0">URL Preview:</span>
                    <span className="font-mono text-slate-700 break-all">karirkita.my.id/pekerjaan/<span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{formData.slug}</span></span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                    <Combobox 
                        label="Tipe Pekerjaan"
                        options={jobTypes}
                        value={formData.type}
                        onChange={(val) => handleChange('type', val)}
                        placeholder="Pilih Tipe"
                    />
                    <Combobox 
                        label="Level Senioritas"
                        options={jobLevels}
                        value={formData.level}
                        onChange={(val) => handleChange('level', val)}
                        placeholder="Pilih Level"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <Input 
                        label="Lokasi Kerja" 
                        placeholder="Jakarta Selatan" 
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                    <Combobox 
                        label="Sistem Kerja"
                        options={workModes}
                        value={formData.workMode}
                        onChange={(val) => handleChange('workMode', val)}
                        placeholder="Pilih Mode"
                    />
                </div>

                {/* Banner Input */}
                <ImageUrlInput 
                    label="Link Sampul Lowongan (Banner)"
                    placeholder="https://..."
                    value={formData.banner_url}
                    onChange={(e) => handleChange('banner_url', e.target.value)}
                    onClear={() => handleChange('banner_url', '')}
                />
              </div>
            </Card>
            
            {/* Bagian 2: Gaji & Deskripsi */}
            <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">2</span>
                      Gaji & Deskripsi
                  </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 gap-5">
                    <CurrencyInput 
                        label="Gaji Bulanan (IDR)"
                        value={formData.salary}
                        onChange={(val) => handleChange('salary', val)}
                    />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Mencantumkan nominal gaji yang jelas meningkatkan <strong>minat pelamar hingga 40%</strong>.</span>
                </div>
                
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Pekerjaan</label>
                    <textarea 
                    rows={8} 
                    className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 leading-relaxed" 
                    placeholder="Jelaskan tanggung jawab sehari-hari, budaya tim, dan apa yang diharapkan dari kandidat secara mendetail..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    ></textarea>
                </div>
              </div>
            </Card>

            {/* Bagian 3: Requirements */}
            <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">3</span>
                        Kualifikasi (Requirements)
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex gap-3 group">
                                <div className="mt-3 w-1.5 h-1.5 rounded-full bg-slate-300 group-focus-within:bg-blue-500 transition-colors"></div>
                                <input 
                                    type="text" 
                                    className="flex-1 h-11 px-0 border-b border-slate-200 outline-none focus:border-blue-500 transition-all bg-transparent placeholder:text-slate-300"
                                    placeholder={`Tulis kualifikasi poin ${index + 1}`}
                                    value={req}
                                    onChange={(e) => updateRequirement(index, e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeRequirement(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    disabled={requirements.length === 1}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={addRequirement} className="mt-6 text-blue-600 hover:bg-blue-50">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Poin Kualifikasi
                    </Button>
                </div>
            </Card>

            {/* Bagian 4: Facilities (Benefits) */}
            <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">4</span>
                        Fasilitas & Benefit
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {facilities.map((fac, index) => (
                            <div key={index} className="flex gap-3 group">
                                <div className="mt-3 w-1.5 h-1.5 rounded-full bg-green-300 group-focus-within:bg-green-500 transition-colors"></div>
                                <input 
                                    type="text" 
                                    className="flex-1 h-11 px-0 border-b border-slate-200 outline-none focus:border-green-500 transition-all bg-transparent placeholder:text-slate-300"
                                    placeholder={`Benefit ${index + 1} (contoh: BPJS, Makan Siang)`}
                                    value={fac}
                                    onChange={(e) => updateFacility(index, e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeFacility(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    disabled={facilities.length === 1}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={addFacility} className="mt-6 text-green-600 hover:bg-green-50">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Benefit
                    </Button>
                </div>
            </Card>
          </div>

          {/* Sidebar Tips */}
          <div className="xl:col-span-1 space-y-6 sticky top-28">
             <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Review Singkat</h3>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Kredit Posting</span>
                        <span className="font-bold text-green-600">Gratis (3/3)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Durasi Tayang</span>
                        <span className="font-bold text-slate-900">30 Hari</span>
                    </div>
                </div>
                <div className="pt-6 space-y-3">
                    <Button size="lg" className="w-full shadow-lg shadow-blue-600/20" isLoading={isLoading}>
                        {isEditMode ? 'Perbarui Lowongan' : 'Terbitkan Sekarang'}
                    </Button>
                    <Button size="lg" variant="outline" type="button" onClick={() => navigate('/user/jobs')} className="w-full">
                        Batal
                    </Button>
                </div>
             </Card>

             <Card className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-lg">
               <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                   <Sparkles className="w-5 h-5" /> Pro Tips
               </h3>
               <ul className="space-y-4 text-sm text-blue-100">
                 <li className="flex gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0 text-green-400" />
                    <span><strong>Judul Spesifik:</strong> Gunakan "Frontend Developer" daripada "Web Wizard" agar mudah dicari.</span>
                 </li>
                 <li className="flex gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0 text-green-400" />
                    <span><strong>Benefit:</strong> Cantumkan fasilitas menarik untuk meningkatkan pelamar berkualitas.</span>
                 </li>
               </ul>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
