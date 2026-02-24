import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { Text } from '../../komponen/ui/Text';
import { CreditCard, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PhoneInput } from '../../komponen/ui/PhoneInput';

interface FormPembayaranProps {
  onSubmit: (data: any) => void;
  rekeningList: any[];
}

export const FormPembayaran: React.FC<FormPembayaranProps> = ({ onSubmit, rekeningList }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    metodePembayaran: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nama: user.nama_lengkap || user.username || '',
        email: user.email_kontak || '',
        telepon: user.telepon_kontak || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, telepon: value });
  };

  const handleSelectBank = (bankName: string) => {
    setFormData({ ...formData, metodePembayaran: bankName });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.metodePembayaran) {
      alert('Silakan pilih metode pembayaran.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="p-6 md:p-8 shadow-lg border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" /> Informasi Pemesan
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                name="nama" 
                value={formData.nama} 
                onChange={handleChange} 
                placeholder="Masukkan nama lengkap" 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <PhoneInput 
                label="Nomor Telepon / WhatsApp"
                value={formData.telepon}
                onChange={handlePhoneChange}
                placeholder="8123456789"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="nama@email.com" 
              className="pl-10" 
              required 
            />
          </div>
          <p className="text-xs text-slate-500">Bukti pembayaran dan akses akan dikirim ke email ini.</p>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" /> Metode Pembayaran
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rekeningList.map((rek, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelectBank(rek.bank)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 hover:shadow-md ${
                  formData.metodePembayaran === rek.bank 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="h-8 flex items-center justify-center">
                    {rek.logo ? (
                        <img src={rek.logo} alt={rek.bank} className="h-full object-contain" />
                    ) : (
                        <span className="font-bold text-slate-700">{rek.bank}</span>
                    )}
                </div>
                <span className={`text-sm font-medium ${formData.metodePembayaran === rek.bank ? 'text-blue-700' : 'text-slate-600'}`}>
                  Transfer {rek.bank}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-blue-600/20 mt-4">
          Lanjut ke Pembayaran
        </Button>
      </form>
    </Card>
  );
};
