
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../komponen/umum/PageTransition';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-purple-100 selection:text-purple-700">
      {/* Sidebar - Mobile Drawer & Desktop Fixed */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-72">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
           <div className="max-w-7xl mx-auto w-full pb-20">
              <AnimatePresence mode="wait">
                  <PageTransition key={location.pathname}>
                      <React.Suspense fallback={null}>
                          <Outlet />
                      </React.Suspense>
                  </PageTransition>
              </AnimatePresence>
           </div>
        </main>
      </div>
    </div>
  );
};
