
import React, { useState } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { PhoneInput } from '../../komponen/ui/PhoneInput';
import { Bell, Lock, Shield, User, Mail, Smartphone, Globe, ChevronRight, LogOut } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { cn } from '../../utils/cn';

export const UserSettings = () => {
  const { toast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
  const [phoneNumber, setPhoneNumber] = useState('81234567890');
  
  // Toggles state
  const [toggles, setToggles] = useState({
      email: true,
      push: false,
      marketing: true,
      twoFactor: false
  });

  const handleToggle = (key: keyof typeof toggles) => {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    showToast({ message: 'Pengaturan berhasil disimpan!', type: 'success' });
  };

  const menuItems = [
      { id: 'account', label: 'Profil & Akun', icon: User },
      { id: 'security', label: 'Keamanan Login', icon: Lock },
      { id: 'notifications', label: 'Notifikasi', icon: Bell },
  ];

  return (
    <div className="pb-10">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Pengaturan</h1>
      <p className="text-slate-500 mb-8">Kelola preferensi dan keamanan akun Anda.</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
         
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1">
            <Card className="p-2 sticky top-24">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-all mb-1",
                            activeTab === item.id 
                                ? "bg-blue-50 text-blue-700" 
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-blue-600" : "text-slate-400")} />
                            {item.label}
                        </div>
                        {activeTab === item.id && <ChevronRight className="w-4 h-4 text-blue-400" />}
                    </button>
                ))}
                <div className="my-2 border-t border-slate-100"></div>
                <button className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Keluar
                </button>
            </Card>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-3 space-y-6">
            
            {/* --- TAB: ACCOUNT --- */}
            {activeTab === 'account' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <Card className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Informasi Login</h3>
                        <div className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <Input label="Email Address" defaultValue="demo@karirku.my.id" />
                                <Input label="Username" defaultValue="demouser" />
                            </div>
                            
                            <PhoneInput 
                                label="Nomor Telepon"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                            />
                            
                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">!</div>
                                    <div>
                                        <p className="font-bold text-orange-800 text-sm">Verifikasi Email Diperlukan</p>
                                        <p className="text-orange-700 text-xs">Amankan akun Anda dengan memverifikasi email.</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="bg-white border-orange-200 text-orange-700 hover:bg-orange-100">Kirim Ulang</Button>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <Button onClick={handleSave}>Simpan Profil</Button>
                        </div>
                    </Card>

                    <Card className="p-6 md:p-8 border-red-100">
                        <h3 className="text-lg font-bold text-red-600 mb-2">Area Berbahaya</h3>
                        <p className="text-slate-500 text-sm mb-6">Menghapus akun akan menghilangkan semua data profil, lamaran, dan riwayat secara permanen.</p>
                        <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200">Hapus Akun Saya</Button>
                    </Card>
                </div>
            )}

            {/* --- TAB: SECURITY --- */}
            {activeTab === 'security' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <Card className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Ganti Password</h3>
                        <div className="space-y-5 max-w-lg">
                            <Input type="password" label="Password Saat Ini" />
                            <Input type="password" label="Password Baru" />
                            <Input type="password" label="Konfirmasi Password Baru" />
                            <div className="pt-2">
                                <Button variant="outline">Update Password</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Autentikasi Dua Faktor (2FA)</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-800">Aktifkan 2FA</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm">Menambah lapisan keamanan ekstra. Kami akan mengirimkan kode SMS setiap kali Anda login.</p>
                            </div>
                            <SwitchToggle checked={toggles.twoFactor} onChange={() => handleToggle('twoFactor')} />
                        </div>
                    </Card>
                </div>
            )}

            {/* --- TAB: NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Preferensi Notifikasi</h3>
                        
                        <div className="space-y-6 divide-y divide-slate-100">
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Notifikasi Email</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Terima update status lamaran dan lowongan baru via email.</p>
                                    </div>
                                </div>
                                <SwitchToggle checked={toggles.email} onChange={() => handleToggle('email')} />
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl shrink-0">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Push Notification</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Notifikasi real-time di browser atau perangkat mobile.</p>
                                    </div>
                                </div>
                                <SwitchToggle checked={toggles.push} onChange={() => handleToggle('push')} />
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-green-100 text-green-600 rounded-xl shrink-0">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Berita & Marketing</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Info fitur baru, tips karir, dan promo eksklusif.</p>
                                    </div>
                                </div>
                                <SwitchToggle checked={toggles.marketing} onChange={() => handleToggle('marketing')} />
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <Button onClick={handleSave}>Simpan Preferensi</Button>
                        </div>
                    </Card>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};

// Modern Toggle Switch Component
const SwitchToggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 duration-300 ease-in-out ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);
