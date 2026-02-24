
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft, Home, Users, Building2, Search, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { menuConfig } from '../../config/menu';
import { Sidebar } from './Sidebar';
import { Translate } from './Translate';
import { routingData } from '../../services/routingData';
import { useData } from '../../context/DataContext';
import { Identitas } from '../../types';

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { jobs, companies, talents } = useData(); 

  const [identity, setIdentity] = useState<Partial<Identitas>>({ 
    nama: 'KarirKita', 
    logoUrl: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png'
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Logic to identify Detail Pages where Nav should be hidden/custom
  const isPersonalDetail = pathSegments[0] === 'profil' && pathSegments.length > 1;
  const isCompanyDetail = pathSegments[0] === 'perusahaan' && pathSegments.length > 1;
  const isJobDetail = pathSegments[0] === 'pekerjaan' && pathSegments.length > 1;
  const isImmersiveDetail = isPersonalDetail || isCompanyDetail || isJobDetail;

  // Pages other than Home should have transparent header initially with gradient
  // Home page should be purely transparent initially
  const showSolidBackground = isScrolled; 
  
  // Determine Text Color
  const useWhiteText = !isHomePage && !isScrolled;

  // --- ADAPTIVE LOGO TEXT LOGIC ---
  let logoTitle = identity.nama || 'KarirKita';
  let logoSubtitle = identity.tagline || "Jembatan Karir Masa Depan";

  if (isJobDetail) {
      const slug = pathSegments[1];
      const job = jobs.find(j => j.slug === slug);
      if (job) {
          logoTitle = job.posisi;
          logoSubtitle = identity.nama || 'KarirKita';
      }
  } else if (isCompanyDetail) {
      const slug = pathSegments[1];
      const comp = companies.find(c => c.slug === slug);
      if (comp) {
          logoTitle = comp.nama;
          logoSubtitle = identity.nama || 'KarirKita';
      }
  } else if (isPersonalDetail) {
      const username = pathSegments[1];
      const talent = talents.find(t => t.username === username);
      if (talent) {
          logoTitle = talent.nama_lengkap;
          logoSubtitle = identity.nama || 'KarirKita';
      }
  }

  useEffect(() => {
    routingData.getIdentity()
      .then(data => {
        if(data) setIdentity(data);
      })
      .catch(err => console.error("Failed to fetch identity", err));

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Back Logic - Returns to main category list or Home based on context
  const handleBack = () => {
    const currentPath = location.pathname;
    
    // 1. If on Main Listing Pages, go to Home
    if (currentPath === '/pekerjaan' || currentPath === '/perusahaan' || currentPath === '/pelamar') {
        navigate('/');
        return;
    }

    // 2. If on Detail Pages, go back to their respective Listing pages
    const section = pathSegments[0];
    if (section === 'pekerjaan') {
        navigate('/pekerjaan');
    } else if (section === 'perusahaan') {
        navigate('/perusahaan');
    } else if (section === 'profil') {
        navigate('/pelamar'); 
    } else {
        navigate(-1); // Default fallback
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    if (href === '/pelamar' && location.pathname.startsWith('/profil')) return true;
    return false;
  };

  const getIcon = (href: string) => {
    switch(href) {
        case '/': return <Home className="w-4 h-4" />;
        case '/pekerjaan': return <Search className="w-4 h-4" />;
        case '/pelamar': return <Users className="w-4 h-4" />;
        case '/perusahaan': return <Building2 className="w-4 h-4" />;
        case '/kelas': return <GraduationCap className="w-4 h-4" />;
        default: return null;
    }
  };

  // Determine Background Class based on state
  const getNavBackgroundClass = () => {
    if (showSolidBackground) {
        return "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-2";
    }
    if (isHomePage) {
        return "bg-transparent py-4 border-none"; // Transparent on Home, NO border
    }
    return "bg-gradient-to-b from-black/50 to-transparent py-4 border-none"; // Gradient on others, NO border
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 z-50 w-full transition-[padding,background-color,border-color,box-shadow] duration-300 ease-in-out",
          getNavBackgroundClass()
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            
            <div className="flex items-center gap-4">
              {!isHomePage && (
                <button 
                  onClick={handleBack}
                  className={cn(
                    "p-2 -ml-2 rounded-full transition-all duration-300 group",
                    useWhiteText 
                      ? "text-white hover:bg-white/20" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                  aria-label="Kembali"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              )}

              {/* Logo Section */}
              <Link to="/" className="flex items-center gap-3 group">
                 <img 
                   src={identity.logoUrl} 
                   alt={identity.nama} 
                   className="h-9 w-9 object-contain rounded-xl shadow-sm bg-white p-0.5" 
                 />
                 <div className="flex flex-col gap-0.5">
                    <span className={cn("text-lg font-bold tracking-tight leading-none transition-colors duration-300 line-clamp-1 max-w-[200px] md:max-w-xs", useWhiteText ? "text-white drop-shadow-md" : "text-slate-900")}>
                        {logoTitle}
                    </span>
                    <span className={cn("text-[10px] font-medium tracking-wide uppercase opacity-90 leading-none transition-colors duration-300", useWhiteText ? "text-white/90 drop-shadow-sm" : "text-slate-500")}>
                        {logoSubtitle}
                    </span>
                 </div>
              </Link>
            </div>

            {/* Main Navigation - Hidden on Detail Pages */}
            {!isImmersiveDetail && (
                <div className="hidden md:flex items-center gap-1">
                <div className="flex items-center gap-6">
                    {menuConfig.mainNav.map((link) => {
                    const active = isLinkActive(link.href);
                    return (
                        <Link
                        key={link.href}
                        to={link.href}
                        className={cn(
                            "relative text-sm font-bold transition-all duration-300 flex items-center gap-2",
                            useWhiteText 
                            ? (active ? "text-blue-400" : "text-white/80 hover:text-white") 
                            : (active ? "text-blue-600" : "text-slate-500 hover:text-slate-900")
                        )}
                        >
                        {getIcon(link.href)}
                        {link.title}
                        </Link>
                    );
                    })}
                </div>
                </div>
            )}

            {/* Translate & Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Translate className={useWhiteText ? "text-white hover:bg-white/20 border-white/20" : "text-slate-700 hover:bg-slate-100 border-transparent"} />

              <Link to="/login">
                <Button 
                  size="sm" 
                  className={cn(
                      "rounded-full px-6 shadow-none font-bold",
                      useWhiteText 
                          ? "bg-white text-blue-600 hover:bg-blue-50 border-none"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  )}
                >
                  Masuk
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                {!isImmersiveDetail && (
                    <button 
                    className={cn(
                        "p-2 transition-colors rounded-lg",
                        useWhiteText ? "text-white hover:bg-white/20" : "text-slate-600 hover:bg-slate-100"
                    )}
                    onClick={() => setIsSidebarOpen(true)}
                    >
                    <Menu />
                    </button>
                )}
                {isImmersiveDetail && (
                     <Link to="/login">
                        <Button 
                        size="sm" 
                        className={cn(
                            "rounded-full px-4 text-xs shadow-none font-bold",
                            useWhiteText 
                                ? "bg-white text-blue-600 border-none"
                                : "bg-blue-600 text-white"
                        )}
                        >
                        Masuk
                        </Button>
                    </Link>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Render the Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
