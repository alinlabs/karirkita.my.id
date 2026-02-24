
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, Building2, Users, Smile, ShieldCheck, Clock, Filter } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { routingData } from '../../services/routingData';
import { Text } from '../../komponen/ui/Text';
import { UniversalLottie } from '../../komponen/ui/UniversalLottie';
import { Mitra } from '../../types';
import { Skeleton } from '../../komponen/ui/Skeleton';
import { Link, useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Mitra[]>([]);
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  // Location & Time State
  const [currentTime, setCurrentTime] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('Menemukan lokasi...');
  
  // Search State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  // Initialize as NULL to prevent showing hardcoded text before fetch
  const [heroText, setHeroText] = useState<{
    badge: string;
    title: string;
    description: string;
  } | null>(null);

  const [lotties, setLotties] = useState({
    left: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/WorkHard.lottie',
    right: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/Interview.lottie',
    mobile: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/IndonesiaConnect.lottie'
  });
  
  // Stats State - Initialized with loading placeholders
  const [stats, setStats] = useState([
    { icon: Briefcase, label: 'Loker Aktif', value: '...' },
    { icon: Building2, label: 'Perusahaan', value: '...' },
    { icon: Users, label: 'Talenta Nusantara', value: '...' },
    { icon: Smile, label: 'Terekrut', value: '...' },
  ]);

  // Job Categories State
  const [categories, setCategories] = useState<{
    label: string;
    icon: string;
    bg?: string;
    accent?: string;
  }[]>([]);

  useEffect(() => {
    // Time Update
    const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    // Location Request
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 1. Try GPS + OpenStreetMap (High Precision: Village/District)
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.address) {
                            const village = data.address.village || data.address.hamlet;
                            const district = data.address.suburb || data.address.neighbourhood || data.address.district;
                            const city = data.address.city || data.address.town || data.address.county;
                            const state = data.address.state;
                            
                            let locationString = city || state || 'Lokasi Terdeteksi';
                            
                            // Format: "Desa, Kota" or "Kecamatan, Kota"
                            if (village && district) {
                                locationString = `${village}, ${district}`;
                            } else if (district && city) {
                                locationString = `${district}, ${city}`;
                            } else if (city && state) {
                                locationString = `${city}, ${state}`;
                            }
                            
                            setUserLocation(locationString);
                            setSearchLocation(locationString);
                        } else {
                            setUserLocation('Lokasi Terkini');
                            setSearchLocation('Indonesia');
                        }
                    })
                    .catch(() => {
                        setUserLocation('Lokasi Terdeteksi');
                        setSearchLocation('Indonesia');
                    });
            },
            () => {
                // 2. Fallback: IP Geolocation (Medium Precision: City)
                fetch('https://ipapi.co/json/')
                    .then(res => res.json())
                    .then(data => {
                        if (data.city) {
                            const loc = `${data.city}, ${data.region || 'Indonesia'}`;
                            setUserLocation(loc);
                            setSearchLocation(loc);
                        } else {
                            setUserLocation('Indonesia');
                            setSearchLocation('Indonesia');
                        }
                    })
                    .catch(() => {
                        setUserLocation('Indonesia');
                        setSearchLocation('Indonesia');
                    });
            }
        );
    } else {
        setUserLocation('Indonesia');
        setSearchLocation('Indonesia');
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Identity & Stats
            const identityData: any = await routingData.getIdentity();
            if (identityData) {
                if (identityData.mitra) setPartners(identityData.mitra);
                
                // Stats from Identity
                if (identityData.statistik && Array.isArray(identityData.statistik)) {
                    const kvStats = identityData.statistik;
                    setStats([
                        { icon: Briefcase, label: kvStats[0]?.label || 'Loker Aktif', value: kvStats[0]?.nilai || '...' },
                        { icon: Building2, label: kvStats[1]?.label || 'Perusahaan', value: kvStats[1]?.nilai || '...' },
                        { icon: Users, label: kvStats[2]?.label || 'Talenta Nusantara', value: kvStats[2]?.nilai || '...' },
                        { icon: Smile, label: kvStats[3]?.label || 'Terekrut', value: kvStats[3]?.nilai || '...' },
                    ]);
                }

                // Categories from Identity (KV 'karirkita')
                if (identityData.kategori && Array.isArray(identityData.kategori)) {
                    setCategories(identityData.kategori);
                }
            }

            // 2. Fetch Page Data (Metatag) for Hero Text & Animation
            const metaData: any = await routingData.getPageData();
            if (metaData && metaData.beranda) {
                const beranda = metaData.beranda;
                const isMobile = window.innerWidth < 768;
                const content = isMobile ? beranda.mobile : beranda.desktop;

                setHeroText({
                    badge: "Platform Karir No. #1 Indonesia", 
                    title: content.judul || "Temukan Karir di Negeri Nusantara",
                    description: content.deskripsi || "Hubungkan potensimu dengan ribuan peluang di Kawasan Industri dan perusahaan terkemuka."
                });
                
                // Fetch Animations
                const baseUrl = 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/';
                const lottie = beranda.lottie || {};
                
                setLotties({
                    left: lottie.kiri ? (lottie.kiri.startsWith('http') ? lottie.kiri : `${baseUrl}${lottie.kiri}`) : `${baseUrl}WorkHard.lottie`,
                    right: lottie.kanan ? (lottie.kanan.startsWith('http') ? lottie.kanan : `${baseUrl}${lottie.kanan}`) : `${baseUrl}Interview.lottie`,
                    mobile: lottie.ponsel ? (lottie.ponsel.startsWith('http') ? lottie.ponsel : `${baseUrl}${lottie.ponsel}`) : `${baseUrl}IndonesiaConnect.lottie`
                });
            } else {
                // Fallback only if fetch completely fails (Network Error)
                setHeroText({
                    badge: "Platform Karir No. #1 Indonesia",
                    title: "Temukan Karir di Negeri Nusantara",
                    description: "Hubungkan potensimu dengan ribuan peluang di Kawasan Industri dan perusahaan terkemuka."
                });
            }
        } catch (err) {
            console.error("Failed to fetch hero data:", err);
        }
    };

    fetchData();
  }, []);

  return (
    <section className="relative pt-20 pb-4 md:pt-28 md:pb-12 overflow-hidden">
      {/* CSS for Infinite Scroll Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute top-40 right-10 w-48 h-48 md:w-72 md:h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center mb-0 md:mb-10">
            
            {/* --- LEFT LOTTIE AREA --- */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center h-full">
                <div className="w-full aspect-square max-w-[280px]">
                    <UniversalLottie src={lotties.left} />
                </div>
            </div>

            {/* --- CENTER CONTENT --- */}
            <div className="col-span-1 lg:col-span-6 text-center">
                {/* Badge */}
                {!heroText ? (
                    <Skeleton className="h-8 w-48 mx-auto mb-4 rounded-full" />
                ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-2 md:mb-4 border border-blue-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <Text>{heroText.badge}</Text>
                    </div>
                )}

                {/* Title */}
                {!heroText ? (
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-10 md:h-16 w-3/4 mx-auto rounded-xl" />
                        <Skeleton className="h-10 md:h-16 w-1/2 mx-auto rounded-xl" />
                    </div>
                ) : (
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-2 md:mb-4 leading-tight">
                        <Text>{heroText.title}</Text>
                    </h1>
                )}
                
                {/* Description */}
                {!heroText ? (
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-5/6 mx-auto rounded-lg" />
                    </div>
                ) : (
                    <p className="max-w-xl mx-auto text-sm md:text-lg text-slate-600 mb-4 leading-relaxed px-2 md:px-0">
                        <Text>{heroText.description}</Text>
                    </p>
                )}

            </div>

            {/* --- RIGHT LOTTIE AREA --- */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center h-full">
                 <div className="w-full aspect-square max-w-[280px]">
                    <UniversalLottie src={lotties.right} />
                </div>
            </div>
        </div>

        {/* Search Bar - Desktop & Mobile */}
        <div className="w-full max-w-5xl mx-auto bg-white p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-row gap-1 md:gap-2 relative z-20 mb-2 md:mb-8">
            {/* Filter Toggle (Mobile Only) */}
            <button 
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 shrink-0"
                onClick={() => setShowCategories(!showCategories)}
            >
                <Filter className="w-4 h-4" />
            </button>

            <div className="flex-[1.5] md:flex-1 flex items-center px-2 md:px-4 h-10 md:h-12 bg-slate-50 md:bg-white rounded-lg md:rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all focus-within:bg-white">
                <Search className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-400 mr-1.5 md:mr-3 shrink-0" />
                <input 
                    type="text" 
                    placeholder="Posisi/Perusahaan..." 
                    className="bg-transparent w-full h-full outline-none text-slate-700 placeholder:text-slate-400 text-xs md:text-base font-medium truncate"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onFocus={() => setShowCategories(true)}
                />
            </div>
            <div className="flex-1 flex items-center px-2 md:px-4 h-10 md:h-12 bg-slate-50 md:bg-white rounded-lg md:rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all focus-within:bg-white">
                <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-400 mr-1.5 md:mr-3 shrink-0" />
                <input 
                    type="text" 
                    placeholder="Lokasi..." 
                    className="bg-transparent w-full h-full outline-none text-slate-700 placeholder:text-slate-400 text-xs md:text-base font-medium truncate"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onFocus={() => setShowCategories(true)}
                />
            </div>
            <Button 
                size="lg" 
                className="h-10 md:h-12 px-3 md:px-6 w-auto text-base font-bold rounded-lg md:rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center justify-center"
                onClick={() => {
                    const params = new URLSearchParams();
                    if (searchKeyword) params.set('q', searchKeyword);
                    if (searchLocation) params.set('loc', searchLocation);
                    navigate(`/pekerjaan?${params.toString()}`);
                }}
            >
                <Search className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline"><Text>Cari Loker</Text></span>
            </Button>
        </div>

        {/* Category Cards - Grid Layout (Desktop & Mobile) */}
        <div className={`grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4 max-w-5xl mx-auto mb-4 md:mb-6 ${showCategories ? 'grid' : 'hidden md:grid'}`}>
            {categories.slice(0, 8).map((cat, idx) => (
                <Link 
                    to={`/pekerjaan?kategori=${cat.label.toLowerCase()}`} 
                    key={idx} 
                    className="block group"
                    onMouseEnter={() => setHoveredCategory(idx)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <div className="flex flex-col items-center justify-center p-1.5 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                        <div 
                            className="w-8 h-8 md:w-14 md:h-14 flex items-center justify-center mb-1 md:mb-3 shrink-0 group-hover:scale-110 transition-transform duration-300"
                        >
                            <img 
                                src={cat.icon} 
                                alt={cat.label} 
                                className="w-full h-full object-contain drop-shadow-sm"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2990/2990295.png'; // Fallback icon
                                }}
                            />
                        </div>
                        <span 
                            className="text-[9px] md:text-sm font-bold text-slate-700 text-center leading-tight line-clamp-2 transition-colors duration-300"
                            style={{
                                color: hoveredCategory === idx && cat.accent && cat.accent !== '#000000' ? cat.accent : undefined
                            }}
                        >
                            {cat.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>

        {/* --- MOBILE SPECIFIC LOTTIE (Moved here) --- */}
        <div className="block md:hidden w-full max-w-5xl mx-auto aspect-video relative overflow-hidden mb-0">
            <UniversalLottie src={lotties.mobile} />
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-4 gap-2 md:gap-8 max-w-5xl mx-auto mb-4 md:mb-10 border-b md:border-y border-slate-100 py-2 md:py-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center group cursor-default">
              <div className="mb-1 md:mb-3 p-1.5 md:p-2.5 bg-blue-50/80 rounded-xl md:rounded-2xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-sm">
                <stat.icon className="w-3.5 h-3.5 md:w-6 md:h-6" />
              </div>
              <div className="text-xs md:text-3xl font-bold text-slate-900 mb-0 md:mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[9px] md:text-sm text-slate-500 font-medium"><Text>{stat.label}</Text></div>
            </div>
          ))}
        </div>

        {/* Trusted By Section (Mitra from KV) - Transparent Cards with Color Hover */}
        {partners.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-4 overflow-hidden">
            <span className="text-[10px] md:text-sm font-bold text-slate-400 shrink-0 uppercase tracking-widest text-center"><Text>Perusahaan Nasional Hingga Multinasional</Text></span>
            
            <div className="w-full overflow-hidden relative mask-linear-fade py-4">
                <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10"></div>
                
                <div className="animate-marquee gap-8 pl-4 items-center">
                    {[...partners, ...partners].map((partner, index) => (
                    <div 
                        key={index} 
                        className="flex items-center gap-3 shrink-0 group opacity-70 hover:opacity-100 transition-all duration-300 cursor-default"
                        onMouseEnter={() => setHoveredPartner(index)}
                        onMouseLeave={() => setHoveredPartner(null)}
                    >
                        {/* Transparent Logo Container - No Grayscale */}
                        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                            <img 
                                src={partner.logo} 
                                alt={partner.nama} 
                                className="w-full h-full object-contain transition-all duration-300" 
                            />
                        </div>
                        {/* Company Name - Gray default, Color on Hover */}
                        <span 
                            className="font-bold text-xs md:text-sm whitespace-nowrap transition-colors duration-300"
                            style={{ 
                                color: hoveredPartner === index ? (partner.warna || '#2563eb') : '#475569' 
                            }}
                        >
                            {partner.nama}
                        </span>
                    </div>
                    ))}
                </div>
            </div>
            </div>
        )}
      </div>
    </section>
  );
};
