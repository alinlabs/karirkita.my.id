import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';

export const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-900 bg-white">
      <Navbar />
      {/* Add padding bottom on mobile to accommodate Bottom Navigation */}
      <main className="flex-grow flex flex-col pb-20 md:pb-0 relative">
        <AnimatePresence mode="popLayout">
           <PageTransition key={location.pathname} className="flex-grow flex flex-col w-full">
              <Outlet />
           </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};