
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { menuConfig } from '../../config/menu';
import { LogOut, ChevronRight, User, LayoutDashboard, FileText, Settings, Bell, Building2, ShoppingBag, PenTool, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { routingData } from '../../services/routingData';

interface UserSidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ onLogout, isOpen, onCloseMobile }) => {
  const location = useLocation();
  const [identity, setIdentity] = useState({ logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK', nama: 'KarirKita' });
  const { user } = useAuth();

  useEffect(() => {
    routingData.getIdentity()
      .then((data: any) => {
        if (data.logoUrl) setIdentity(prev => ({...prev, logoUrl: data.logoUrl, nama: data.nama}));
      })
      .catch(err => console.error("Failed to fetch identity", err));
  }, []);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
        case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
        case 'User': return <User className="w-5 h-5" />;
        case 'Building2': return <Building2 className="w-5 h-5" />;
        case 'Briefcase': return <FileText className="w-5 h-5" />; 
        case 'FileText': return <FileText className="w-5 h-5" />; // Letters
        case 'PenTool': return <PenTool className="w-5 h-5" />; // Signature
        case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
        case 'Settings': return <Settings className="w-5 h-5" />;
        default: return <ChevronRight className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Mobile Overlay - z-index 50 to cover BottomNav (z-40) */}
      <div 
        className={cn(
            "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      {/* Sidebar Container - z-index 60 to sit above overlay */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 z-[60] h-screen w-72 bg-white/80 backdrop-blur-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)]",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header Logo */}
        <div className="h-28 flex items-center px-8 relative overflow-hidden shrink-0">
           {/* Decorative Glow */}
           <div className="absolute top-1/2 left-8 w-12 h-12 bg-blue-500/20 rounded-full blur-xl -translate-y-1/2 pointer-events-none"></div>
           
           <Link to="/" className="flex items-center gap-3 group relative z-10">
              <img src={identity.logoUrl} alt={identity.nama} className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">{identity.nama}</span>
           </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 space-y-2 no-scrollbar pb-6">
           {menuConfig.sidebarNav.map((item: any, index) => {
             // Handle Header
             if (item.header) {
                 return (
                    <p key={index} className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 mt-6 first:mt-0">
                        {item.header}
                    </p>
                 );
             }

             // Handle Link
             const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
             return (
              <Link
                key={item.href || index}
                to={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                )}
              >
                 <span className={cn(
                     "transition-all duration-300",
                     isActive ? "text-blue-100" : "text-slate-400 group-hover:text-blue-600"
                   )}>
                     {getIcon(item.icon)}
                   </span>
                   <span className="tracking-wide flex-1">{item.title}</span>
                   {isActive && <ChevronRight className="w-4 h-4 text-blue-200 animate-in slide-in-from-left-1" />}
              </Link>
             );
           })}

           {/* Explicit Notifications Link (Optional styling to match) */}
           <div className="mt-4 pt-4 border-t border-slate-100">
               <Link
                    to="/user/notifications"
                    onClick={onCloseMobile}
                    className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    location.pathname === '/user/notifications'
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                    )}
                >
                    <span className={cn(
                        "transition-all duration-300",
                        location.pathname === '/user/notifications' ? "text-blue-100" : "text-slate-400 group-hover:text-blue-600"
                    )}>
                        <Bell className="w-5 h-5" />
                    </span>
                    <span className="tracking-wide flex-1">Notifikasi</span>
               </Link>
           </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-5 mt-auto shrink-0">
            <div className="p-1 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 text-lg">
                        {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Demo User'}</p>
                        <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <p className="text-[10px] font-bold text-slate-500 tracking-wide">Pro Member</p>
                        </div>
                    </div>
                </div>
                
                <div className="px-2 pb-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                    >
                        <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        Keluar
                    </button>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};
