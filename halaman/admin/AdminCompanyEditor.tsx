import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { ImageUrlInput } from '../../komponen/ui/ImageUrlInput';
import { StringListInput } from '../../komponen/ui/StringListInput';
import { Combobox } from '../../komponen/ui/Combobox';
import { ArrowLeft, Save, Layout, FileText, Share2, Award, Zap, MapPin, Phone, Globe, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { Perusahaan } from '../../types';
import { cn } from '../../utils/cn';
import { SmartImport } from '../../komponen/admin/SmartImport';

export const AdminCompanyEditor = () => {
  const { id } = useParams(); // 'new' or companyId
  const navigate = useNavigate();
  const { companies, addCompany } = useData(); 
  const { toast, showToast } = useToast();
  const isNew = id === 'new' || !id;

  const [activeTab, setActiveTab] = useState<'info' | 'details' | 'media' | 'contact'>('info');
  const [formData, setFormData] = useState<Partial<Perusahaan>>({
      nama: '', industri: '', ukuran_perusahaan: '', lokasi: '',
      deskripsi: '', website_url: '', email_kontak: '',
      logo_url: '', banner_url: '',
      promosi: false,
      verifikasi: 'proses',
      provinsi: '', kota: '', kecamatan: '', kelurahan: '', jalan: '', kode_pos: '',
      nomor_telepon: '', fax: '', whatsapp: '',
      visi: '', misi: '',
      teknologi: [], galeri: [],
      tagline: '', tahun_berdiri: ''
  });

  useEffect(() => {
      if (!isNew) {
          const found = companies.find(c => c.perusahaan_id === id);
          if (found) setFormData(found);
      }
  }, [id, companies, isNew]);

  const handleChange = (field: keyof Perusahaan, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartImport = (data: any) => {
      setFormData(prev => ({
          ...prev,
          ...data,
          perusahaan_id: prev.perusahaan_id,
          slug: prev.slug,
          teknologi: Array.isArray(data.teknologi) ? data.teknologi : prev.teknologi
      }));
      showToast({ message: 'Data berhasil diekstrak!', type: 'success' });
  };

  const handleSave = () => {
      if (!formData.nama) return showToast({ message: 'Nama Perusahaan wajib diisi', type: 'error' });
      
      // Compute full location string
      const computedLocation = [formData.kota, formData.provinsi].filter(Boolean).join(', ') || formData.lokasi || '';

      const payload: Perusahaan = {
          ...formData,
          perusahaan_id: formData.perusahaan_id || `c-${Date.now()}`,
          slug: formData.slug || formData.nama.toLowerCase().replace(/\s+/g, '-'),
          nama: formData.nama,
          deskripsi: formData.deskripsi || '',
          logo_url: formData.logo_url || '',
          banner_url: formData.banner_url || '',
          website_url: formData.website_url || '',
          industri: formData.industri || 'Teknologi',
          ukuran_perusahaan: formData.ukuran_perusahaan || '10-50',
          lokasi: computedLocation,
          teknologi: formData.teknologi || [],
          galeri: formData.galeri || [],
          updated_at: Date.now()
      } as Perusahaan;

      if (isNew) {
          addCompany(payload);
          showToast({ message: 'Perusahaan berhasil dibuat', type: 'success' });
      } else {
          addCompany(payload);
          showToast({ message: 'Perubahan disimpan', type: 'success' });
      }
      setTimeout(() => navigate('/admin/companies'), 1000);
  };

  const verificationOptions = [
      { label: 'Dalam Proses', value: 'proses' },
      { label: 'Terverifikasi', value: 'disetujui' },
      { label: 'Ditolak', value: 'ditolak' }
  ];

  const sizeOptions = [
      { label: '1-10 Karyawan', value: '1-10' },
      { label: '11-50 Karyawan', value: '11-50' },
      { label: '51-200 Karyawan', value: '51-200' },
      { label: '201-500 Karyawan', value: '201-500' },
      { label: '500+ Karyawan', value: '500+' }
  ];

  return (
    <div className="pb-20 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full">
              <button onClick={() => navigate('/admin/companies')} className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm border border-transparent hover:border-slate-200">
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                  <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Tambah Perusahaan' : 'Edit Perusahaan'}</h1>
                  <p className="text-slate-500 text-sm">{formData.nama || 'Entitas Baru'}</p>
              </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button onClick={handleSave} className="shadow-lg shadow-blue-600/20 w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
              </Button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm sticky top-24">
                  {[
                      { id: 'info', label: 'Informasi Dasar', icon: Layout },
                      { id: 'details', label: 'Detail & Visi', icon: FileText },
                      { id: 'media', label: 'Logo & Media', icon: Zap },
                      { id: 'contact', label: 'Kontak & Lokasi', icon: MapPin },
                  ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1",
                            activeTab === tab.id 
                                ? "bg-blue-50 text-blue-600 shadow-sm" 
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        )}
                      >
                          <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                  ))}
              </div>

              {/* Status Card */}
              <Card className="p-4 rounded-2xl border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status Verifikasi</h4>
                  <Combobox 
                      label=""
                      options={verificationOptions}
                      value={formData.verifikasi}
                      onChange={(val) => handleChange('verifikasi', val)}
                  />
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Promoted</span>
                      <input 
                        type="checkbox" 
                        checked={!!formData.promosi} 
                        onChange={(e) => handleChange('promosi', e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                  </div>
              </Card>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-3 space-y-6">
              {/* Smart Import Section */}
              <SmartImport type="company" onAnalyze={handleSmartImport} />

              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm min-h-[500px]">
                  {activeTab === 'info' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                              <Layout className="w-5 h-5 text-blue-600" />
                              <h3 className="font-bold text-lg text-slate-800">Informasi Dasar</h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <Input label="Nama Perusahaan" value={formData.nama} onChange={e => handleChange('nama', e.target.value)} required className="font-bold" />
                              <Input label="Tagline / Slogan" value={formData.tagline} onChange={e => handleChange('tagline', e.target.value)} placeholder="Innovating the Future" />
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                              <Input label="Industri" value={formData.industri} onChange={e => handleChange('industri', e.target.value)} placeholder="Ex: Teknologi" />
                              <Combobox 
                                  label="Ukuran Perusahaan"
                                  options={sizeOptions}
                                  value={formData.ukuran_perusahaan}
                                  onChange={(val) => handleChange('ukuran_perusahaan', val)}
                              />
                              <Input label="Tahun Berdiri" value={formData.tahun_berdiri} onChange={e => handleChange('tahun_berdiri', e.target.value)} placeholder="2010" />
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Perusahaan</label>
                              <textarea 
                                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm min-h-[150px] leading-relaxed"
                                value={formData.deskripsi}
                                onChange={e => handleChange('deskripsi', e.target.value)}
                                placeholder="Ceritakan tentang perusahaan, budaya kerja, dan apa yang kalian kerjakan..."
                              />
                          </div>
                      </div>
                  )}

                  {activeTab === 'details' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                              <FileText className="w-5 h-5 text-purple-600" />
                              <h3 className="font-bold text-lg text-slate-800">Visi, Misi & Teknologi</h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">Visi</label>
                                  <textarea 
                                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm min-h-[100px]"
                                    value={formData.visi}
                                    onChange={e => handleChange('visi', e.target.value)}
                                    placeholder="Visi jangka panjang perusahaan..."
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">Misi</label>
                                  <textarea 
                                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm min-h-[100px]"
                                    value={formData.misi}
                                    onChange={e => handleChange('misi', e.target.value)}
                                    placeholder="Misi dan langkah-langkah perusahaan..."
                                  />
                              </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-sm font-bold text-slate-900 mb-4">Teknologi & Stack</h4>
                              <StringListInput 
                                  label="Daftar Teknologi (Tech Stack)" 
                                  items={formData.teknologi || []} 
                                  onChange={(items) => handleChange('teknologi', items)}
                                  placeholder="React, Node.js, AWS..."
                              />
                          </div>
                      </div>
                  )}

                  {activeTab === 'media' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                              <Zap className="w-5 h-5 text-yellow-600" />
                              <h3 className="font-bold text-lg text-slate-800">Media & Branding</h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <ImageUrlInput label="URL Logo Perusahaan" value={formData.logo_url} onChange={e => handleChange('logo_url', e.target.value)} />
                              <ImageUrlInput label="URL Banner Profil" value={formData.banner_url} onChange={e => handleChange('banner_url', e.target.value)} />
                          </div>
                          
                          <Input label="Video Profil (YouTube Embed URL)" value={formData.video_profil} onChange={e => handleChange('video_profil', e.target.value)} placeholder="https://youtube.com/embed/..." />

                          <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-sm font-bold text-slate-900 mb-4">Galeri Foto</h4>
                              <StringListInput 
                                  label="URL Foto Galeri" 
                                  items={formData.galeri || []} 
                                  onChange={(items) => handleChange('galeri', items)}
                                  placeholder="https://example.com/image.jpg"
                              />
                          </div>
                      </div>
                  )}

                  {activeTab === 'contact' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                              <MapPin className="w-5 h-5 text-red-600" />
                              <h3 className="font-bold text-lg text-slate-800">Kontak & Lokasi</h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                              <Input label="Website Resmi" value={formData.website_url} onChange={e => handleChange('website_url', e.target.value)} placeholder="https://..." />
                              <Input label="Email Kontak" value={formData.email_kontak} onChange={e => handleChange('email_kontak', e.target.value)} />
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                              <Input label="Nomor Telepon" value={formData.nomor_telepon} onChange={e => handleChange('nomor_telepon', e.target.value)} />
                              <Input label="WhatsApp" value={formData.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} />
                              <Input label="Fax" value={formData.fax} onChange={e => handleChange('fax', e.target.value)} />
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-sm font-bold text-slate-900 mb-4">Alamat Lengkap</h4>
                              <div className="grid md:grid-cols-2 gap-6 mb-4">
                                  <Input label="Provinsi" value={formData.provinsi} onChange={e => handleChange('provinsi', e.target.value)} />
                                  <Input label="Kota/Kabupaten" value={formData.kota} onChange={e => handleChange('kota', e.target.value)} />
                              </div>
                              <div className="grid md:grid-cols-2 gap-6 mb-4">
                                  <Input label="Kecamatan" value={formData.kecamatan} onChange={e => handleChange('kecamatan', e.target.value)} />
                                  <Input label="Kelurahan" value={formData.kelurahan} onChange={e => handleChange('kelurahan', e.target.value)} />
                              </div>
                              <div className="grid md:grid-cols-3 gap-6">
                                  <div className="md:col-span-2">
                                      <Input label="Jalan / Gedung" value={formData.jalan} onChange={e => handleChange('jalan', e.target.value)} />
                                  </div>
                                  <Input label="Kode Pos" value={formData.kode_pos} onChange={e => handleChange('kode_pos', e.target.value)} />
                              </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-sm font-bold text-slate-900 mb-4">Sosial Media</h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                  <Input label="LinkedIn" value={formData.linkedin} onChange={e => handleChange('linkedin', e.target.value)} />
                                  <Input label="Instagram" value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} />
                                  <Input label="Facebook" value={formData.facebook} onChange={e => handleChange('facebook', e.target.value)} />
                              </div>
                          </div>
                      </div>
                  )}
              </Card>
          </div>
      </div>
    </div>
  );
};
