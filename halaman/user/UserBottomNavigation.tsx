
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Building2, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

export const UserBottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Nav Items Configuration for User Panel
  const navItems = [
    { 
      label: 'Dashboard', 
      href: '/user/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      label: 'Surat', 
      href: '/user/letters', 
      icon: FileText 
    },
    { 
      label: 'Profil CV', 
      href: '/user/profile', 
      icon: User, 
      isFloating: true 
    },
    { 
      label: 'Bisnis', 
      href: '/user/company', 
      icon: Building2 
    },
    { 
      label: 'Akun', 
      href: '/user/settings', 
      icon: Settings 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none">
      {/* Container Curve Effect */}
      <div className="relative h-20 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-5px_30px_rgba(0,0,0,0.08)] rounded-t-[2rem] pointer-events-auto pb-safe">
        <div className="flex justify-around items-center h-full px-2">
          
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            
            if (item.isFloating) {
              return (
                <div key={index} className="relative -top-8 group">
                   <Link 
                     to={item.href}
                     className={cn(
                       "flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg border-4 border-slate-50 transform transition-all duration-300 active:scale-95",
                       active 
                        ? "bg-blue-600 text-white shadow-blue-600/40" 
                        : "bg-white text-slate-600 shadow-slate-200"
                     )}
                   >
                     <item.icon className="w-7 h-7" />
                   </Link>
                   <span className={cn(
                       "absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap transition-opacity",
                       active ? "text-blue-600 opacity-100" : "text-slate-500 opacity-0"
                   )}>
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
