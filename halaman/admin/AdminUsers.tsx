
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Search, Trash2, User, Mail, Phone, CheckCircle, XCircle, Shield, Eye, X } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { PencariKerja } from '../../types';
import { createPortal } from 'react-dom';

export const AdminUsers = () => {
  const { toast, showToast } = useToast();
  const [users, setUsers] = useState<PencariKerja[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'company'>('all');
  const [selectedUser, setSelectedUser] = useState<PencariKerja | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await routingData.getTalents();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      showToast({ message: 'Gagal memuat data pengguna', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;
    
    try {
      await routingData.deleteUser(id);
      // Optimistic update
      setUsers(prev => prev.filter(u => u.user_id !== id));
      showToast({ message: 'Pengguna berhasil dihapus', type: 'success' });
    } catch (err) {
      showToast({ message: 'Gagal menghapus pengguna', type: 'error' });
      fetchUsers(); // Revert
    }
  };

  const handleStatusChange = async (id: string, type: 'verifikasi' | 'promosi', value: string | boolean) => {
      try {
          // Optimistic update
          setUsers(prev => prev.map(u => {
              if (u.user_id === id) {
                  return { ...u, [type === 'verifikasi' ? 'verifikasi' : 'promosi']: value };
              }
              return u;
          }));

          await routingData.updateUserStatus(id, type, value);
          showToast({ message: `Status ${type} berhasil diperbarui`, type: 'success' });
      } catch (err) {
          showToast({ message: `Gagal memperbarui status ${type}`, type: 'error' });
          fetchUsers(); // Revert on error
      }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email_kontak && user.email_kontak.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.telepon_kontak && user.telepon_kontak.includes(searchTerm));
      
    const matchesRole = filterRole === 'all' ? true : true; 

    return matchesSearch && matchesRole;
  });

  // Helper to render JSON data safely
  const renderJsonData = (data: any) => {
      if (!data) return <span className="text-slate-400 italic">Tidak ada data</span>;
      if (Array.isArray(data) && data.length === 0) return <span className="text-slate-400 italic">Kosong</span>;
      
      return (
          <pre className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 overflow-x-auto border border-slate-200">
              {JSON.stringify(data, null, 2)}
          </pre>
      );
  };

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pengguna</h1>
          <p className="text-slate-500 text-sm">Daftar semua pengguna terdaftar (Talenta & Perusahaan).</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={fetchUsers} isLoading={loading}>
                Refresh
            </Button>
        </div>
      </div>

      <Card className="p-4 md:p-6 rounded-[2rem] border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau telepon..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {['all', 'admin', 'company', 'user'].map(role => (
                 <button
                    key={role}
                    onClick={() => setFilterRole(role as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                        filterRole === role 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                 >
                    {role === 'all' ? 'Semua' : role.charAt(0).toUpperCase() + role.slice(1)}
                 </button>
             ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-12 text-slate-400">Memuat data pengguna...</div>
        ) : filteredUsers.length === 0 ? (
           <div className="text-center py-12 text-slate-400 bg-white rounded-[2rem] border border-slate-100">
               Tidak ada pengguna yang ditemukan.
           </div>
        ) : (
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-bold">Pengguna</th>
                      <th className="p-4 font-bold">Kontak</th>
                      <th className="p-4 font-bold">Verifikasi</th>
                      <th className="p-4 font-bold">Promosi</th>
                      <th className="p-4 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(user => (
                      <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                 {user.foto_profil ? (
                                     <img src={user.foto_profil} alt={user.nama_lengkap} className="w-full h-full object-cover" />
                                 ) : (
                                     <User className="w-5 h-5 text-slate-400" />
                                 )}
                              </div>
                              <div>
                                 <div className="font-bold text-slate-900">{user.nama_lengkap}</div>
                                 <div className="text-xs text-slate-500">ID: {user.user_id?.substring(0, 8) || '-'}...</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                 <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email_kontak || '-'}
                              </div>
                              {user.telepon_kontak && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.telepon_kontak}
                                  </div>
                              )}
                           </div>
                        </td>
                        <td className="p-4">
                            <select 
                                className={`text-xs font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${
                                    user.verifikasi === 'disetujui' ? 'bg-green-50 text-green-700 border-green-200' :
                                    user.verifikasi === 'ditolak' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}
                                value={user.verifikasi || 'kosong'}
                                onChange={(e) => handleStatusChange(user.user_id, 'verifikasi', e.target.value)}
                            >
                                <option value="kosong">Belum Submit</option>
                                <option value="proses">Proses Verifikasi</option>
                                <option value="disetujui">Disetujui</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </td>
                        <td className="p-4">
                            <button 
                                onClick={() => handleStatusChange(user.user_id, 'promosi', !user.promosi)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    user.promosi === 'Active' || user.promosi === true ? 'bg-blue-600' : 'bg-slate-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    user.promosi === 'Active' || user.promosi === true ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                            <span className="ml-2 text-xs text-slate-500">
                                {user.promosi === 'Active' || user.promosi === true ? 'Dipromosikan' : 'Standar'}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => setSelectedUser(user)}
                                title="Lihat Detail"
                              >
                                 <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(user.user_id)}
                                title="Hapus Pengguna"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 text-center">
                 Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </div>
           </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUser && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                          <h2 className="text-xl font-bold text-slate-900">Detail Pengguna</h2>
                          <p className="text-slate-500 text-sm">ID: {selectedUser.user_id}</p>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-500" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Profile Header */}
                      <div className="flex items-start gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              {selectedUser.foto_profil ? (
                                  <img src={selectedUser.foto_profil} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400"><User className="w-10 h-10" /></div>
                              )}
                          </div>
                          <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900">{selectedUser.nama_lengkap}</h3>
                              <p className="text-slate-600 font-medium">{selectedUser.headline || '-'}</p>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedUser.email_kontak}</span>
                                  {selectedUser.telepon_kontak && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedUser.telepon_kontak}</span>}
                              </div>
                              <div className="flex gap-2 mt-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedUser.verifikasi === 'disetujui' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      Verifikasi: {selectedUser.verifikasi || 'Belum'}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedUser.promosi ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                      Promosi: {selectedUser.promosi ? 'Ya' : 'Tidak'}
                                  </span>
                              </div>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Pribadi</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                      <span className="block text-slate-400 text-xs">Username</span>
                                      <span className="font-medium">{selectedUser.username}</span>
                                  </div>
                                  <div>
                                      <span className="block text-slate-400 text-xs">Tempat, Tanggal Lahir</span>
                                      <span className="font-medium">{selectedUser.tempat_lahir || '-'}, {selectedUser.tanggal_lahir || '-'}</span>
                                  </div>
                                  <div className="col-span-2">
                                      <span className="block text-slate-400 text-xs">Alamat</span>
                                      <span className="font-medium">
                                          {[selectedUser.jalan, selectedUser.kelurahan, selectedUser.kecamatan, selectedUser.kota, selectedUser.provinsi, selectedUser.kode_pos].filter(Boolean).join(', ') || '-'}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Tentang Saya</h4>
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                  {selectedUser.tentang_saya || '-'}
                              </p>
                          </div>
                      </div>

                      {/* JSON Data Sections */}
                      <div className="space-y-6">
                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Pengalaman Kerja</h4>
                              {renderJsonData(selectedUser.pengalaman_kerja)}
                          </div>
                          
                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Pendidikan</h4>
                              {renderJsonData(selectedUser.riwayat_pendidikan)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Keahlian (Skills)</h4>
                              {renderJsonData(selectedUser.keahlian_detail)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Layanan / Produk</h4>
                              {renderJsonData(selectedUser.layanan)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Portofolio</h4>
                              {renderJsonData(selectedUser.portofolio)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Sertifikasi</h4>
                              {renderJsonData(selectedUser.sertifikasi)}
                          </div>
                          
                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Organisasi</h4>
                              {renderJsonData(selectedUser.organisasi)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Sosial Media</h4>
                              {renderJsonData(selectedUser.sosial_media)}
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <Button onClick={() => setSelectedUser(null)}>Tutup</Button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </div>
  );
};
