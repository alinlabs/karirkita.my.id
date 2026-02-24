
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserSidebar } from './UserSidebar';
import { UserHeader } from './UserHeader';
import { UserBottomNavigation } from './UserBottomNavigation';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../komponen/umum/PageTransition';

export const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Dynamic Sidebar */}
      <UserSidebar 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onCloseMobile={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        
        {/* Premium Header */}
        <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Content Wrapper - Added extra padding bottom for mobile nav */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto overflow-x-hidden pb-28 md:pb-8">
           <div className="max-w-6xl mx-auto w-full">
              <AnimatePresence mode="wait">
                  <PageTransition key={location.pathname}>
                      <React.Suspense fallback={null}>
                          <Outlet />
                      </React.Suspense>
                  </PageTransition>
              </AnimatePresence>
           </div>
        </main>

        {/* Mobile Bottom Navigation for User */}
        <UserBottomNavigation />
      </div>
    </div>
  );
};
