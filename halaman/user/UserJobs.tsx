
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, Building2, Search, Eye, Clock, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Lowongan } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../hooks/useAuth';

export const UserJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Active' | 'Closed' | 'Draft'>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const { formatCurrencyString } = useSettings();

  // Load Data
  useEffect(() => {
    // 1. Fetch all data needed
    Promise.all([
        routingData.getJobs(),
        routingData.getCompanies()
    ]).then(([jobsData, companiesData]) => {
        
        // Dynamic search for user's company based on User ID
        let myCompany = companiesData.find(c => c.user_id === user?.id);
        
        // Fallback for Demo User 001 if mapping fails
        if (!myCompany && user?.id === 'user-001') {
             myCompany = companiesData.find(c => c.perusahaan_id === 'c1');
        }

        const myCompanyId = myCompany?.perusahaan_id;

        if (myCompanyId) {
            const mappedJobs = jobsData
                .filter(j => j.perusahaan_id === myCompanyId)
                .map(j => ({
                    id: j.lowongan_id, // Map lowongan_id to id for local usage
                    title: j.posisi,
                    type: j.tipe_pekerjaan,
                    location: j.lokasi, // Updated
                    salary: j.rentang_gaji ? formatCurrencyString(j.rentang_gaji) : 'Undisclosed',
                    applicants: j.total_pelamar || 0,
                    status: j.status || 'Active', 
                    postedAt: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'N/A', // Updated
                    views: j.dilihat || 0 // Updated
                }));
            setJobs(mappedJobs);
        } else {
            setJobs([]);
        }
    });
  }, [user]);

  const filteredJobs = jobs.filter(job => 
    job.status === activeTab && 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Kelola Lowongan</h1>
           <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Pantau performa lowongan dan kelola kandidat pelamar.</p>
        </div>
        <Link to="/user/jobs/new" className="w-full md:w-auto">
          <Button className="h-12 px-6 rounded-2xl shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 font-bold transition-transform hover:-translate-y-1 w-full justify-center">
            <Plus className="w-5 h-5 mr-2" /> Buat Lowongan Baru
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-2 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4 shadow-lg shadow-slate-200/40">
          <div className="flex p-1.5 bg-slate-50/80 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
              {['Active', 'Closed', 'Draft'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex-1 md:flex-none",
                        activeTab === tab 
                            ? "bg-white text-blue-600 shadow-md transform scale-105" 
                            : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    )}
                  >
                      {tab}
                  </button>
              ))}
          </div>
          
          <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari judul lowongan..."
                className="pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none w-full transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Job List */}
      <div className="grid gap-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <Card key={job.id} className="group p-0 overflow-hidden border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 rounded-[2rem]">
                <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Main Info */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {job.title}
                            </h3>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                job.status === 'Active' ? "bg-green-100 text-green-700" : 
                                job.status === 'Closed' ? "bg-slate-100 text-slate-600" : "bg-orange-100 text-orange-700"
                            )}>
                                {job.status}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 md:gap-6 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Building2 className="w-4 h-4 text-slate-400"/> {job.type}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <MapPin className="w-4 h-4 text-slate-400"/> {job.location}
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg text-green-700 border border-green-100">
                                {job.salary}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                            <Clock className="w-3.5 h-3.5" /> Diposting: {job.postedAt}
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                        <div className="flex gap-8 w-full sm:w-auto justify-around sm:justify-start">
                            <div className="text-center group/stat cursor-default">
                                <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-2xl group-hover/stat:text-blue-600 transition-colors">
                                    {job.applicants}
                                    <Users className="w-5 h-5 text-slate-300 group-hover/stat:text-blue-400" />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pelamar</span>
                            </div>
                            <div className="text-center group/stat cursor-default">
                                <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-2xl group-hover/stat:text-blue-600 transition-colors">
                                    {job.views}
                                    <Eye className="w-5 h-5 text-slate-300 group-hover/stat:text-blue-400" />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dilihat</span>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 flex-1 sm:w-10 sm:flex-none justify-center p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 border-slate-200"
                                onClick={() => navigate(`/user/jobs/${job.id}/edit`)}
                            >
                                <Edit2 className="w-4 h-4" /> <span className="sm:hidden ml-2">Edit</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 flex-1 sm:w-10 sm:flex-none justify-center p-0 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 border-slate-200"
                                onClick={() => handleDelete(job.id)}
                            >
                                <Trash2 className="w-4 h-4" /> <span className="sm:hidden ml-2">Hapus</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak ada lowongan ditemukan</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Kami tidak dapat menemukan lowongan dengan status <span className="font-bold text-slate-700">{activeTab}</span> atau kata kunci tersebut.
            </p>
            {activeTab !== 'Active' && (
                <Button variant="outline" onClick={() => {setActiveTab('Active'); setSearchTerm('')}} className="rounded-xl">Reset Filter</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
