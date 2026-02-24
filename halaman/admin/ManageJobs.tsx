
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Plus, Trash2, Search, MapPin, Briefcase, Calendar, Edit, Building2, Eye, X, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { cn } from '../../utils/cn';
import { createPortal } from 'react-dom';
import { Lowongan } from '../../types';

export const ManageJobs = () => {
  const { jobs, deleteJob } = useData();
  const { toast, showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Lowongan | null>(null);

  const filtered = jobs.filter(j => 
      j.posisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.perusahaan.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
      if(window.confirm('Hapus lowongan ini?')) {
          deleteJob(id);
          showToast({ message: 'Lowongan dihapus', type: 'error' });
      }
  };

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
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h1 className="text-xl font-bold text-slate-900">Kelola Lowongan</h1>
            <p className="text-slate-500 text-sm">Total {jobs.length} lowongan aktif</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Cari posisi atau perusahaan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link to="/admin/jobs/new">
                <Button className="w-full sm:w-auto rounded-xl shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4 mr-2" /> Posting Baru
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(job => (
            <div key={job.lowongan_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                    {job.perusahaan?.logo_url ? (
                        <img src={job.perusahaan.logo_url} className="w-8 h-8 object-contain" />
                    ) : (
                        <Briefcase className="w-6 h-6 text-slate-400" />
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg truncate">{job.posisi}</h3>
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                            job.status === 'Active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        )}>
                            {job.status || 'Active'}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Building2 className="w-3.5 h-3.5" /> {job.perusahaan.nama}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.lokasi}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(job.created_at || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full md:w-auto border-slate-200 text-slate-600"
                        onClick={() => setSelectedJob(job)}
                    >
                        <Eye className="w-4 h-4 mr-2" /> Detail
                    </Button>
                    <Link to={`/admin/jobs/${job.lowongan_id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" size="sm" className="w-full md:w-auto border-slate-200 text-slate-600">
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                    </Link>
                    <button 
                        onClick={() => handleDelete(job.lowongan_id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500">Tidak ada data lowongan.</p>
          </div>
      )}

      {/* Detail Modal */}
      {selectedJob && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                          <h2 className="text-xl font-bold text-slate-900">Detail Lowongan</h2>
                          <p className="text-slate-500 text-sm">ID: {selectedJob.lowongan_id}</p>
                      </div>
                      <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-500" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Job Header */}
                      <div className="flex items-start gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 p-3 flex items-center justify-center">
                              {selectedJob.perusahaan?.logo_url ? (
                                  <img src={selectedJob.perusahaan.logo_url} className="w-full h-full object-contain" />
                              ) : (
                                  <Briefcase className="w-8 h-8 text-slate-400" />
                              )}
                          </div>
                          <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900">{selectedJob.posisi}</h3>
                              <p className="text-slate-600 font-medium flex items-center gap-2">
                                  <Building2 className="w-4 h-4" /> {selectedJob.perusahaan.nama}
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedJob.lokasi}</span>
                                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {selectedJob.tipe_pekerjaan}</span>
                                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {selectedJob.rentang_gaji || 'Gaji Dirahasiakan'}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedJob.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                      Status: {selectedJob.status || 'Active'}
                                  </span>
                              </div>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Deskripsi Pekerjaan</h4>
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                  {selectedJob.deskripsi_pekerjaan || '-'}
                              </p>
                          </div>

                          <div className="space-y-6">
                              <div>
                                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Kualifikasi</h4>
                                  {renderJsonData(selectedJob.kualifikasi)}
                              </div>
                              
                              <div>
                                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Fasilitas</h4>
                                  {renderJsonData(selectedJob.fasilitas)}
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <Button onClick={() => setSelectedJob(null)}>Tutup</Button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </div>
  );
};
