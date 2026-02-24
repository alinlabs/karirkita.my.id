import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../../komponen/umum/SEO';
import { Button } from '../../komponen/ui/Button';
import { Card } from '../../komponen/ui/Card';
import { Linkedin, Briefcase, MapPin, Star, MessageCircle, Calendar, Clock, PlayCircle, Volume2, VolumeX, Maximize2, Minimize2, X } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Mentor } from '../../types';
import { cn } from '../../utils/cn';

export const SectionDetailMentor = () => {
    const { slug } = useParams();
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(true);

    // Video Hero Interaction State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Default unmuted when clicking play
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

    useEffect(() => {
        routingData.getKelas().then(data => {
            if (data && data.mentors) {
                const found = data.mentors.find((m: Mentor) => m.slug === slug);
                setMentor(found || null);
            }
            setLoading(false);
        });
    }, [slug]);

    // Handle Video Play Logic
    const playHeroVideo = () => {
        if (!mentor?.sampul_video) {
            alert('Video profil belum tersedia untuk mentor ini.');
            return;
        }
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

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    if (!mentor) return <div className="min-h-screen pt-24 text-center">Mentor tidak ditemukan</div>;

    // Detect Video Type
    const isYoutube = mentor.sampul_video && (mentor.sampul_video.includes('youtube.com') || mentor.sampul_video.includes('youtu.be'));
    
    // Extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = isYoutube ? getYoutubeId(mentor.sampul_video!) : null;

    const formatPrice = (price: string) => {
        if (!price) return 'Gratis';
        if (price.toLowerCase() === 'gratis' || price === '0') return 'Gratis';
        const num = parseInt(price.replace(/\D/g, ''));
        if (isNaN(num)) return price;
        return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
    };

    return (
        <>
            <SEO title={`Mentoring dengan ${mentor.nama} - KarirKita`} description={mentor.tentang.slice(0, 150)} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Custom Hero Section */}
                <div 
                    className={cn(
                        "relative w-full overflow-hidden group bg-slate-900 transition-all duration-500 ease-in-out",
                        isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen" : (isPlaying ? "w-full aspect-video md:aspect-auto md:h-[500px] z-[60]" : "h-[280px] md:h-[400px]")
                    )}
                    onMouseMove={handleActivity}
                    onClick={handleActivity}
                    onTouchStart={handleActivity}
                >
                    {isPlaying && mentor.sampul_video ? (
                        isYoutube && youtubeId ? (
                            <div className="w-full h-full relative">
                                <iframe 
                                    className="w-full h-full object-cover pointer-events-auto"
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=1&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&origin=${window.location.origin}`}
                                    title="Mentor Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                <div className="absolute inset-0 bg-transparent pointer-events-none" />
                            </div>
                        ) : (
                            <video 
                                ref={videoRef}
                                src={mentor.sampul_video}
                                className={cn("w-full h-full transition-transform duration-1000", isFullscreen ? "object-contain bg-black" : "object-cover")}
                                autoPlay 
                                muted={isMuted} 
                                loop 
                                playsInline
                            />
                        )
                    ) : (
                        <img 
                            src={mentor.sampul_gambar || mentor.gambar} 
                            alt={mentor.nama} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    )}

                    {/* Gradient Overlays */}
                    <div className={cn("absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none transition-opacity duration-500", isPlaying ? "opacity-0" : "opacity-90")}></div>
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

                    {/* Hero Content Overlay */}
                    <div className={cn(
                        "absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 transition-all duration-500 pt-16 md:pt-0",
                        isPlaying ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"
                    )}>
                        <h1 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight drop-shadow-lg leading-tight">
                            {mentor.nama}
                        </h1>
                        <p className="text-white/90 text-sm md:text-xl max-w-2xl font-medium drop-shadow-md mb-4 md:mb-6">
                            {mentor.peran} at {mentor.perusahaan}
                        </p>
                        <button 
                            onClick={playHeroVideo}
                            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm md:text-base font-semibold transition-all group-hover:scale-105"
                        >
                            <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                            Tonton Video Profil
                        </button>
                    </div>
                </div>

                <div className={cn(
                    "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 transition-all duration-500",
                    isPlaying ? "mt-0" : "-mt-12 md:-mt-20"
                )}>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Sidebar */}
                        <div className="md:col-span-1">
                            <Card className="p-6 border-slate-200 shadow-lg rounded-2xl sticky top-24 text-center">
                                <div className="w-32 h-32 mx-auto mb-4 relative">
                                    <img src={mentor.gambar} alt={mentor.nama} className="w-full h-full object-cover rounded-full border-4 border-white shadow-md" />
                                    <div className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full text-white shadow-sm">
                                        <Linkedin className="w-4 h-4" />
                                    </div>
                                </div>
                                <h1 className="text-xl font-bold text-slate-900 mb-1">{mentor.nama}</h1>
                                <p className="text-sm text-slate-600 mb-4">{mentor.peran} at {mentor.perusahaan}</p>
                                
                                <div className="flex justify-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {mentor.lokasi}
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-slate-900">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {mentor.rating}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {mentor.keahlian.map((skill: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <Button 
                                    className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 shadow-lg"
                                    onClick={() => window.open(`https://wa.me/6281807000054?text=${encodeURIComponent(`Halo saya ingin terhubung dengan mentor ${mentor.nama}, bisakah untuk dibuatkan agenda?`)}`, '_blank')}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" /> Chat Mentor
                                </Button>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <Card className="p-8 border-slate-200 shadow-sm rounded-2xl">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Tentang Saya</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                                    {mentor.tentang}
                                </p>

                                <h3 className="text-xl font-bold text-slate-900 mb-4">Pengalaman</h3>
                                <div className="space-y-6 relative border-l-2 border-slate-100 ml-3 pl-8">
                                    {mentor.pengalaman.map((exp: any, idx: number) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-purple-200"></div>
                                            <h4 className="font-bold text-slate-900">{exp.peran}</h4>
                                            <p className="text-slate-600 text-sm">{exp.perusahaan}</p>
                                            <p className="text-slate-400 text-xs mt-1">{exp.periode}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900">Layanan Mentoring</h3>
                                {mentor.layanan.map((service: any, idx: number) => (
                                    <Card key={idx} className="p-6 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors">{service.judul}</h4>
                                                <p className="text-slate-500 text-sm mt-1">{service.deskripsi}</p>
                                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                                    <Clock className="w-3 h-3" /> {service.durasi}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-purple-600 text-lg">{formatPrice(service.harga)}</div>
                                                <Button size="sm" variant="outline" className="mt-2 border-purple-200 text-purple-600 hover:bg-purple-50">
                                                    Pilih
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
