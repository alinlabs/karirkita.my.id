
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  
  // Format Breadcrumb
  const getPageTitle = () => {
      const parts = location.pathname.split('/');
      // parts[0] is empty, parts[1] is 'admin', parts[2] is the page
      const path = parts[2];
      if (!path) return 'Dashboard';
      return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 sm:px-8 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button 
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            <Menu className="w-6 h-6" />
        </button>
        
        <h2 className="text-lg md:text-xl font-bold text-slate-800 capitalize">
            {getPageTitle().replace('-', ' ')}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">Super Admin</span>
            <span className="text-[10px] text-slate-500">karirkita.my.id</span>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
            <User className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </header>
  );
};
