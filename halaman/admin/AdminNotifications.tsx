
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { Bell, Send, Trash2, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { Notifikasi } from '../../types';

export const AdminNotifications = () => {
  const { toast, showToast } = useToast();
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'system',
    kepada: 'all', // 'all', 'user', 'company'
    tombol_ajakan: '',
    hyperlink: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await routingData.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      showToast({ message: 'Judul dan Pesan wajib diisi', type: 'error' });
      return;
    }

    setSending(true);
    try {
      // Construct payload matching Notifikasi type
      const payload = {
        ...formData,
        created_at: Date.now()
      };

      // Send to API (Assuming an endpoint exists or using a generic create)
      // Since routingData.getNotifications uses 'api/v2/notifications', we assume POST to same endpoint works
      // If not, we might need to update routingData.ts to support createNotification
      await routingData.post('api/v2/notifications', payload);
      
      showToast({ message: 'Notifikasi berhasil dikirim', type: 'success' });
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'info',
        kepada: 'all',
        tombol_ajakan: '',
        hyperlink: ''
      });
      
      // Refresh list
      fetchNotifications();

    } catch (err) {
      console.error("Failed to send notification", err);
      showToast({ message: 'Gagal mengirim notifikasi', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
      if(!window.confirm("Hapus notifikasi ini?")) return;
      
      try {
          await routingData.deleteNotification(id);
          setNotifications(prev => prev.filter(n => n.id !== id));
          showToast({ message: 'Notifikasi dihapus', type: 'success' });
      } catch (err) {
          showToast({ message: 'Gagal menghapus', type: 'error' });
      }
  };

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Notifikasi</h1>
          <p className="text-slate-500 text-sm">Kirim pengumuman atau informasi ke pengguna.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
            <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" /> Buat Notifikasi Baru
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Judul Notifikasi</label>
                        <Input 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Contoh: Pemeliharaan Sistem"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Pesan</label>
                        <textarea 
                            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm min-h-[100px]"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            placeholder="Tulis pesan lengkap di sini..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Tipe</label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm bg-white"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                            >
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Target</label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm bg-white"
                                value={formData.kepada}
                                onChange={e => setFormData({...formData, kepada: e.target.value})}
                            >
                                <option value="all">Semua Pengguna</option>
                                <option value="user">Hanya Pelamar</option>
                                <option value="company">Hanya Perusahaan</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Label Tombol (Opsional)</label>
                        <Input 
                            value={formData.tombol_ajakan}
                            onChange={e => setFormData({...formData, tombol_ajakan: e.target.value})}
                            placeholder="Contoh: Lihat Detail"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Link Tujuan (Opsional)</label>
                        <Input 
                            value={formData.hyperlink}
                            onChange={e => setFormData({...formData, hyperlink: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>

                    <Button 
                        onClick={handleSend} 
                        isLoading={sending} 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                    >
                        <Send className="w-4 h-4 mr-2" /> Kirim Notifikasi
                    </Button>
                </div>
            </Card>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
            <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-slate-400" /> Riwayat Notifikasi
                    </h3>
                    <Button variant="ghost" size="sm" onClick={fetchNotifications} isLoading={loading}>Refresh</Button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Memuat riwayat...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        Belum ada notifikasi yang dikirim.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 transition-all group relative">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                        notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                        notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                        notif.type === 'system' ? 'bg-slate-100 text-slate-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {notif.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                         notif.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                         <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-slate-900">{notif.title}</h4>
                                            <span className="text-xs text-slate-400">
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 font-medium">
                                                Target: {notif.kepada === 'all' ? 'Semua' : notif.kepada === 'user' ? 'Pelamar' : 'Perusahaan'}
                                            </span>
                                            {notif.tombol_ajakan && (
                                                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-medium border border-blue-100">
                                                    Action: {notif.tombol_ajakan}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(notif.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 absolute top-4 right-4"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};
