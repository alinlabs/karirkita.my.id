
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight, HelpCircle, FileText, Shield, Mail, Home, Search, Users, Building2, Zap, GraduationCap } from 'lucide-react';
import { cn } from '../../utils/cn';
import { menuConfig } from '../../config/menu';
import { Button } from '../ui/Button';
import { routingData } from '../../services/routingData';
import { Translate } from './Translate';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [identity, setIdentity] = useState({ 
    nama: 'KarirKita', 
    logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK' 
  });

  // Fetch Identity for Logo
  useEffect(() => {
    routingData.getIdentity()
      .then((data: any) => {
        if (data.logoUrl) setIdentity(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.error("Failed to fetch identity in sidebar", err));
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const getNavIcon = (href: string) => {
    switch (href) {
        case '/': return <Home className="w-5 h-5" />;
        case '/pekerjaan': return <Search className="w-5 h-5" />;
        case '/pelamar': return <Users className="w-5 h-5" />;
        case '/perusahaan': return <Building2 className="w-5 h-5" />;
        case '/kelas': return <GraduationCap className="w-5 h-5" />;
        default: return <ChevronRight className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[70] w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-cubic-bezier md:hidden flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
           <Link to="/" className="flex items-center gap-2.5">
               <img 
                 src={identity.logoUrl} 
                 alt={identity.nama} 
                 className="h-9 w-9 object-contain rounded-xl" 
               />
               <span className="text-lg font-bold text-slate-900 tracking-tight">{identity.nama}</span>
           </Link>
           <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            
            {/* Main Menu */}
            <div>
                <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Navigasi Utama</p>
                <div className="space-y-1">
                    {menuConfig.mainNav.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                        return (
                            <Link 
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-50 text-blue-600" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "transition-colors",
                                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                                    )}>
                                        {getNavIcon(item.href)}
                                    </span>
                                    {item.title}
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Promosi Menu */}
            <div>
                <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Promosi</p>
                <Link to="/penawaran" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 group">
                    <div className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Zap className="w-3 h-3" />
                    </div>
                    Pasang Iklan Premium
                </Link>
            </div>

            {/* Support Menu */}
            <div>
                <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bantuan & Legal</p>
                <div className="space-y-1">
                    <Link to="/faq" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 group">
                        <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" /> Pusat Bantuan
                    </Link>
                    <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 group">
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" /> Hubungi Kami
                    </Link>
                    <Link to="/privacy" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 group">
                        <Shield className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" /> Kebijakan Privasi
                    </Link>
                    <Link to="/terms" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 group">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" /> Syarat & Ketentuan
                    </Link>
                </div>
            </div>

            {/* Settings */}
            <div>
                <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pengaturan</p>
                <div className="px-2">
                    <Translate className="w-full justify-between bg-slate-50 border-slate-100" />
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Link to="/register">
                <Button className="w-full justify-center rounded-xl shadow-lg shadow-blue-600/10">
                    Daftar Akun Gratis <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </Link>
            <p className="text-[10px] text-center text-slate-400 mt-4">
                &copy; {new Date().getFullYear()} {identity.nama}.
            </p>
        </div>

      </div>
    </>
  );
};
