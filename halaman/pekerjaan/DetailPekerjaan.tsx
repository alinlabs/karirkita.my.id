
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Badge } from '../../komponen/ui/Badge';
import { MapPin, Building2, Clock, Briefcase, CheckCircle2, Share2, Bookmark, Loader2, GraduationCap, Award, Calendar, Users, Star, Eye } from 'lucide-react';
import { Lowongan } from '../../types';
import { useData } from '../../context/DataContext';
import { Text } from '../../komponen/ui/Text';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { routingData } from '../../services/routingData';
import { Toast } from '../../komponen/ui/Toast';
import { SEO } from '../../komponen/umum/SEO';
import { cn } from '../../utils/cn';

export const DetailPekerjaan = () => {
  const { slug } = useParams();
  const { jobs, loading } = useData();
  const { user } = useAuth();
  const { toast, showToast } = useToast();
  const [job, setJob] = useState<Lowongan | null>(null);
  const { formatCurrencyString } = useSettings();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!loading && slug) {
      const found = jobs.find(j => j.slug === slug);
      setJob(found || null);
      
      // View Count Logic: Check if viewed this company in this session/device
      if (found && found.perusahaan_id) {
          const storageKey = `viewed_company_${found.perusahaan_id}`;
          if (!localStorage.getItem(storageKey)) {
              // Increment via API
              routingData.incrementView(found.perusahaan_id, 'company');
              // Mark as viewed
              localStorage.setItem(storageKey, 'true');
          }
      }
    }
  }, [slug, jobs, loading]);

  useEffect(() => {
      // Check if user already applied (from local state mock or real data check)
      if (user && job) {
          const hasAppliedStorage = localStorage.getItem(`applied_${user.id}_${job.perusahaan_id}`);
          if (hasAppliedStorage) setHasApplied(true);
      }
  }, [user, job]);

  const handleApply = async () => {
      if (!user || !user.id) {
          showToast({ message: 'Silakan login terlebih dahulu untuk melamar.', type: 'info' });
          return;
      }
      if (!job) return;

      setIsApplying(true);
      try {
          const res: any = await routingData.applyJob(user.id!, job.perusahaan_id);
          if (res.success) {
              setHasApplied(true);
              localStorage.setItem(`applied_${user.id}_${job.perusahaan_id}`, 'true');
              showToast({ message: 'Lamaran berhasil dikirim!', type: 'success' });
          } else {
              showToast({ message: 'Gagal mengirim lamaran.', type: 'error' });
          }
      } catch (error) {
          showToast({ message: 'Terjadi kesalahan sistem.', type: 'error' });
      } finally {
          setIsApplying(false);
      }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
  }

  if (!job) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
            <SEO title="Lowongan Tidak Ditemukan - KarirKita" />
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2"><Text>Lowongan tidak ditemukan</Text></h2>
            <p className="text-slate-500 mb-8 text-center text-sm"><Text>Lowongan yang Anda cari mungkin sudah ditutup atau tautan rusak.</Text></p>
            <Link to="/pekerjaan">
                <Button><Text>Cari Lowongan Lain</Text></Button>
            </Link>
        </div>
    );
  }

  // Prioritize job cover image
  const coverImage = job.banner || job.perusahaan.banner_url || `https://placehold.co/1200x400/1e293b/ffffff?text=${encodeURIComponent(job.posisi)}`;
  
  // Format date if needed, fallback to created_at
  const displayDate = job.created_at 
    ? new Date(job.created_at).toLocaleDateString()
    : "Baru saja";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEO 
        title={`Lowongan ${job.posisi} di ${job.perusahaan.nama} - KarirKita`}
        description={`Lamar lowongan ${job.posisi} di ${job.perusahaan.nama} (${job.lokasi}). ${job.deskripsi_pekerjaan.substring(0, 150)}...`}
        image={coverImage}
        keywords={`lowongan ${job.posisi}, loker ${job.perusahaan.nama}, loker ${job.lokasi}, karirkita`}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* 1. Header Section */}
      <div className="relative">
        <div className="h-56 md:h-80 w-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/50 z-10" />
            <img 
                src={coverImage} 
                alt="Job Cover" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </div>

        {/* Content Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-32">
            <Card className="p-6 md:p-10 border-none shadow-xl rounded-3xl overflow-visible">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    
                    {/* Company Logo */}
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl p-1.5 shadow-md shrink-0 border border-slate-100 -mt-12 md:mt-0 relative z-30">
                        <img 
                            src={job.perusahaan.logo_url} 
                            alt={job.perusahaan.nama} 
                            className="w-full h-full object-contain rounded-xl"
                        />
                    </div>

                    {/* Job Title & Key Info */}
                    <div className="flex-1 w-full -mt-2 md:mt-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
                                {job.tipe_pekerjaan}
                            </Badge>
                            <span className="text-slate-400 text-xs flex items-center font-medium">
                                <Clock className="w-3 h-3 mr-1" /> <Text>Diposting</Text> {displayDate}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
                            <Text>{job.posisi}</Text>
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-slate-600 text-sm font-medium mb-6">
                            <Link to={`/perusahaan/${job.perusahaan.slug}`} className="flex items-center hover:text-blue-600 transition-colors">
                                <Building2 className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                                {job.perusahaan.nama}
                            </Link>
                            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                            
                            {/* Pendidikan */}
                            <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                                {job.pendidikan_minimal || 'Semua Jurusan'}
                            </div>
                            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />

                            {/* Sistem Kerja */}
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                                {job.sistem_kerja || 'On-site'}
                            </div>

                            {/* Gaji */}
                            {job.rentang_gaji && (
                                <>
                                <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                                <div className="flex items-center text-slate-900 font-black text-lg">
                                    {formatCurrencyString(job.rentang_gaji)} 
                                    <span className="text-xs font-normal text-slate-500 ml-1">/ {job.sistem_gaji || 'Bulan'}</span>
                                </div>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto border-t border-slate-100 pt-5 md:border-none md:pt-0">
                            {job.jenis_submit === 'walk_interview' ? (
                                <div className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium text-center border border-slate-200">
                                    <Text>Walk-in Interview: Silakan hadir langsung di lokasi.</Text>
                                </div>
                            ) : job.jenis_submit === 'custom' && job.kontak && job.kontak.length > 0 ? (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    {job.kontak.map((k, idx) => (
                                        <Button 
                                            key={idx}
                                            size="lg" 
                                            onClick={() => {
                                                // 1. Submit application to backend first
                                                handleApply();
                                                // 2. Then redirect
                                                setTimeout(() => {
                                                    if (k.tipe === 'email') window.location.href = `mailto:${k.nilai}`;
                                                    if (k.tipe === 'whatsapp') window.open(`https://wa.me/${k.nilai}`, '_blank');
                                                    if (k.tipe === 'telpon') window.location.href = `tel:${k.nilai}`;
                                                }, 1000);
                                            }}
                                            isLoading={isApplying}
                                            className="w-full sm:w-auto px-8 shadow-lg h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                                        >
                                            <Text>{`Lamar via ${k.tipe === 'whatsapp' ? 'WhatsApp' : k.tipe === 'email' ? 'Email' : 'Telpon'}`}</Text>
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <Button 
                                    size="lg" 
                                    onClick={handleApply}
                                    isLoading={isApplying}
                                    disabled={hasApplied}
                                    className={cn(
                                        "w-full sm:w-auto px-8 shadow-lg h-12 rounded-xl font-bold",
                                        hasApplied ? "bg-green-600 hover:bg-green-700 shadow-green-600/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                                    )}
                                >
                                    {hasApplied ? <><CheckCircle2 className="w-5 h-5 mr-2" /> <Text>Lamaran Terkirim</Text></> : <Text>Lamar Sekarang</Text>}
                                </Button>
                            )}

                            <div className="flex gap-3">
                                <Button variant="outline" size="lg" className="flex-1 sm:flex-none h-12 rounded-xl">
                                    <Bookmark className="w-5 h-5 mr-2" /> <Text>Simpan</Text>
                                </Button>
                                <Button variant="ghost" size="lg" className="px-4 border border-slate-200 h-12 rounded-xl">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </div>

      {/* 2. Main Layout (Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* Job Description */}
                <Card className="p-6 md:p-8 rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                        <Text>Deskripsi Pekerjaan</Text>
                    </h2>
                    <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600 leading-relaxed">
                        <p><Text>{job.deskripsi_pekerjaan}</Text></p>
                        <p>
                            <Text>Kami mencari individu yang bersemangat, inovatif, dan siap menghadapi tantangan baru. Di posisi ini, Anda akan bekerja sama dengan tim lintas fungsi untuk membangun produk yang berdampak.</Text>
                        </p>
                    </div>
                </Card>

                {/* Team & Culture */}
                <Card className="p-6 md:p-8 rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        <Text>Tim & Budaya Kerja</Text>
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4">
                        <Text>Kami percaya bahwa lingkungan kerja yang positif adalah kunci produktivitas. Tim kami terdiri dari individu-individu yang saling mendukung, terbuka terhadap ide baru, dan selalu haus akan ilmu.</Text>
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['Agile', 'Remote-First', 'Inklusif', 'Mentorship'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>

                {/* Requirements */}
                <Card className="p-6 md:p-8 rounded-3xl">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />
                        <Text>Kualifikasi & Persyaratan</Text>
                    </h2>
                    <div className="space-y-3">
                        {job.kualifikasi.map((req, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                </div>
                                <span className="text-slate-700 text-sm md:text-base font-medium"><Text>{req}</Text></span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Benefits Section - Dynamic */}
                {job.fasilitas && job.fasilitas.length > 0 && (
                    <Card className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-blue-600" />
                            <Text>Benefit & Tunjangan</Text>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {job.fasilitas.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100/50 shadow-sm">
                                    <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
                                    <span className="text-slate-700 text-sm font-medium"><Text>{benefit}</Text></span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Job Overview Card */}
                <Card className="p-6 rounded-3xl">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider"><Text>Ringkasan Pekerjaan</Text></h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Briefcase className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase"><Text>Tipe Kontrak</Text></p>
                                <p className="font-bold text-slate-900 text-sm">{job.tipe_pekerjaan}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><GraduationCap className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase"><Text>Pendidikan</Text></p>
                                <p className="font-bold text-slate-900 text-sm">{job.pendidikan_minimal || 'Semua Jurusan'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Calendar className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase"><Text>Pengalaman</Text></p>
                                <p className="font-bold text-slate-900 text-sm">1 - 3 Tahun</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Company Snapshot */}
                <Card className="p-6 rounded-3xl">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider"><Text>Tentang Perusahaan</Text></h3>
                    <div className="flex items-center gap-4 mb-6">
                        <img 
                            src={job.perusahaan.logo_url} 
                            alt={job.perusahaan.nama} 
                            className="w-14 h-14 rounded-lg border border-slate-100 object-contain bg-slate-50" 
                        />
                        <div className="min-w-0">
                            <Link to={`/perusahaan/${job.perusahaan.slug}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline truncate block text-base">
                                {job.perusahaan.nama}
                            </Link>
                            <p className="text-xs text-slate-500 truncate">{job.perusahaan.industri}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500"><Text>Ukuran</Text></span>
                            <span className="font-bold text-slate-800">{job.perusahaan.ukuran_perusahaan}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500"><Text>Dilihat</Text></span>
                            <span className="font-bold text-slate-800 flex items-center gap-1"><Eye className="w-3 h-3"/> {job.perusahaan.dilihat || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm gap-4">
                            <span className="text-slate-500 shrink-0"><Text>Lokasi</Text></span>
                            <span className="font-bold text-slate-800 text-right truncate">{job.perusahaan.lokasi}</span>
                        </div>
                        {job.perusahaan.website_url && (
                            <div className="flex items-center justify-between text-sm gap-4 pt-2 border-t border-slate-200/50">
                                <span className="text-slate-500 shrink-0"><Text>Website</Text></span>
                                <a href={job.perusahaan.website_url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline truncate">
                                    Link
                                </a>
                            </div>
                        )}
                    </div>

                    <Link to={`/perusahaan/${job.perusahaan.slug}`}>
                        <Button variant="outline" className="w-full rounded-xl border-slate-200"><Text>Lihat Profil Perusahaan</Text></Button>
                    </Link>
                </Card>

                {/* Location Map */}
                <Card className="p-0 overflow-hidden rounded-3xl">
                    <div className="p-4 bg-white border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" /> <Text>Lokasi Kerja</Text>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{job.lokasi}</p>
                    </div>
                    <div className="h-48 w-full bg-slate-100 relative">
                        {job.maps ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(job.lokasi)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">Peta tidak tersedia</div>
                        )}
                    </div>
                </Card>

            </div>
        </div>
      </div>
    </div>
  );
};
