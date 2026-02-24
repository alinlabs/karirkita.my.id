
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Text } from '../../komponen/ui/Text';
import { UniversalLottie } from '../../komponen/ui/UniversalLottie';
import { Users, CheckCircle2, Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../komponen/umum/PageTransition';
import { routingData } from '../../services/routingData';

export const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  const [content, setContent] = useState({
    lottie: isRegister 
        ? 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/WorkHard.lottie' 
        : 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/IndonesiaConnect.lottie',
    title: isRegister 
        ? "Ayo bergabung! buat profil digital terbaik masa kini!" 
        : "Terkoneksi Dengan Seluruh Pencari Talenta Indonesia"
  });

  const getLottieUrl = (urlOrFilename: string) => {
      if (!urlOrFilename) return '';
      if (urlOrFilename.startsWith('http') || urlOrFilename.startsWith('/')) return urlOrFilename;
      // Assume it's a filename in the standard repo location
      return `https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/${urlOrFilename}`;
  };

  useEffect(() => {
    routingData.getPageData().then(data => {
        if (data) {
            const section = isRegister ? 'register' : 'login';
            const pageData = data[section];
            if (pageData) {
                const tampilan = pageData.tampilan || {};
                
                // Prioritize tampilan.hero -> default
                let heroLottie = tampilan.hero || 
                                   (isRegister 
                                    ? 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/WorkHard.lottie' 
                                    : 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/IndonesiaConnect.lottie');
                
                heroLottie = getLottieUrl(heroLottie);

                // Prioritize tampilan.judul -> default
                const heroTitle = tampilan.judul || content.title;

                setContent({
                    lottie: heroLottie,
                    title: heroTitle
                });
            }
        }
    });
  }, [isRegister]);

  // Dummy Avatars for Facepile
  const avatars = [
    "https://placehold.co/100x100/2563eb/ffffff?text=A",
    "https://placehold.co/100x100/e11d48/ffffff?text=B",
    "https://placehold.co/100x100/059669/ffffff?text=C",
    "https://placehold.co/100x100/d97706/ffffff?text=D"
  ];

  return (
    <div className="h-screen flex bg-white overflow-hidden font-sans">
      
      {/* LEFT SIDE: FORM CONTAINER */}
      {/* UPDATE: Removed default padding on mobile (p-0) to allow custom headers */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-slate-50 lg:bg-white relative z-10 no-scrollbar">
        <div className="min-h-full flex flex-col justify-center p-0 lg:p-20">
            <AnimatePresence mode="wait">
                <PageTransition key={location.pathname} className="w-full">
                    <Outlet />
                </PageTransition>
            </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE: LOTTIE & TEXT (Clean Look with Stats) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 h-full flex-col items-center justify-center p-12 text-center overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
            
            {/* Lottie Container (Clean) */}
            <div className="w-full h-80 mb-6 drop-shadow-xl">
                <UniversalLottie src={content.lottie} />
            </div>
            
            <h2 className="text-3xl xl:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
                <Text>{content.title}</Text>
            </h2>
            
            <p className="text-slate-500 text-lg font-medium mb-8">
                <Text>Platform ekosistem karir terpercaya di Purwakarta dan Indonesia.</Text>
            </p>

            {/* Static Stats Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                
                {/* Stat 1: User Count (Facepile) */}
                <div className="bg-white p-3 pr-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 transition-transform hover:scale-105 cursor-default">
                    <div className="flex -space-x-3 shrink-0">
                        {avatars.map((src, idx) => (
                            <img 
                                key={idx} 
                                src={src} 
                                alt="User" 
                                className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                            />
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                            99+
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-900 text-xs">10k+ Talenta</p>
                        <p className="text-[10px] text-slate-500 font-medium">Telah Bergabung</p>
                    </div>
                </div>

                {/* Stat 2: Trust Badge */}
                <div className="bg-white p-3 pr-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 transition-transform hover:scale-105 cursor-default">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-900 text-xs">Akun Terverifikasi</p>
                        <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">(5.0)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Footer decoration */}
        <div className="absolute bottom-8 text-xs text-slate-400 font-medium flex items-center gap-2">
            <Users className="w-3 h-3" /> &copy; {new Date().getFullYear()} KarirKita Indonesia
        </div>
      </div>
    </div>
  );
};
