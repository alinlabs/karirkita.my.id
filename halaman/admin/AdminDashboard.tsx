
import React from 'react';
import { Card } from '../../komponen/ui/Card';
import { useData } from '../../context/DataContext';
import { Briefcase, Building2, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const { jobs, companies, talents } = useData();

  const stats = [
    { title: 'Total Lowongan', value: jobs.length, icon: Briefcase, color: 'bg-blue-500' },
    { title: 'Total Perusahaan', value: companies.length, icon: Building2, color: 'bg-purple-500' },
    { title: 'Total Kandidat', value: talents.length, icon: Users, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 flex items-center gap-4 shadow-sm border-none">
            <div className={`p-4 rounded-2xl text-white ${stat.color} shadow-lg shadow-slate-200`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Companies */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Perusahaan Terbaru</h2>
          <div className="space-y-4">
            {companies.slice(0, 5).map((comp) => (
              <div key={comp.perusahaan_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <img src={comp.logo_url} alt={comp.nama} className="w-10 h-10 rounded-lg object-contain bg-white" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{comp.nama}</h4>
                  <p className="text-xs text-slate-500">{comp.industri}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Jobs */}
        <div className="lg:col-span-2">
            <Card className="p-6 h-full">
            <h2 className="text-lg font-bold mb-4">Lowongan Terbaru</h2>
            <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                <div key={job.lowongan_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{job.posisi}</h4>
                    <p className="text-xs text-slate-500">{job.perusahaan.nama}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-white rounded border border-slate-200 text-slate-600">{job.tipe_pekerjaan}</span>
                </div>
                ))}
            </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
