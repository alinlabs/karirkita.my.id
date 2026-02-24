
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { CurrencyInput } from '../../komponen/ui/CurrencyInput';
import { Plus, Trash2, Edit2, ShoppingBag, Image as ImageIcon, X, CheckCircle2, ArrowLeft, Save, GripVertical } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { routingData } from '../../services/routingData';
import { Layanan, PencariKerja } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const UserServices = () => {
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [services, setServices] = useState<Layanan[]>([]);
  
  // View State: 'list' or 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Layanan>>({
      judul: '',
      deskripsi: '',
      harga: '',
      harga_coret: '',
      thumbnail_url: '',
      galeri_url: [],
      fitur: ['']
  });

  // Load Initial Data
  useEffect(() => {
    if (user?.id) {
        routingData.getTalents(user.id)
            .then(data => {
                const userData = Array.isArray(data) ? data[0] : data;
                
                if (userData) {
                    let servicesData = userData.layanan;
                    
                    // Fallback: Parse if it's a string (in case Worker didn't parse it)
                    if (typeof servicesData === 'string') {
                        try {
                            servicesData = JSON.parse(servicesData);
                        } catch (e) {
                            servicesData = [];
                        }
                    }
                    
                    if (Array.isArray(servicesData)) {
                        setServices(servicesData);
                    } else {
                        setServices([]);
                    }
                }
            })
            .catch(err => {
                console.error("UserServices: Failed to fetch data", err);
                showToast({ message: "Gagal memuat data layanan. Silakan coba lagi.", type: 'error' });
            });
    } else {
        // Fallback for dev if no user logged in (though protected route should prevent this)
        routingData.getTalents()
            .then(data => {
                const userData = data[0]; 
                if(userData && userData.layanan) {
                    let servicesData = userData.layanan;
                    if (typeof servicesData === 'string') {
                        try { servicesData = JSON.parse(servicesData); } catch (e) { servicesData = []; }
                    }
                    setServices(Array.isArray(servicesData) ? servicesData : []);
                }
            })
            .catch(err => {
                console.error("UserServices: Failed to fetch dev data", err);
            });
    }
  }, [user]);

  const handleCreateNew = () => {
      setEditingServiceId(null);
      setFormData({ judul: '', deskripsi: '', harga: '', harga_coret: '', thumbnail_url: '', galeri_url: [], fitur: [''] });
      setViewMode('editor');
  };

  const handleEdit = (service: Layanan) => {
      setEditingServiceId(service.id);
      // Clean up "IDR" or dots if they exist in the raw data for editing
      const cleanPrice = (price: string) => price ? price.replace(/\D/g, '') : '';
      
      setFormData({ 
          ...service, 
          harga: cleanPrice(service.harga),
          harga_coret: cleanPrice(service.harga_coret || ''),
          fitur: service.fitur && service.fitur.length > 0 ? service.fitur : [''],
          galeri_url: service.galeri_url || [] 
        });
      setViewMode('editor');
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const newService: Layanan = {
          id: editingServiceId || `s-${Date.now()}`,
          judul: formData.judul || 'Untitled Service',
          deskripsi: formData.deskripsi || '',
          harga: formData.harga || '0',
          harga_coret: formData.harga_coret || undefined,
          thumbnail_url: formData.thumbnail_url,
          galeri_url: formData.galeri_url,
          fitur: formData.fitur?.filter(f => f.trim() !== '') || []
      };

      let updatedServices: Layanan[];

      if (editingServiceId) {
          updatedServices = services.map(s => s.id === editingServiceId ? newService : s);
          setServices(updatedServices);
          showToast({ message: 'Layanan diperbarui!', type: 'success' });
      } else {
          updatedServices = [...services, newService];
          setServices(updatedServices);
          showToast({ message: 'Layanan ditambahkan!', type: 'success' });
      }
      
      // Save to Database
      if (user?.id) {
          console.log("UserServices: Saving services for user", user.id);
          console.log("UserServices: Payload", updatedServices);
          try {
              await routingData.updateUser(user.id, { layanan: updatedServices });
              showToast({ message: 'Perubahan tersimpan ke database', type: 'success' });
          } catch (error) {
              console.error("Failed to save services", error);
              showToast({ message: 'Gagal menyimpan ke database', type: 'error' });
          }
      }

      setViewMode('list');
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Hapus layanan ini?")) {
          const updatedServices = services.filter(s => s.id !== id);
          setServices(updatedServices);
          showToast({ message: 'Layanan dihapus', type: 'error' });
          
          // Save to Database
          if (user?.id) {
              try {
                  await routingData.updateUser(user.id, { layanan: updatedServices });
              } catch (error) {
                  console.error("Failed to save deletion", error);
              }
          }
      }
  };

  // Feature Array Logic
  const updateFeature = (index: number, val: string) => {
      const newFeatures = [...(formData.fitur || [])];
      newFeatures[index] = val;
      setFormData({ ...formData, fitur: newFeatures });
  };

  const addFeature = () => {
      setFormData({ ...formData, fitur: [...(formData.fitur || []), ''] });
  };

  const removeFeature = (index: number) => {
      const newFeatures = (formData.fitur || []).filter((_, i) => i !== index);
      setFormData({ ...formData, fitur: newFeatures });
  };

  // Gallery Array Logic
  const updateGallery = (index: number, val: string) => {
      const newGallery = [...(formData.galeri_url || [])];
      newGallery[index] = val;
      setFormData({ ...formData, galeri_url: newGallery });
  };

  const addGallery = () => {
      setFormData({ ...formData, galeri_url: [...(formData.galeri_url || []), ''] });
  };

  const removeGallery = (index: number) => {
      const newGallery = (formData.galeri_url || []).filter((_, i) => i !== index);
      setFormData({ ...formData, galeri_url: newGallery });
  };

  // --- RENDER LIST VIEW ---
  if (viewMode === 'list') {
      return (
        <div className="pb-20">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Daftar Produk & Layanan</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Kelola jasa freelance atau produk digital yang Anda tawarkan.</p>
                </div>
                <Button onClick={handleCreateNew} className="shadow-xl shadow-blue-600/20 gap-2 rounded-xl h-11 px-6 font-bold bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Tambah Layanan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length > 0 ? (
                    services.map((service) => (
                        <Card key={service.id} className="p-0 overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 rounded-[2rem] flex flex-col h-full group">
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                {service.thumbnail_url ? (
                                    <img src={service.thumbnail_url} alt={service.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(service)} className="p-2 bg-white/90 rounded-xl hover:text-blue-600 shadow-sm transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(service.id)} className="p-2 bg-white/90 rounded-xl hover:text-red-600 shadow-sm transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{service.judul}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{service.deskripsi}</p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-end gap-2">
                                        <span className="font-black text-xl text-slate-900">
                                            {service.harga ? `IDR ${service.harga.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : 'IDR 0'}
                                        </span>
                                        {service.harga_coret && (
                                            <span className="text-xs text-slate-400 line-through mb-1">
                                                {`IDR ${service.harga_coret.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Belum ada layanan</h3>
                        <p className="text-slate-500 mb-6">Mulai tawarkan keahlian Anda kepada klien potensial.</p>
                        <Button onClick={handleCreateNew} variant="outline">Tambah Layanan Pertama</Button>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- RENDER EDITOR VIEW ---
  return (
    <div className="pb-20 animate-fade-in-up">
        {toast && <Toast message={toast.message} type={toast.type} />}

        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setViewMode('list')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    {editingServiceId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                </h1>
                <p className="text-slate-500 font-medium text-sm">Lengkapi detail produk atau jasa yang Anda tawarkan.</p>
            </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Main Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-600" /> Informasi Dasar
                    </h3>
                    <div className="space-y-6">
                        <Input 
                            label="Judul Layanan" 
                            required 
                            value={formData.judul} 
                            onChange={e => setFormData({...formData, judul: e.target.value})} 
                            placeholder="Contoh: Jasa Desain Logo Profesional"
                            className="text-lg font-bold h-12"
                        />
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Lengkap</label>
                            <textarea 
                                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 leading-relaxed min-h-[150px]" 
                                rows={6}
                                value={formData.deskripsi}
                                onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                                placeholder="Jelaskan detail layanan, proses kerja, dan apa yang membuat layanan Anda unik..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CurrencyInput 
                                label="Harga Layanan" 
                                required 
                                value={formData.harga || ''} 
                                onChange={(val) => setFormData({...formData, harga: val})} 
                            />
                            <CurrencyInput 
                                label="Harga Coret (Diskon)" 
                                value={formData.harga_coret || ''} 
                                onChange={(val) => setFormData({...formData, harga_coret: val})} 
                            />
                        </div>
                    </div>
                </Card>

                {/* Features Section */}
                <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" /> Fitur & Benefit
                    </h3>
                    <div className="space-y-3">
                        {formData.fitur?.map((feat, idx) => (
                            <div key={idx} className="flex gap-3 items-center group">
                                <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                                <Input 
                                    value={feat} 
                                    onChange={e => updateFeature(idx, e.target.value)} 
                                    placeholder={`Benefit ${idx + 1}`}
                                    className="bg-white"
                                />
                                <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <Button type="button" variant="ghost" size="sm" onClick={addFeature} className="text-blue-600 font-bold hover:bg-blue-50 mt-2">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Benefit Lain
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Right Column: Media */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-600" /> Media & Galeri
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Main Thumbnail */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cover Utama (Thumbnail)</label>
                            <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3 group">
                                {formData.thumbnail_url ? (
                                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs">Preview Image</span>
                                    </div>
                                )}
                            </div>
                            <Input 
                                value={formData.thumbnail_url || ''} 
                                onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} 
                                placeholder="https://... (URL Gambar)"
                                icon={<ImageIcon className="w-4 h-4" />}
                            />
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Galeri Tambahan</label>
                            <div className="space-y-3">
                                {formData.galeri_url?.map((url, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                                            {url && <img src={url} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <Input 
                                            value={url} 
                                            onChange={e => updateGallery(idx, e.target.value)} 
                                            placeholder="URL Gambar..."
                                            className="text-sm"
                                        />
                                        <button type="button" onClick={() => removeGallery(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addGallery} className="w-full border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Gambar Galeri
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="sticky top-6">
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 transition-transform hover:-translate-y-1">
                        <Save className="w-5 h-5 mr-2" /> Simpan Layanan
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setViewMode('list')} className="w-full mt-3 text-slate-500 hover:text-slate-700">
                        Batal
                    </Button>
                </div>
            </div>

        </form>
    </div>
  );
};
