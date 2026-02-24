
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { Plus, Trash2, Search, MapPin, Globe, Edit3, CheckCircle2, XCircle, MoreVertical, Building2, Eye, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Perusahaan } from '../../types';
import { createPortal } from 'react-dom';

export const ManageCompanies = () => {
  const { companies: contextCompanies, deleteCompany } = useData();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [localCompanies, setLocalCompanies] = useState<Perusahaan[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Perusahaan | null>(null);

  useEffect(() => {
      setLocalCompanies(contextCompanies);
  }, [contextCompanies]);

  const filtered = localCompanies.filter(c => 
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.industri.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDelete = (id: string, name: string) => {
      if(window.confirm(`Yakin ingin menghapus perusahaan "${name}" beserta seluruh lowongannya?`)) {
          deleteCompany(id);
          // Also update local state
          setLocalCompanies(prev => prev.filter(c => c.perusahaan_id !== id));
          showToast({ message: 'Perusahaan berhasil dihapus', type: 'success' });
      }
  };

  const handleStatusChange = async (id: string, type: 'verifikasi' | 'promosi', value: string | boolean) => {
      try {
          // Optimistic update
          setLocalCompanies(prev => prev.map(c => {
              if (c.perusahaan_id === id) {
                  return { ...c, [type === 'verifikasi' ? 'verifikasi' : 'promosi']: value };
              }
              return c;
          }));

          await routingData.updateCompanyStatus(id, type, value);
          showToast({ message: `Status ${type} berhasil diperbarui`, type: 'success' });
      } catch (err) {
          showToast({ message: `Gagal memperbarui status ${type}`, type: 'error' });
          // Revert logic would go here if we had a refresh method exposed from useData
          setLocalCompanies(contextCompanies); // Revert to context data
      }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 className="text-xl font-bold text-slate-900">Manajemen Perusahaan</h1>
            <p className="text-slate-500 text-sm">Total {localCompanies.length} perusahaan terdaftar</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Cari perusahaan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link to="/admin/companies/new">
                <Button className="w-full sm:w-auto rounded-xl shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Baru
                </Button>
            </Link>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-bold">Perusahaan</th>
                  <th className="p-4 font-bold">Lokasi & Web</th>
                  <th className="p-4 font-bold">Verifikasi</th>
                  <th className="p-4 font-bold">Promosi</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(comp => (
                  <tr key={comp.perusahaan_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                              <img src={comp.logo_url} alt={comp.nama} className="w-full h-full object-contain" />
                          </div>
                          <div>
                             <div className="font-bold text-slate-900">{comp.nama}</div>
                             <div className="text-xs text-blue-600 font-medium">{comp.industri}</div>
                             <div className="text-[10px] text-slate-400">{comp.ukuran_perusahaan}</div>
                          </div>
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                             <MapPin className="w-3.5 h-3.5 text-slate-400" />
                             <span className="truncate max-w-[150px]">{comp.lokasi || `${comp.kota}, ${comp.provinsi}`}</span>
                          </div>
                          {comp.website_url && (
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                <a href={comp.website_url} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:text-blue-600 hover:underline">
                                    {comp.website_url.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                          )}
                       </div>
                    </td>
                    <td className="p-4">
                        <select 
                            className={`text-xs font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${
                                comp.verifikasi === 'disetujui' ? 'bg-green-50 text-green-700 border-green-200' :
                                comp.verifikasi === 'ditolak' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                            value={comp.verifikasi || 'kosong'}
                            onChange={(e) => handleStatusChange(comp.perusahaan_id, 'verifikasi', e.target.value)}
                        >
                            <option value="kosong">Belum Submit</option>
                            <option value="proses">Proses Verifikasi</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </td>
                    <td className="p-4">
                        <button 
                            onClick={() => handleStatusChange(comp.perusahaan_id, 'promosi', !comp.promosi)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                comp.promosi ? 'bg-blue-600' : 'bg-slate-200'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                comp.promosi ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <span className="ml-2 text-xs text-slate-500">
                            {comp.promosi ? 'Dipromosikan' : 'Standar'}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedCompany(comp)}
                            title="Lihat Detail"
                          >
                             <Eye className="w-4 h-4" />
                          </Button>
                          <Link to={`/admin/companies/${comp.perusahaan_id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                 <Edit3 className="w-4 h-4" />
                              </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(comp.perusahaan_id, comp.nama)}
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
          {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                  Tidak ada perusahaan yang cocok dengan pencarian.
              </div>
          )}
      </div>

      {/* Detail Modal */}
      {selectedCompany && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                          <h2 className="text-xl font-bold text-slate-900">Detail Perusahaan</h2>
                          <p className="text-slate-500 text-sm">ID: {selectedCompany.perusahaan_id}</p>
                      </div>
                      <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-500" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Profile Header */}
                      <div className="flex items-start gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 p-4 flex items-center justify-center">
                              {selectedCompany.logo_url ? (
                                  <img src={selectedCompany.logo_url} className="w-full h-full object-contain" />
                              ) : (
                                  <Building2 className="w-10 h-10 text-slate-400" />
                              )}
                          </div>
                          <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900">{selectedCompany.nama}</h3>
                              <p className="text-slate-600 font-medium">{selectedCompany.industri} • {selectedCompany.ukuran_perusahaan}</p>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                  {selectedCompany.website_url && (
                                      <a href={selectedCompany.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                                          <Globe className="w-4 h-4" /> {selectedCompany.website_url.replace(/^https?:\/\//, '')}
                                      </a>
                                  )}
                                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedCompany.lokasi}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCompany.verifikasi === 'disetujui' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      Verifikasi: {selectedCompany.verifikasi || 'Belum'}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCompany.promosi ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                      Promosi: {selectedCompany.promosi ? 'Ya' : 'Tidak'}
                                  </span>
                              </div>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Kontak</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="col-span-2">
                                      <span className="block text-slate-400 text-xs">Alamat Lengkap</span>
                                      <span className="font-medium">
                                          {[selectedCompany.jalan, selectedCompany.kelurahan, selectedCompany.kecamatan, selectedCompany.kota, selectedCompany.provinsi, selectedCompany.kode_pos].filter(Boolean).join(', ') || '-'}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Deskripsi</h4>
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                  {selectedCompany.deskripsi || '-'}
                              </p>
                          </div>
                      </div>

                      {/* JSON Data Sections */}
                      <div className="space-y-6">
                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Galeri Foto</h4>
                              {renderJsonData(selectedCompany.galeri)}
                          </div>
                          
                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Penghargaan</h4>
                              {renderJsonData(selectedCompany.penghargaan)}
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Sosial Media</h4>
                              {renderJsonData(selectedCompany.sosial_media)}
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <Button onClick={() => setSelectedCompany(null)}>Tutup</Button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </div>
  );
};
