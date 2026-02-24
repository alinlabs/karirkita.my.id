
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';

interface UserHeaderProps {
  onOpenSidebar: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const [identity, setIdentity] = useState({ logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK', nama: 'KarirKita' });

  useEffect(() => {
    routingData.getIdentity()
      .then(data => {
        if (data) setIdentity(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.error("Failed to fetch identity", err));
  }, []);
  
  return (
    <header className="h-20 md:h-24 bg-slate-50/50 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 sm:px-8 transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button 
            onClick={onOpenSidebar}
            className="md:hidden p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95"
        >
            <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Logo & Text */}
        <Link to="/" className="md:hidden flex items-center gap-2.5">
            <img 
              src={identity.logoUrl} 
              alt="Logo" 
              className="h-8 w-8 object-contain rounded-lg shadow-sm bg-white p-0.5 border border-slate-100" 
            />
            <span className="font-bold text-lg text-slate-900 tracking-tight">{identity.nama}</span>
        </Link>

        {/* Breadcrumbs (Desktop) */}
        <nav className="hidden sm:flex items-center text-sm">
            <span className="text-slate-400 font-medium">Panel</span>
            {pathSegments.slice(1).map((segment: string, index: number) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                    <span className="capitalize font-bold tracking-tight text-slate-800">
                        {segment.replace('-', ' ')}
                    </span>
                </React.Fragment>
            ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative group">
            <Search className="w-4 h-4 absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="h-11 pl-11 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none w-64 transition-all placeholder:text-slate-400 shadow-sm"
            />
        </div>

        {/* Notifications */}
        <Link to="/user/notifications">
            <button className="relative p-2.5 md:p-3 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-md rounded-2xl transition-all duration-300 group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>
        </Link>
        
        {/* Separator */}
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
        
        {/* Avatar */}
        <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-white p-1 shadow-sm border border-slate-100 cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center">
                 <span className="font-bold text-xs md:text-sm text-blue-700">US</span>
            </div>
        </div>
      </div>
    </header>
  );
};
