import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { Combobox } from '../../komponen/ui/Combobox';
import { CurrencyInput } from '../../komponen/ui/CurrencyInput';
import { StringListInput } from '../../komponen/ui/StringListInput';
import { ArrowLeft, Save, MapPin, FileText, CheckCircle, Gift, Briefcase, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { Lowongan, TipePekerjaan } from '../../types';
import { SmartImport } from '../../komponen/admin/SmartImport';
import { routingData } from '../../services/routingData';

export const AdminJobEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, companies, addJob } = useData(); 
  const { toast, showToast } = useToast();
  const isNew = id === 'new' || !id;

  const [formData, setFormData] = useState<Partial<Lowongan>>({
      posisi: '', perusahaan_id: '', tipe_pekerjaan: 'Full Time',
      sistem_kerja: 'On-site', sistem_gaji: 'Bulanan',
      lokasi: '', rentang_gaji: '', deskripsi_pekerjaan: '',
      kualifikasi: [], fasilitas: [],
      status: 'Active',
      promosi: false,
      pendidikan_minimal: '',
      maps: '',
      provinsi: '', kota: '', kecamatan: '', kelurahan: '', jalan: '', kode_pos: '',
      jenis_submit: 'karirkita',
      kontak: []
  });

  const [masterOptions, setMasterOptions] = useState<any>({});

  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const opts = await routingData.getMasterOptions();
            setMasterOptions(opts || {});
        } catch (e) {
            console.error("Failed to fetch options", e);
        }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
      if (!isNew) {
          const found = jobs.find(j => j.lowongan_id === id);
          if (found) {
              setFormData({
                  ...found,
                  jenis_submit: found.jenis_submit || 'karirkita',
                  kontak: found.kontak || []
              });
          }
      }
  }, [id, jobs, isNew]);

  const handleChange = (field: keyof Lowongan, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
      const newContacts = [...(formData.kontak || [])];
      newContacts[index] = { ...newContacts[index], [field]: value };
      setFormData(prev => ({ ...prev, kontak: newContacts }));
  };

  const addContact = () => {
      setFormData(prev => ({
          ...prev,
          kontak: [...(prev.kontak || []), { atas_nama: '', tipe: 'whatsapp', nilai: '' }]
      }));
  };

  const removeContact = (index: number) => {
      const newContacts = [...(formData.kontak || [])];
      newContacts.splice(index, 1);
      setFormData(prev => ({ ...prev, kontak: newContacts }));
  };

  const handleSmartImport = (data: any) => {
      setFormData(prev => ({
          ...prev,
          ...data,
          // Preserve ID/Slug/CompanyID if they exist
          lowongan_id: prev.lowongan_id,
          slug: prev.slug,
          perusahaan_id: prev.perusahaan_id,
          // Ensure arrays are arrays
          kualifikasi: Array.isArray(data.kualifikasi) ? data.kualifikasi : prev.kualifikasi,
          fasilitas: Array.isArray(data.fasilitas) ? data.fasilitas : prev.fasilitas
      }));
      showToast({ message: 'Data berhasil diekstrak dari gambar!', type: 'success' });
  };

  const handleSave = async () => {
      if (!formData.posisi || !formData.perusahaan_id) {
          return showToast({ message: 'Posisi dan Perusahaan wajib diisi', type: 'error' });
      }

      const selectedCompany = companies.find(c => c.perusahaan_id === formData.perusahaan_id);
      
      // Compute full location string if address parts are present
      const computedLocation = [formData.kota, formData.provinsi].filter(Boolean).join(', ') || formData.lokasi || '';

      const payload: Lowongan = {
          ...formData,
          lowongan_id: formData.lowongan_id || `j-${Date.now()}`,
          slug: formData.slug || formData.posisi.toLowerCase().replace(/\s+/g, '-'),
          perusahaan: selectedCompany || {} as any,
          lokasi: computedLocation,
          kualifikasi: formData.kualifikasi || [],
          fasilitas: formData.fasilitas || [],
          created_at: formData.created_at || Date.now(),
          updated_at: Date.now()
      } as Lowongan;

      if (isNew) {
          await addJob(payload);
          showToast({ message: 'Lowongan berhasil diposting', type: 'success' });
      } else {
          await addJob(payload);
          showToast({ message: 'Lowongan berhasil diperbarui', type: 'success' });
      }
      setTimeout(() => navigate('/admin/jobs'), 1000);
  };

  const companyOptions = companies.map(c => ({ label: c.nama, value: c.perusahaan_id }));
  
  // Use options from JSON or fallback
  const typeOptions = masterOptions.jenis_kontrak?.map((o: any) => ({ label: o.label, value: o.nilai })) || [
      { label: 'Full Time', value: 'Full Time' },
      { label: 'Part Time', value: 'Part Time' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Internship', value: 'Internship' },
      { label: 'Freelance', value: 'Freelance' }
  ];

  const workSystemOptions = masterOptions.sistem_kerja?.map((o: any) => ({ label: o.label, value: o.nilai })) || [
      { label: 'On-site', value: 'On-site' },
      { label: 'Remote', value: 'Remote' },
      { label: 'Hybrid', value: 'Hybrid' }
  ];

  const salarySystemOptions = masterOptions.sistem_gaji?.map((o: any) => ({ label: o.label, value: o.nilai })) || [
      { label: 'Bulanan', value: 'Bulanan' }
  ];
  
  const educationOptions = [
      { label: 'SMA/SMK', value: 'SMA/SMK' },
      { label: 'D3', value: 'D3' },
      { label: 'S1', value: 'S1' },
      { label: 'S2', value: 'S2' },
      { label: 'Tidak Ada', value: 'Tidak Ada' }
  ];

  return (
    <div className="pb-20 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin/jobs')} className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm border border-transparent hover:border-slate-200">
              <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
              <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Posting Lowongan' : 'Edit Lowongan'}</h1>
              <p className="text-slate-500 text-sm">Isi detail posisi pekerjaan dengan lengkap.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              {/* Smart Import Section */}
              <SmartImport type="job" onAnalyze={handleSmartImport} />

              {/* Main Information */}
              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-slate-800">Informasi Utama</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Judul Posisi" value={formData.posisi} onChange={e => handleChange('posisi', e.target.value)} required placeholder="Contoh: Senior Marketing" className="font-bold text-lg" />
                    <Combobox 
                          label="Perusahaan"
                          options={companyOptions}
                          value={formData.perusahaan_id}
                          onChange={(val) => handleChange('perusahaan_id', val)}
                          placeholder="Pilih Perusahaan"
                      />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      <Combobox 
                          label="Tipe Kontrak"
                          options={typeOptions}
                          value={formData.tipe_pekerjaan}
                          onChange={(val) => handleChange('tipe_pekerjaan', val)}
                      />
                      <Combobox 
                          label="Sistem Kerja"
                          options={workSystemOptions}
                          value={formData.sistem_kerja}
                          onChange={(val) => handleChange('sistem_kerja', val)}
                      />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <Combobox 
                          label="Pendidikan Minimal"
                          options={educationOptions}
                          value={formData.pendidikan_minimal}
                          onChange={(val) => handleChange('pendidikan_minimal', val)}
                      />
                      <Combobox 
                          label="Sistem Gaji"
                          options={salarySystemOptions}
                          value={formData.sistem_gaji}
                          onChange={(val) => handleChange('sistem_gaji', val)}
                      />
                  </div>
                  
                  <CurrencyInput label="Nominal Gaji (Opsional)" value={formData.rentang_gaji || ''} onChange={(val) => handleChange('rentang_gaji', val)} />
              </Card>

              {/* Description & Requirements */}
              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-lg text-slate-800">Detail & Kualifikasi</h3>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Pekerjaan (Paragraf Panjang)</label>
                      <textarea 
                        className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm min-h-[200px] leading-relaxed"
                        value={formData.deskripsi_pekerjaan}
                        onChange={e => handleChange('deskripsi_pekerjaan', e.target.value)}
                        placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan gambaran umum peran ini..."
                      />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-bold text-lg text-slate-800">Kualifikasi / Persyaratan</h3>
                      </div>
                      <StringListInput 
                          label="Daftar Kualifikasi" 
                          items={formData.kualifikasi || []} 
                          onChange={(items) => handleChange('kualifikasi', items)}
                          placeholder="Tambah kualifikasi (Tekan Enter)..."
                      />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                          <Gift className="w-5 h-5 text-purple-600" />
                          <h3 className="font-bold text-lg text-slate-800">Fasilitas & Benefit</h3>
                      </div>
                      <StringListInput 
                          label="Daftar Fasilitas" 
                          items={formData.fasilitas || []} 
                          onChange={(items) => handleChange('fasilitas', items)}
                          placeholder="Tambah fasilitas (e.g. Asuransi, Makan Siang)..."
                      />
                  </div>
              </Card>

              {/* Location Details */}
              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-lg text-slate-800">Lokasi Penempatan</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Provinsi" value={formData.provinsi} onChange={e => handleChange('provinsi', e.target.value)} placeholder="Jawa Barat" />
                      <Input label="Kota/Kabupaten" value={formData.kota} onChange={e => handleChange('kota', e.target.value)} placeholder="Bandung" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      <Input label="Kecamatan" value={formData.kecamatan} onChange={e => handleChange('kecamatan', e.target.value)} />
                      <Input label="Kelurahan" value={formData.kelurahan} onChange={e => handleChange('kelurahan', e.target.value)} />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                          <Input label="Nama Jalan / Gedung" value={formData.jalan} onChange={e => handleChange('jalan', e.target.value)} placeholder="Jl. Asia Afrika No. 123" />
                      </div>
                      <Input label="Kode Pos" value={formData.kode_pos} onChange={e => handleChange('kode_pos', e.target.value)} />
                  </div>

                  <Input label="Link Google Maps (Embed/Share)" value={formData.maps} onChange={e => handleChange('maps', e.target.value)} placeholder="https://maps.google.com/..." />
              </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4">Status & Publikasi</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Lowongan</label>
                          <select 
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                          >
                              <option value="Active">Active (Tayang)</option>
                              <option value="Closed">Closed (Tutup)</option>
                              <option value="Draft">Draft (Konsep)</option>
                          </select>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-sm font-medium text-slate-700">Promosikan (Hot Job)</span>
                          <input 
                            type="checkbox" 
                            checked={!!formData.promosi} 
                            onChange={(e) => handleChange('promosi', e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metode Pelamaran</label>
                          <select 
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 mb-4"
                            value={formData.jenis_submit || 'karirkita'}
                            onChange={(e) => handleChange('jenis_submit', e.target.value)}
                          >
                              <option value="karirkita">Sistem KarirKita (Default)</option>
                              <option value="walk_interview">Walk-in Interview</option>
                              <option value="custom">Custom (WA/Email/Telp)</option>
                          </select>

                          {formData.jenis_submit === 'custom' && (
                              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                  <label className="text-xs font-bold text-slate-700">Daftar Kontak</label>
                                  {formData.kontak?.map((contact, idx) => (
                                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 space-y-2 relative">
                                          <button onClick={() => removeContact(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                          <Input 
                                            label="Atas Nama" 
                                            value={contact.atas_nama} 
                                            onChange={(e) => handleContactChange(idx, 'atas_nama', e.target.value)} 
                                            className="text-xs h-8"
                                          />
                                          <div className="grid grid-cols-2 gap-2">
                                              <select 
                                                  className="h-8 px-2 rounded-lg border border-slate-200 text-xs"
                                                  value={contact.tipe}
                                                  onChange={(e) => handleContactChange(idx, 'tipe', e.target.value)}
                                              >
                                                  <option value="whatsapp">WhatsApp</option>
                                                  <option value="email">Email</option>
                                                  <option value="telpon">Telepon</option>
                                              </select>
                                              <Input 
                                                value={contact.nilai} 
                                                onChange={(e) => handleContactChange(idx, 'nilai', e.target.value)} 
                                                placeholder={contact.tipe === 'email' ? 'email@ex.com' : '628...'}
                                                className="text-xs h-8"
                                              />
                                          </div>
                                      </div>
                                  ))}
                                  <Button size="sm" variant="outline" onClick={addContact} className="w-full text-xs border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300">
                                      + Tambah Kontak
                                  </Button>
                              </div>
                          )}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                          <Button onClick={handleSave} className="w-full shadow-lg shadow-blue-600/20 py-3 text-base">
                              <Save className="w-4 h-4 mr-2" /> Simpan & Publish
                          </Button>
                          <p className="text-xs text-center text-slate-400 mt-3">
                              Pastikan data sudah benar sebelum mempublikasikan lowongan ini.
                          </p>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};
