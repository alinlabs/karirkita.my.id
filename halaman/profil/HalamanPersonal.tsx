
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Button } from '../../komponen/ui/Button';
import { 
    Mail, Download, Loader2, User, 
    ArrowRight, Trophy, Layout, ShoppingBag, Store, Sparkles, 
    Briefcase, Code2, PlayCircle, ExternalLink, X, Eye,
    Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react';
import { PencariKerja, Proyek, Layanan, Pengalaman, Pendidikan } from '../../types';
import { routingData } from '../../services/routingData'; 
import { cn } from '../../utils/cn';
import { SocialIcon } from '../../komponen/ui/SocialIcon';
import { Modal } from '../../komponen/ui/Modal';
import { SEO } from '../../komponen/umum/SEO';

// Sections
import { SectionPortofolio, SectionLayanan, MetricVisualizer, ProjectCard } from './SectionPortofolio';
import { PengalamanKerjaDanSekolah } from './PengalamanKerjaDanSekolah';
import { SectionProfesionalSkill } from './SectionProfesionalSkill';
import { SectionPrestasi } from './SectionPrestasi';
import { SectionOrganisasi } from './SectionOrganisasi';
import { SectionGaleri } from './SectionGaleri';
import { SectionTentang } from './SectionTentang';
import { ModalDetailProyek } from './ModalDetailProyek';
import { ModalDetailLayanan } from './ModalDetailLayanan';

export const HalamanPersonal = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [talent, setTalent] = useState<PencariKerja | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'portfolio' | 'services' | 'resume' | 'achievements' | 'about'>('all');
  const [verifiedIcon, setVerifiedIcon] = useState('');
  
  // Video Hero State (Immersive)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted for click action
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Modals State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Proyek | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Pengalaman | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<Pendidikan | null>(null);
  const [selectedService, setSelectedService] = useState<Layanan | null>(null);
  
  // State for gallery active image inside modals
  const [activeProjectImage, setActiveProjectImage] = useState<string | null>(null);
  const [activeServiceImage, setActiveServiceImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    routingData.getIcons().then((icons: any) => {
        if(icons && icons.verifikasi) setVerifiedIcon(icons.verifikasi);
    });

    // Use routingData service
    routingData.getTalents()
      .then((data: PencariKerja[]) => {
        const found = data.find(t => t.username === username);
        if (found) {
            setTalent(found);
            // View Count Logic
            const storageKey = `viewed_user_${found.user_id}`;
            if (!localStorage.getItem(storageKey)) {
                routingData.incrementView(found.user_id, 'user');
                localStorage.setItem(storageKey, 'true');
            }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch talent:", err);
        setLoading(false);
      });
  }, [username]);

  // ... (Keep existing effect hooks for modals/images) ...
  useEffect(() => {
    if (selectedProject) {
        setActiveProjectImage(selectedProject.banner_custom_url || selectedProject.gambar_url);
    } else {
        setActiveProjectImage(null);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedService) {
        setActiveServiceImage(selectedService.thumbnail_url || (selectedService.galeri_url && selectedService.galeri_url.length > 0 ? selectedService.galeri_url[0] : null));
    } else {
        setActiveServiceImage(null);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedImage || selectedProject || selectedExperience || selectedEducation || selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage, selectedProject, selectedExperience, selectedEducation, selectedService]);

  // Video Interaction Logic
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
          // videoRef.current.pause(); 
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
     return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
  }

  if (!talent) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <SEO title="Profil Tidak Ditemukan - KarirKita" />
            Talent not found
        </div>
    );
  }

  const coverImage = talent.banner || "https://placehold.co/1200x400/1e293b/ffffff?text=Cover+Image";
  
  // Video Parsing
  const isYoutube = talent.video_profil && (talent.video_profil.includes('youtube.com') || talent.video_profil.includes('youtu.be'));
  const getYoutubeId = (url: string) => {
      // Updated regex to handle ?si= and other query parameters
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };
  const youtubeId = isYoutube ? getYoutubeId(talent.video_profil!) : null;

  const calculateExperienceYears = () => {
      if (!talent.pengalaman_kerja || talent.pengalaman_kerja.length === 0) return 0;
      const years = talent.pengalaman_kerja.map(e => parseInt(e.tanggal_mulai)).filter(y => !isNaN(y));
      if (years.length === 0) return 0;
      const minYear = Math.min(...years);
      const currentYear = new Date().getFullYear();
      return currentYear - minYear;
  };

  const getStatusBadge = () => {
      if (talent.status_ketersediaan === 'open_for_business') {
          return (
            <div className="absolute -bottom-3 -right-3 md:bottom-2 md:-right-2 bg-indigo-600 text-white text-[10px] md:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 animate-bounce-slow z-20 whitespace-nowrap">
                <Store className="w-3 h-3 fill-current" /> Open for Business
            </div>
          );
      }
      if (talent.status_ketersediaan === 'job_seeking') {
          return (
            <div className="absolute -bottom-3 -right-3 md:bottom-2 md:-right-2 bg-green-500 text-white text-[10px] md:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 animate-bounce-slow z-20 whitespace-nowrap">
                <Sparkles className="w-3 h-3 fill-current" /> Open to Work
            </div>
          );
      }
      return null;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO 
        title={`${talent.nama_lengkap} - ${talent.headline} | KarirKita`}
        description={`${talent.nama_lengkap} adalah ${talent.headline} di ${talent.kota}. ${talent.tentang_saya?.substring(0, 150)}...`}
        image={talent.foto_profil}
        keywords={`${talent.nama_lengkap}, ${talent.keahlian?.join(', ')}, portfolio ${talent.nama_lengkap}, karirkita`}
      />
      
      {/* --- HERO SECTION --- */}
      <div className="relative">
          <div 
              className={cn(
                "relative w-full overflow-hidden group bg-slate-900 transition-all duration-500 ease-in-out", 
                isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen" : (isPlaying ? "w-full aspect-video md:aspect-auto md:h-[400px] z-[60]" : "h-[300px] md:h-[400px]")
              )}
              onMouseMove={handleActivity}
              onClick={handleActivity}
              onTouchStart={handleActivity}
          >
              {isPlaying && talent.video_profil ? (
                  isYoutube && youtubeId ? (
                      <div className="w-full h-full relative">
                         <iframe 
                            className="w-full h-full object-cover pointer-events-auto"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=1&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&origin=${window.location.origin}`}
                            title="Profile Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                         />
                         <div className="absolute inset-0 bg-transparent pointer-events-none" />
                      </div>
                  ) : (
                    <video 
                        ref={videoRef}
                        src={talent.video_profil} 
                        className={cn("w-full h-full transition-transform duration-1000", isFullscreen ? "object-contain bg-black" : "object-cover opacity-90")}
                        autoPlay 
                        muted={isMuted} 
                        loop 
                        playsInline
                    />
                  )
              ) : (
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              )}
              
              {/* Gradient Overlays */}
              <div className={cn("absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none transition-opacity duration-500", isPlaying ? "opacity-0" : "opacity-100")}></div>
              {isPlaying && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none transition-opacity duration-500"></div>}

              {/* Immersive Controls */}
              {isPlaying && (
                <div className={cn(
                    "absolute top-0 left-0 w-full p-4 md:p-6 z-[70] flex justify-between items-start transition-all duration-500 ease-in-out",
                    showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
                )}>
                    <div className="flex gap-2">
                        <button 
                            onClick={toggleMute}
                            className="p-2.5 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-all border border-white/10"
                            title={isMuted ? "Unmute Video" : "Mute Video"}
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
          </div>

          <div className={cn(
              "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-500 ease-in-out origin-top", 
              isPlaying ? "mt-0 opacity-0 scale-95 pointer-events-none max-h-0 overflow-hidden" : "-mt-24 md:-mt-32 opacity-100 scale-100 max-h-[600px]"
          )}>
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                  {/* Photo & Badge */}
                  <div className="relative group shrink-0 mx-auto md:mx-0">
                      <div onClick={() => setSelectedImage(talent.foto_profil)} className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] md:rounded-[2.5rem] bg-white p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 cursor-pointer relative">
                          <img src={talent.foto_profil} alt={talent.nama_lengkap} className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] bg-slate-100" />
                      </div>
                      {getStatusBadge()}
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 pb-2 md:pb-0 text-center md:text-left w-full mt-2 md:mt-0">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                          <h1 className="text-3xl md:text-5xl font-black text-slate-900 md:text-white tracking-tight drop-shadow-sm md:drop-shadow-md">
                              {talent.nama_lengkap}
                          </h1>
                          {talent.verifikasi === 'disetujui' && verifiedIcon && (
                              <img src={verifiedIcon} className="w-6 h-6 md:w-8 md:h-8 object-contain drop-shadow-md" title="Akun Terverifikasi" alt="Verified" />
                          )}
                      </div>
                      
                      <div className="mb-4 flex flex-col md:flex-row flex-wrap items-center md:justify-start gap-1 md:gap-2">
                          <span className="text-slate-700 md:text-blue-200 text-sm md:text-xl font-bold md:font-medium">
                              {talent.headline}
                          </span>
                          <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-400"></span> 
                          <span className="text-slate-500 md:text-slate-300 text-xs md:text-base block w-full md:w-auto font-medium">
                              {talent.kota ? `${talent.kota}, ${talent.provinsi}` : 'Indonesia'}
                          </span>
                      </div>
                      
                      {/* FIXED SOCIAL VISIBILITY - Using Solid Buttons for Visibility */}
                      <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start mb-4 md:mb-0 md:mt-20">
                          {talent.video_profil && (
                              <button onClick={playHeroVideo} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-red-900/20 transition-all">
                                  <PlayCircle className="w-4 h-4" /> Profil Video
                              </button>
                          )}
                          {talent.sosial_media.linkedin_url && (
                              <a href={talent.sosial_media.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all border border-slate-200">
                                  <SocialIcon name="linkedin" className="w-4 h-4" /> LinkedIn
                              </a>
                          )}
                          {talent.sosial_media.github_url && (
                              <a href={talent.sosial_media.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 hover:bg-slate-50 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all border border-slate-200">
                                  <SocialIcon name="github" className="w-4 h-4" /> GitHub
                              </a>
                          )}
                          {talent.sosial_media.website_url && (
                              <a href={talent.sosial_media.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 hover:bg-slate-50 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all border border-slate-200">
                                  <SocialIcon name="website" className="w-4 h-4" /> Portfolio
                              </a>
                          )}
                      </div>
                  </div>

                  {/* Mobile Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-4 md:hidden w-full">
                      <div className="flex flex-col items-center justify-center p-2 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                          <span className="text-lg font-black text-slate-900 leading-tight">{calculateExperienceYears()}+</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Thn Exp</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                          <span className="text-lg font-black text-slate-900 leading-tight">{talent.portofolio.length}+</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Proyek</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                          <span className="text-lg font-black text-slate-900 leading-tight flex gap-1 items-center"><Eye className="w-3 h-3"/> {talent.dilihat || 0}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Views</span>
                      </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 md:flex md:flex-row gap-3 w-full md:w-auto pb-0 md:pb-0 md:mt-auto">
                      <Button size="lg" className="w-full md:w-auto rounded-xl shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 border-none font-bold justify-center">
                          <Mail className="w-4 h-4 mr-2" /> Hubungi
                      </Button>
                      
                      {/* CV LINK */}
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => navigate(`/cv/${talent.username}`)}
                        className="w-full md:w-auto rounded-xl bg-white text-slate-900 border-slate-200 hover:bg-slate-50 font-bold justify-center"
                      >
                          <Download className="w-4 h-4 mr-2" /> Resume
                      </Button>
                  </div>
              </div>
          </div>
      </div>

      {/* --- TAB NAVIGATION & CONTENT --- */}
      {/* ... (Rest of the component remains similar, using existing imports) ... */}
      <div className={cn(
          "sticky top-0 md:relative md:top-auto z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 w-full shadow-sm md:shadow-none transition-all duration-500",
          isPlaying ? "mt-0" : "mt-8 md:mt-12 mb-8"
      )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between overflow-x-auto no-scrollbar w-full">
                  <div className="flex gap-4 md:gap-8 w-full">
                    {[
                        { id: 'all', label: 'Semua', icon: Layout },
                        { id: 'portfolio', label: 'Portofolio', icon: Code2 },
                        { id: 'services', label: 'Produk & Jasa', icon: ShoppingBag, show: !!talent.layanan?.length }, 
                        { id: 'resume', label: 'Resume', icon: Briefcase },
                        { id: 'achievements', label: 'Prestasi', icon: Trophy },
                        { id: 'about', label: 'Tentang', icon: User },
                    ].filter(tab => tab.show !== false).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                window.scrollTo({ top: window.innerWidth < 768 ? 400 : 500, behavior: 'smooth' });
                            }}
                            className={cn(
                                "flex items-center gap-2 px-2 py-4 md:py-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id 
                                    ? "border-blue-600 text-blue-600" 
                                    : "border-transparent text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-600" : "text-slate-400")} />
                            {tab.label}
                        </button>
                    ))}
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[500px]">
          {/* ... (Existing tab content rendering code) ... */}
          {activeTab === 'all' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      {/* Featured Project */}
                      <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-slate-900">Featured Project</h3>
                              <button onClick={() => setActiveTab('portfolio')} className="text-blue-600 text-sm font-bold hover:underline">Lihat Semua</button>
                          </div>
                          {talent.portofolio.length > 0 ? (
                              <div className="w-full">
                                  <ProjectCard project={talent.portofolio[0]} onClick={setSelectedProject} />
                              </div>
                          ) : <p className="text-slate-500">Belum ada project.</p>}
                      </div>

                      {/* Bio & Experience */}
                      <div className="space-y-6">
                          <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/20">
                              <User className="w-10 h-10 mb-4 bg-white/20 p-2 rounded-xl" />
                              <h3 className="text-lg font-bold mb-2">Tentang {talent.nama_lengkap}</h3>
                              <p className="text-blue-100 text-sm leading-relaxed line-clamp-4 mb-4">
                                  {talent.tentang_saya}
                              </p>
                              <button onClick={() => setActiveTab('about')} className="text-white font-bold text-sm underline decoration-white/50 hover:decoration-white">Baca Selengkapnya</button>
                          </div>

                          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-blue-600" /> Posisi Terakhir
                              </h3>
                              {talent.pengalaman_kerja.length > 0 ? (
                                  <div>
                                      <p className="font-bold text-slate-900 text-lg">{talent.pengalaman_kerja[0].posisi}</p>
                                      <p className="text-blue-600 font-medium mb-1">{talent.pengalaman_kerja[0].nama_perusahaan}</p>
                                      <p className="text-slate-400 text-xs">{talent.pengalaman_kerja[0].tanggal_mulai} - {talent.pengalaman_kerja[0].tanggal_selesai}</p>
                                  </div>
                              ) : <p className="text-slate-500 text-sm">Belum ada pengalaman.</p>}
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-6">
                          <h3 className="text-xl font-bold text-slate-900">Professional Skills</h3>
                          <SectionProfesionalSkill skills={talent.keahlian} />
                      </div>
                      <div className="space-y-6">
                          <SectionPrestasi achievements={talent.sertifikasi?.slice(0, 2) || []} compact={true} />
                          <div className="text-right">
                             <button onClick={() => setActiveTab('achievements')} className="text-blue-600 text-sm font-bold hover:underline inline-flex items-center gap-1">Lihat Semua Prestasi <ArrowRight className="w-4 h-4" /></button>
                          </div>
                      </div>
                  </div>

                  <SectionGaleri gallery={talent.galeri_kegiatan || []} onSelect={setSelectedImage} />
              </div>
          )}

          {activeTab === 'portfolio' && (
              <SectionPortofolio projects={talent.portofolio} onSelect={setSelectedProject} />
          )}

          {activeTab === 'services' && talent.layanan && (
              <SectionLayanan services={talent.layanan} onSelect={setSelectedService} />
          )}

          {activeTab === 'resume' && (
              <>
                <PengalamanKerjaDanSekolah 
                    experiences={talent.pengalaman_kerja} 
                    educations={talent.riwayat_pendidikan}
                    onSelectExperience={setSelectedExperience}
                    onSelectEducation={setSelectedEducation}
                />
                <SectionProfesionalSkill skills={talent.keahlian} />
              </>
          )}

          {activeTab === 'achievements' && (
              <>
                <SectionPrestasi achievements={talent.sertifikasi || []} />
                <SectionOrganisasi organizations={talent.organisasi || []} />
              </>
          )}

          {activeTab === 'about' && (
              <SectionTentang talent={talent} onSelectImage={setSelectedImage} experienceYears={calculateExperienceYears()} />
          )}
      </div>

      {/* --- MODALS (Image Lightbox, Project, Service) --- */}
      {selectedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
              <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X className="w-6 h-6" />
              </button>
              <img 
                  src={selectedImage} 
                  alt="Full view" 
                  className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                  onClick={(e) => e.stopPropagation()} 
              />
          </div>
      )}

      {/* Project & Service Modals */}
      {selectedProject && (
          <ModalDetailProyek 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
          />
      )}

      {selectedService && (
          <ModalDetailLayanan 
              service={selectedService} 
              onClose={() => setSelectedService(null)} 
          />
      )}
    </div>
  );
};
