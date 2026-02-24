
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { LayoutDashboard, Building2, Briefcase, LogOut, Settings, X, Globe, ShieldCheck, Users, Bell, BookOpen, LayoutTemplate } from 'lucide-react';
import { routingData } from '../../services/routingData';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const [identity, setIdentity] = useState({ logoUrl: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png', nama: 'KarirKita' });

  useEffect(() => {
    try {
        routingData.getIdentity().then((data: any) => {
          if (data && data.logoUrl) {
              setIdentity(prev => ({...prev, logoUrl: data.logoUrl, nama: data.nama || 'KarirKita'}));
          }
        }).catch(err => {
            console.warn("Failed to fetch identity", err);
        });
    } catch (e) {
        console.warn("Error in AdminSidebar effect", e);
    }
  }, []);

  const menuItems = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Pengguna', href: '/admin/users', icon: Users },
    { title: 'Perusahaan', href: '/admin/companies', icon: Building2 },
    { title: 'Lowongan', href: '/admin/jobs', icon: Briefcase },
    { title: 'Notifikasi', href: '/admin/notifications', icon: Bell }, // New Menu Item
    { title: 'Manajemen Kelas', href: '/admin/classes', icon: BookOpen },
    { title: 'Tampilan Halaman', href: '/admin/pages', icon: LayoutTemplate },
    { title: 'Pengaturan Situs', href: '/admin/settings', icon: Globe },
    { title: 'Opsi Pilihan', href: '/admin/options', icon: Settings },
    { title: 'Skill Pilihan', href: '/admin/skills', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
            "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-white text-slate-900 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-200 shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 relative">
           <div className="flex items-center gap-3">
              <img src={identity.logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded-lg bg-slate-50 p-0.5 border border-slate-100" />
              <div>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">{identity.nama}</h1>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                    <ShieldCheck className="w-3 h-3" /> Administrator
                  </span>
              </div>
           </div>
           <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-900 lg:hidden">
             <X className="w-6 h-6" />
           </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">Menu Utama</p>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
                <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />}
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                {item.title}
                </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sistem
          </button>
        </div>
      </aside>
    </>
  );
};
