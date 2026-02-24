import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Search, Users, LogIn, UserCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

export const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Nav Items Configuration
  const navItems = [
    { 
      label: 'Beranda', 
      href: '/', 
      icon: Home 
    },
    { 
      label: 'Perusahaan', 
      href: '/perusahaan', 
      icon: Building2 
    },
    { 
      label: 'Cari Kerja', 
      href: '/pekerjaan', 
      icon: Search, 
      isFloating: true 
    },
    { 
      label: 'Talent', 
      href: '/pelamar', 
      icon: Users 
    },
    { 
      label: isAuthenticated ? 'Akun' : 'Masuk', 
      href: isAuthenticated ? '/user/dashboard' : '/login', 
      icon: isAuthenticated ? UserCircle : LogIn 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
      {/* Container Curve Effect */}
      <div className="relative h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[2rem] pointer-events-auto pb-safe">
        <div className="flex justify-around items-center h-full px-2">
          
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            
            if (item.isFloating) {
              return (
                <div key={index} className="relative -top-8 group">
                   <Link 
                     to={item.href}
                     className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border-4 border-slate-50 transform transition-all duration-300 active:scale-95 group-hover:shadow-blue-600/50 group-hover:-translate-y-1"
                   >
                     <item.icon className="w-7 h-7" />
                   </Link>
                   <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                     {item.label}
                   </span>
                </div>
              );
            }

            return (
              <Link 
                key={index} 
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-1 transition-all duration-300",
                  active ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-300",
                    active && "bg-blue-50 -translate-y-1"
                )}>
                    <item.icon className={cn("w-5 h-5", active && "fill-current")} />
                </div>
                <span className={cn(
                    "text-[10px] font-medium transition-all duration-300",
                    active ? "font-bold scale-105" : "scale-100"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
};