import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { ImageUrlInput } from '../../komponen/ui/ImageUrlInput';
import { Save, Globe, Search, Layout } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { routingData } from '../../services/routingData';

export const AdminMetaTag = () => {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
      routingData.get('halaman').then(res => { 
          if(res) {
              // Handle array response if API returns array
              const metaData = Array.isArray(res) ? (res[0] || {}) : res;
              setData(metaData); 
          }
      });
  }, []);

  const handleChange = (section: string, path: string, value: any) => {
      setData((prev: any) => {
          const sectionData = { ...prev[section] };
          
          // Handle nested path (e.g. "desktop.judul" or "lottie.kiri")
          if (path.includes('.')) {
              const [parent, child] = path.split('.');
              sectionData[parent] = {
                  ...sectionData[parent],
                  [child]: value
              };
          } else {
              sectionData[path] = value;
          }

          return {
              ...prev,
              [section]: sectionData
          };
      });
  };

  const handleSave = () => {
      setLoading(true);
      // Save as array to match structure
      routingData.save('halaman', [data]).then(() => {
          setLoading(false);
          showToast({ message: 'Meta Tag berhasil diperbarui', type: 'success' });
      }).catch(() => {
          setLoading(false);
          showToast({ message: 'Gagal menyimpan data', type: 'error' });
      });
  };

  const sections = [
    'beranda', 
    'pekerjaan', 
    'pelamar', 
    'perusahaan', 
    'kelas', 
    'promosi', 
    'detail_kelas', 
    'detail_mentor', 
    'login', 
    'register',
    'privacy', 
    'terms', 
    'help', 
    'contact', 
    'cookies', 
    'disclaimer'
  ];

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900">Meta Tag & Tampilan</h1>
              <p className="text-slate-500 text-sm">Kelola SEO dan aset tampilan per halaman (KV: halaman).</p>
          </div>
          <Button onClick={handleSave} isLoading={loading} className="shadow-lg shadow-blue-600/20">
              <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
      </div>

      <div className="space-y-8">
          {sections.map(section => (
              <Card key={section} className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg capitalize border-b border-slate-100 pb-2">{section}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      {/* Desktop Config */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <Layout className="w-4 h-4" /> Tampilan Desktop
                          </h4>
                          <Input 
                              label="Judul (Desktop)" 
                              value={data[section]?.desktop?.judul || ''} 
                              onChange={e => handleChange(section, 'desktop.judul', e.target.value)} 
                          />
                          <div className="space-y-2">
                              <label className="block text-sm font-bold text-slate-700">Deskripsi (Desktop)</label>
                              <textarea 
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                rows={3}
                                value={data[section]?.desktop?.deskripsi || ''} 
                                onChange={e => handleChange(section, 'desktop.deskripsi', e.target.value)}
                              />
                          </div>
                          {section !== 'beranda' && (
                              <ImageUrlInput 
                                  label="Hero Image/Lottie (Desktop)" 
                                  value={data[section]?.desktop?.hero || ''} 
                                  onChange={e => handleChange(section, 'desktop.hero', e.target.value)} 
                              />
                          )}
                      </div>

                      {/* Mobile Config */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <Layout className="w-4 h-4" /> Tampilan Mobile
                          </h4>
                          <Input 
                              label="Judul (Mobile)" 
                              value={data[section]?.mobile?.judul || ''} 
                              onChange={e => handleChange(section, 'mobile.judul', e.target.value)} 
                          />
                          <div className="space-y-2">
                              <label className="block text-sm font-bold text-slate-700">Deskripsi (Mobile)</label>
                              <textarea 
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                rows={3}
                                value={data[section]?.mobile?.deskripsi || ''} 
                                onChange={e => handleChange(section, 'mobile.deskripsi', e.target.value)}
                              />
                          </div>
                          {section !== 'beranda' && (
                              <ImageUrlInput 
                                  label="Hero Image/Lottie (Mobile)" 
                                  value={data[section]?.mobile?.hero || ''} 
                                  onChange={e => handleChange(section, 'mobile.hero', e.target.value)} 
                              />
                          )}
                      </div>
                  </div>

                  {/* Beranda Specific Lottie Config */}
                  {section === 'beranda' && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <Search className="w-4 h-4" /> Animasi Hero (Lottie)
                          </h4>
                          <div className="grid md:grid-cols-3 gap-4">
                              <ImageUrlInput 
                                  label="Animasi Kiri" 
                                  value={data[section]?.lottie?.kiri || ''} 
                                  onChange={e => handleChange(section, 'lottie.kiri', e.target.value)} 
                              />
                              <ImageUrlInput 
                                  label="Animasi Kanan" 
                                  value={data[section]?.lottie?.kanan || ''} 
                                  onChange={e => handleChange(section, 'lottie.kanan', e.target.value)} 
                              />
                              <ImageUrlInput 
                                  label="Animasi Ponsel" 
                                  value={data[section]?.lottie?.ponsel || ''} 
                                  onChange={e => handleChange(section, 'lottie.ponsel', e.target.value)} 
                              />
                          </div>
                      </div>
                  )}
              </Card>
          ))}
      </div>
    </div>
  );
};
