import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../../komponen/umum/SEO';
import { Button } from '../../komponen/ui/Button';
import { Card } from '../../komponen/ui/Card';
import { Calendar, Clock, MapPin, Users, Share2, CheckCircle2, PlayCircle, Volume2, VolumeX, Maximize2, Minimize2, X } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Kelas } from '../../types';
import { cn } from '../../utils/cn';

export const SectionDetailKelas = () => {
    const { slug } = useParams();
    const [classDetail, setClassDetail] = useState<Kelas | null>(null);
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
            if (data && data.kelas) {
                const found = data.kelas.find((c: Kelas) => c.slug === slug);
                setClassDetail(found || null);
            }
            setLoading(false);
        });
    }, [slug]);

    // Handle Video Play Logic
    const playHeroVideo = () => {
        if (!classDetail?.sampul_video) {
            alert('Video preview belum tersedia untuk kelas ini.');
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
    if (!classDetail) return <div className="min-h-screen pt-24 text-center">Kelas tidak ditemukan</div>;

    // Detect Video Type
    const isYoutube = classDetail.sampul_video && (classDetail.sampul_video.includes('youtube.com') || classDetail.sampul_video.includes('youtu.be'));
    
    // Extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = isYoutube ? getYoutubeId(classDetail.sampul_video!) : null;

    const formatPrice = (price: string) => {
        if (!price) return 'Gratis';
        if (price.toLowerCase() === 'gratis' || price === '0') return 'Gratis';
        const num = parseInt(price.replace(/\D/g, ''));
        if (isNaN(num)) return price;
        return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
    };

    return (
        <>
            <SEO title={`${classDetail.judul} - Kelas KarirKita`} description={classDetail.deskripsi.slice(0, 150)} />
            
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
                    {isPlaying && classDetail.sampul_video ? (
                        isYoutube && youtubeId ? (
                            <div className="w-full h-full relative">
                                <iframe 
                                    className="w-full h-full object-cover pointer-events-auto"
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=1&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&origin=${window.location.origin}`}
                                    title="Class Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                <div className="absolute inset-0 bg-transparent pointer-events-none" />
                            </div>
                        ) : (
                            <video 
                                ref={videoRef}
                                src={classDetail.sampul_video}
                                className={cn("w-full h-full transition-transform duration-1000", isFullscreen ? "object-contain bg-black" : "object-cover")}
                                autoPlay 
                                muted={isMuted} 
                                loop 
                                playsInline
                            />
                        )
                    ) : (
                        <img 
                            src={classDetail.sampul_gambar || classDetail.gambar} 
                            alt={classDetail.judul} 
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
                            {classDetail.judul}
                        </h1>
                        <p className="text-white/90 text-sm md:text-xl max-w-2xl font-medium drop-shadow-md mb-4 md:mb-6">
                            {classDetail.kategori} • {classDetail.tingkat}
                        </p>
                        <button 
                            onClick={playHeroVideo}
                            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm md:text-base font-semibold transition-all group-hover:scale-105"
                        >
                            <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                            Tonton Video
                        </button>
                    </div>
                </div>
                
                <div className={cn(
                    "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 transition-all duration-500",
                    isPlaying ? "mt-0" : "-mt-12 md:-mt-20"
                )}>
                    
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Main Content */}
                        <div className="space-y-8">
                            <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                                <img src={classDetail.gambar} alt={classDetail.judul} className="w-full h-auto object-cover aspect-video" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">{classDetail.judul}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-8">
                                    <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                        <Users className="w-4 h-4" /> Mentor: {classDetail.mentor}
                                    </span>
                                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                        <Calendar className="w-4 h-4" /> {classDetail.tanggal}
                                    </span>
                                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4" /> {classDetail.waktu}
                                    </span>
                                </div>

                                {/* Price and Action Area */}
                                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-lg mb-10 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-24 z-30">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Investasi Belajar</p>
                                        <div className="text-3xl md:text-4xl font-bold text-blue-600">{formatPrice(classDetail.harga)}</div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <Button 
                                            className="flex-1 md:flex-none px-8 py-6 text-lg font-bold shadow-blue-600/20 shadow-lg"
                                            state={{ item: classDetail, type: 'kelas' }}
                                            as={Link}
                                            to="/pembayaran"
                                        >
                                            Daftar Sekarang
                                        </Button>
                                        <Button variant="outline" className="px-4 py-6">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none mb-10">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Deskripsi Kelas</h3>
                                    <p className="whitespace-pre-line text-slate-600 leading-relaxed text-lg">
                                        {classDetail.deskripsi}
                                    </p>
                                </div>

                                {/* Target Pencapaian */}
                                {classDetail.target_pencapaian && (
                                    <div className="mb-10">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">Target Pencapaian</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {classDetail.target_pencapaian.map((target, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                                    <div className="mt-0.5 bg-green-200 rounded-full p-1">
                                                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                                                    </div>
                                                    <span className="text-slate-800 font-medium">{target}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Benefits */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Fasilitas & Benefit</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {classDetail.manfaat.map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <span className="text-slate-700 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Kurikulum Pembelajaran</h3>
                                    <div className="space-y-3">
                                        {classDetail.kurikulum.map((item: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-slate-700 font-medium text-lg">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
