
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../komponen/ui/Button';
import { Card } from '../../komponen/ui/Card';
import { MapPin, Globe, Users, Building2, Briefcase, Loader2, Phone, Mail, CheckCircle2, Star, ExternalLink, PlayCircle, Target, X, MessageSquare, Volume2, VolumeX, Maximize2, Minimize2, Calendar } from 'lucide-react';
import { Perusahaan, Lowongan } from '../../types';
import { useData } from '../../context/DataContext';
import { Text } from '../../komponen/ui/Text';
import { CardLowongan } from '../pekerjaan/CardLowongan';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { Modal } from '../../komponen/ui/Modal';
import { WelcomePopup } from './WelcomePopup';
import { SEO } from '../../komponen/umum/SEO';

export const DetailPerusahaan = () => {
  const { slug } = useParams();
  const { companies, jobs, loading } = useData();
  const [company, setCompany] = useState<Perusahaan | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Lowongan[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'culture'>('overview');
  
  // Video Hero Interaction State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted when clicking play
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Modals
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(false);

  // Handle User Activity for Video Controls
  const handleActivity = () => {
      if (!isPlaying) return;
      
      setShowControls(true);
      if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
      }, 3000);
  };

  useEffect(() => {
      return () => {
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!loading && slug) {
      const foundCompany = companies.find(c => c.slug === slug);
      if (foundCompany) {
        setCompany(foundCompany);
        const relatedJobs = jobs.filter(j => j.perusahaan_id === foundCompany.perusahaan_id);
        setCompanyJobs(relatedJobs);

        const storageKey = `viewed_company_${foundCompany.perusahaan_id}`;
        if (!localStorage.getItem(storageKey)) {
            routingData.incrementView(foundCompany.perusahaan_id, 'company');
            localStorage.setItem(storageKey, 'true');
        }

        // Trigger Welcome Popup if Active
        if (foundCompany.popup_sambutan === true || String(foundCompany.popup_sambutan) === 'Active') {
             const popupKey = `popup_seen_${foundCompany.perusahaan_id}`;
             if (!sessionStorage.getItem(popupKey)) {
                 setTimeout(() => setIsWelcomePopupOpen(true), 1500);
                 sessionStorage.setItem(popupKey, 'true');
             }
        }
      }
    }
  }, [slug, companies, jobs, loading]);

  // Handle Video Play Logic
  const playHeroVideo = () => {
      setIsPlaying(true);
      setIsMuted(false); // Enable sound by default when user manually clicks play on the embed
      handleActivity(); // Show controls initially
      if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.currentTime = 0;
          videoRef.current.play();
      }
  };

  const stopHeroVideo = () => {
      setIsPlaying(false);
      setIsFullscreen(false);
      setIsMuted(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
      if (videoRef.current) {
          videoRef.current.muted = true;
          // Optional: videoRef.current.pause(); 
      }
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMuted(!isMuted);
      if (videoRef.current) {
          videoRef.current.muted = !isMuted;
      }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFullscreen(!isFullscreen);
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
  }

  if (!company) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
            <SEO title="Perusahaan Tidak Ditemukan - KarirKita" />
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Perusahaan tidak ditemukan</h2>
            <Link to="/perusahaan">
                <Button variant="outline">Kembali ke Direktori</Button>
            </Link>
        </div>
    );
  }

  // Construct full address
  const fullAddress = [
      company.jalan, company.kelurahan, company.kecamatan, company.kota, company.provinsi, company.kode_pos
  ].filter(Boolean).join(', ');

  // Parse Struktural
  let structuralData: any[] = [];
  if (company.struktural) {
      if (Array.isArray(company.struktural)) structuralData = company.struktural;
      else if (typeof company.struktural === 'string') {
          try { structuralData = JSON.parse(company.struktural); } catch (e) {}
      }
  }

  // Detect Video Type
  const isYoutube = company.video_profil && (company.video_profil.includes('youtube.com') || company.video_profil.includes('youtu.be'));
  
  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
      // Updated regex to handle ?si= and other query parameters
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };
  const youtubeId = isYoutube ? getYoutubeId(company.video_profil!) : null;

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO 
        title={`Profil ${company.nama} - Lowongan & Review | KarirKita`}
        description={`Lihat profil lengkap ${company.nama} di ${company.kota}. ${company.deskripsi.substring(0, 150)}...`}
        image={company.logo_url}
        keywords={`profil ${company.nama}, lowongan ${company.nama}, karir ${company.nama}, ${company.industri}`}
      />
      
      {/* --- 1. HERO SECTION --- */}
      <div 
          className={cn(
            "relative w-full overflow-hidden group bg-slate-900 transition-all duration-500 ease-in-out", 
            isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen" : (isPlaying ? "w-full aspect-video md:aspect-auto md:h-[500px] z-[60]" : "h-[250px] md:h-[500px]")
          )}
          onMouseMove={handleActivity}
          onClick={handleActivity}
          onTouchStart={handleActivity}
      >
         {isPlaying && company.video_profil ? (
             isYoutube && youtubeId ? (
                 <div className="w-full h-full relative">
                     <iframe 
                        className="w-full h-full object-cover pointer-events-auto"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=1&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&origin=${window.location.origin}`}
                        title="Company Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     />
                     <div className="absolute inset-0 bg-transparent pointer-events-none" />
                 </div>
             ) : (
                 <video 
                    ref={videoRef}
                    src={company.video_profil} 
                    className={cn("w-full h-full transition-transform duration-1000", isFullscreen ? "object-contain bg-black" : "object-cover")}
                    autoPlay 
                    muted={isMuted} 
                    loop 
                    playsInline
                />
             )
         ) : (
             <img 
                src={company.banner_url} 
                alt={company.nama} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
             />
         )}
         
         {/* Gradient Overlays */}
         <div className={cn("absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none transition-opacity duration-500", isPlaying ? "opacity-0" : "opacity-90")}></div>
         {isPlaying && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none transition-opacity duration-500"></div>}
         
         {/* Video Controls (Always Visible when Playing) */}
         {isPlaying && (
            <div className={cn(
                "absolute top-0 left-0 w-full p-4 md:p-6 z-[70] flex justify-between items-start transition-all duration-500 ease-in-out",
                showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
            )}>
                <div className="flex gap-2">
                    <button 
                        onClick={toggleMute}
                        className="p-2.5 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-all border border-white/10"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <button 
                        onClick={toggleFullscreen}
                        className="p-2.5 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-all border border-white/10"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>

                <button 
                    onClick={stopHeroVideo}
                    className="p-2.5 bg-red-600/80 text-white rounded-full backdrop-blur-md hover:bg-red-600 transition-all shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
         )}
         
         {/* DESKTOP HERO OVERLAY (Buttons Aligned Right) */}
         <div className={cn("hidden md:block absolute bottom-0 left-0 w-full z-20 pb-12 px-4 transition-all duration-500", isPlaying ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0")}>
            <div className="max-w-7xl mx-auto flex items-end gap-8">
                {/* Logo */}
                <div className="w-40 h-40 bg-white p-2 rounded-3xl shadow-2xl shadow-black/20 shrink-0 relative z-30">
                    <img src={company.logo_url} alt={company.nama} className="w-full h-full object-contain rounded-2xl border border-slate-100" />
                </div>
                
                {/* Text Info (Flexible width) */}
                <div className="flex-1 mb-2 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        {company.promosi && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Verified</span>
                        )}
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-3 line-clamp-1 drop-shadow-md leading-tight">{company.nama}</h1>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-200 text-base font-medium">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-blue-400" /> {company.kota || company.lokasi}</span>
                        <span className="opacity-50">•</span>
                        <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-blue-400" /> {company.industri}</span>
                        <span className="opacity-50">•</span>
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-blue-400" /> {company.ukuran_perusahaan}</span>
                    </div>
                </div>

                {/* DESKTOP ACTIONS (Aligned Right within Flex) */}
                <div className="flex gap-3 mb-2 shrink-0">
                    {company.video_profil && (
                        <Button onClick={playHeroVideo} className="bg-red-600 hover:bg-red-700 border-none font-bold text-sm h-12 rounded-xl text-white px-6 shadow-xl hover:scale-105 transition-transform">
                            <PlayCircle className="w-5 h-5 mr-2" /> Video Profil
                        </Button>
                    )}
                    {company.website_url && (
                        <a href={company.website_url} target="_blank" rel="noreferrer">
                            <Button className="bg-white text-slate-900 hover:bg-slate-50 border-none font-bold text-sm h-12 rounded-xl px-6 shadow-xl hover:scale-105 transition-transform">
                                <Globe className="w-5 h-5 mr-2" /> Website
                            </Button>
                        </a>
                    )}
                </div>
            </div>
         </div>
      </div>

      {/* --- 2. MOBILE CARD CONTENT (Overlap Clean Design) --- */}
      <div className={cn(
          "md:hidden max-w-7xl mx-auto px-4 relative z-30 transition-all duration-500 ease-in-out origin-top",
          isPlaying ? "mt-0 opacity-0 scale-95 pointer-events-none max-h-0 overflow-hidden" : "-mt-20 opacity-100 scale-100 max-h-[600px]"
      )}>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              
              {/* Header: Logo & Title inside Card */}
              <div className="flex flex-col items-center text-center -mt-16 mb-6">
                  <div className="w-24 h-24 bg-white p-2 rounded-3xl shadow-xl border border-slate-50 mb-4 relative z-10">
                      <img src={company.logo_url} alt={company.nama} className="w-full h-full object-contain rounded-2xl" />
                  </div>
                  
                  {company.promosi && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-blue-100">
                          Verified Official
                      </span>
                  )}
                  
                  <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2">{company.nama}</h1>
                  
                  <div className="flex flex-wrap justify-center gap-y-1 gap-x-3 text-sm text-slate-500 font-medium">
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-red-500" /> {company.kota}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1 text-blue-500" /> {company.industri}</span>
                  </div>
              </div>

              {/* Mobile Actions Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                  {company.video_profil && (
                      <Button onClick={playHeroVideo} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold text-sm h-12 rounded-xl shadow-sm transition-all active:scale-95">
                          <PlayCircle className="w-4 h-4 mr-2" /> Tonton Video
                      </Button>
                  )}
                  {company.website_url ? (
                      <a href={company.website_url} target="_blank" rel="noreferrer" className="w-full">
                          <Button className="w-full bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-bold text-sm h-12 rounded-xl shadow-sm transition-all active:scale-95">
                              <Globe className="w-4 h-4 mr-2" /> Website
                          </Button>
                      </a>
                  ) : (
                      <div /> /* Spacer */
                  )}
              </div>
          </div>
      </div>

      {/* --- Spacer for Desktop to compensate for missing mobile negative margin --- */}
      <div className="hidden md:block h-8"></div>

      {/* --- 3. NAVIGATION TABS (Normal Scrollable) --- */}
      <div className="border-b border-slate-200 bg-white mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                      { id: 'overview', label: 'Tentang', icon: Building2 },
                      { id: 'jobs', label: `Lowongan (${companyJobs.length})`, icon: Briefcase },
                      { id: 'culture', label: 'Budaya', icon: Users },
                  ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 md:px-6 py-4 md:py-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                            activeTab === tab.id 
                                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                                : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                          <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-600" : "text-slate-400")} />
                          {tab.label}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* --- 4. MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            
            {/* LEFT COLUMN (Content) */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
                {activeTab === 'overview' && (
                    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Grid (Mobile & Desktop) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center gap-1">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mb-1">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-black text-blue-600 leading-none">{company.tahun_berdiri || '20XX'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Didirikan</p>
                            </div>
                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center gap-1">
                                <div className="p-2 bg-green-100 rounded-full text-green-600 mb-1">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-black text-green-600 leading-none">{companyJobs.length}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lowongan</p>
                            </div>
                            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center justify-center text-center gap-1">
                                <div className="p-2 bg-purple-100 rounded-full text-purple-600 mb-1">
                                    <Users className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-black text-purple-600 leading-none">{company.ukuran_perusahaan.split(' ')[0]}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tim</p>
                            </div>
                            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center gap-1">
                                <div className="p-2 bg-orange-100 rounded-full text-orange-600 mb-1">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <p className="text-lg font-black text-orange-600 leading-none">{company.promosi ? '4.8' : '4.5'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</p>
                            </div>
                        </div>

                        {/* Description */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 md:h-8 bg-blue-600 rounded-full"></span>
                                Cerita Kami
                            </h2>
                            <div className="prose prose-slate prose-sm md:prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                                {company.deskripsi}
                            </div>
                        </section>

                        {/* Vision & Mission */}
                        {(company.visi || company.misi) && (
                            <section className="grid md:grid-cols-2 gap-6">
                                {company.visi && (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" /> Visi</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{company.visi}</p>
                                    </div>
                                )}
                                {company.misi && (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /> Misi</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{company.misi}</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Tech Stack */}
                        {company.teknologi && company.teknologi.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Fokus & Teknologi</h3>
                                <div className="flex flex-wrap gap-2">
                                    {company.teknologi.map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs md:text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* TAB: JOBS */}
                {activeTab === 'jobs' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Lowongan Tersedia</h2>
                                <p className="text-sm text-slate-500">Bergabunglah dengan tim kami untuk membangun masa depan.</p>
                            </div>
                        </div>
                        
                        <div className="grid gap-4">
                            {companyJobs.length > 0 ? (
                                companyJobs.map(job => (
                                    <CardLowongan 
                                      key={job.lowongan_id} 
                                      job={{ ...job, id: job.lowongan_id }} 
                                      variant="list" 
                                      className="border border-slate-200 shadow-sm hover:border-blue-300" 
                                    />
                                ))
                            ) : (
                                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">Belum ada lowongan aktif</h3>
                                    <p className="text-slate-500">Pantau terus halaman ini untuk update terbaru.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: CULTURE */}
                {activeTab === 'culture' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {structuralData && structuralData.length > 0 && (
                            <section>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-purple-600" /> Struktur & Tim
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {structuralData.map((member: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center group hover:border-purple-200 transition-all">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-slate-50 overflow-hidden mb-3 border-2 border-white shadow-md">
                                                <img 
                                                    src={member.foto || "https://placehold.co/100x100?text=User"} 
                                                    alt={member.nama} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-sm truncate">{member.nama}</h4>
                                            <p className="text-xs text-purple-600 font-medium truncate">{member.jabatan}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN (Sticky Sidebar) */}
            <div className="lg:col-span-1">
                <div className="sticky top-10 space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-500" /> Lokasi & Kontak
                        </h3>
                        <div className="h-40 md:h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5 relative group">
                            <iframe 
                                width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} 
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(company.lokasi || company.kota || '')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                            ></iframe>
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent pointer-events-none transition-colors"></div>
                            <a 
                                href={`https://maps.google.com/maps?q=${encodeURIComponent(company.lokasi || company.kota || '')}`} 
                                target="_blank" rel="noreferrer"
                                className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                                <ExternalLink className="w-3 h-3" /> Buka Peta
                            </a>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3">
                                <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                <span className="text-slate-600 font-medium">{fullAddress || company.lokasi}</span>
                            </div>
                            <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-slate-600 font-medium">{company.nomor_telepon || '-'}</span>
                                    {company.fax && <span className="text-slate-400 text-xs">Fax: {company.fax}</span>}
                                </div>
                            </div>
                            {company.whatsapp && (
                                <div className="flex gap-3">
                                    <MessageSquare className="w-4 h-4 text-green-500 mt-0.5" />
                                    <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">
                                        Chat WhatsApp
                                    </a>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                                <span className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer transition-colors">{company.email_kontak || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Popup Sambutan Modal */}
      <WelcomePopup 
          isOpen={isWelcomePopupOpen} 
          onClose={() => setIsWelcomePopupOpen(false)} 
          company={company} 
      />
    </div>
  );
};
