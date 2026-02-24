
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { ImageUrlInput } from '../../komponen/ui/ImageUrlInput';
import { Save, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { routingData } from '../../services/routingData';
import { Identitas } from '../../types';

export const AdminSiteSettings = () => {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<Identitas>>({
      nama: '', tagline: '', deskripsi: '', logoUrl: '',
      kontak: { email: '', telepon: '', alamat: '' },
      sosialMedia: { linkedin: '', instagram: '', twitter: '', facebook: '' }
  });

  useEffect(() => {
      routingData.getIdentity().then(res => { if(res) setData(res); });
  }, []);

  const handleChange = (field: string, value: any) => {
      setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'kontak' | 'sosialMedia', field: string, value: string) => {
      setData(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [field]: value }
      }));
  };

  const handleSave = () => {
      setLoading(true);
      routingData.save('karirkita', data).then(() => {
          setLoading(false);
          showToast({ message: 'Pengaturan situs diperbarui', type: 'success' });
      }).catch(() => {
          setLoading(false);
          showToast({ message: 'Gagal menyimpan pengaturan', type: 'error' });
      });
  };

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900">Pengaturan Situs</h1>
              <p className="text-slate-500 text-sm">Kelola identitas global website (KV Storage).</p>
          </div>
          <Button onClick={handleSave} isLoading={loading} className="shadow-lg shadow-blue-600/20">
              <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600"/> Identitas Utama</h3>
              
              <Input label="Nama Situs" value={data.nama} onChange={e => handleChange('nama', e.target.value)} />
              <Input label="Tagline" value={data.tagline} onChange={e => handleChange('tagline', e.target.value)} />
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Meta</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    rows={3}
                    value={data.deskripsi}
                    onChange={e => handleChange('deskripsi', e.target.value)}
                  />
              </div>
              <ImageUrlInput label="URL Logo Situs" value={data.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} />
          </Card>

          <div className="space-y-8">
              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Phone className="w-5 h-5 text-green-600"/> Kontak Publik</h3>
                  <Input label="Email Support" value={data.kontak?.email} onChange={e => handleNestedChange('kontak', 'email', e.target.value)} icon={<Mail className="w-4 h-4"/>} />
                  <Input label="Telepon" value={data.kontak?.telepon} onChange={e => handleNestedChange('kontak', 'telepon', e.target.value)} icon={<Phone className="w-4 h-4"/>} />
                  <Input label="Alamat Kantor" value={data.kontak?.alamat} onChange={e => handleNestedChange('kontak', 'alamat', e.target.value)} icon={<MapPin className="w-4 h-4"/>} />
              </Card>

              <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-purple-600"/> Sosial Media</h3>
                  <Input label="Instagram" value={data.sosialMedia?.instagram} onChange={e => handleNestedChange('sosialMedia', 'instagram', e.target.value)} placeholder="Username / Link" />
                  <Input label="LinkedIn" value={data.sosialMedia?.linkedin} onChange={e => handleNestedChange('sosialMedia', 'linkedin', e.target.value)} placeholder="Link" />
              </Card>
          </div>
      </div>
    </div>
  );
};
