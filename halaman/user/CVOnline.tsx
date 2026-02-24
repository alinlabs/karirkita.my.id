
import React, { useEffect, useState } from 'react';
import { Button } from '../../komponen/ui/Button';
import { Printer, Share2, Mail, Phone, MapPin, Globe, Linkedin, Github, ChevronLeft, Briefcase, GraduationCap, Code, Download, ExternalLink, Loader2, Trophy, CheckCircle2, User, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useParams } from 'react-router-dom';
import { routingData } from '../../services/routingData';
import { PencariKerja, Identitas } from '../../types';

export const CVOnline = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const [talentData, setTalentData] = useState<PencariKerja | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [identity, setIdentity] = useState<Partial<Identitas>>({ logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK' });
  const [verifiedIcon, setVerifiedIcon] = useState<string>('');

  useEffect(() => {
      routingData.getIdentity().then(data => {
          if (data) setIdentity(data);
      });

      // Get Verified Icon
      routingData.getIcons().then((icons: any) => {
          if (icons && icons.verifikasi) setVerifiedIcon(icons.verifikasi);
      });

      routingData.getTalents()
        .then(data => {
            let found;
            if (username) {
                found = data.find(t => t.username === username);
            } else if (user) {
                found = data.find(t => t.user_id === user.id) || data[0]; 
            } else {
                found = data[0];
            }
            if (found) setTalentData(found);
        });
  }, [username, user]);

  const handlePrint = () => {
      window.print();
  };

  if (!talentData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600"/></div>;

  const isVerified = talentData.verifikasi === 'disetujui';

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans print:bg-white print:p-0">
        {/* Toolbar - Hidden on Print */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
            <Link to={user ? "/user/profile" : "/"}>
                <Button variant="ghost" className="text-slate-600 hover:bg-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
            </Link>
            <Button onClick={handlePrint} disabled={isGenerating}>
                <Printer className="w-4 h-4 mr-2" /> Cetak PDF
            </Button>
        </div>

        {/* CV Container */}
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-none md:rounded-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
            {/* Header */}
            <div className="bg-slate-900 text-white p-8 md:p-12 print:bg-slate-900 print:text-white print:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img 
                        src={talentData.foto_profil} 
                        alt={talentData.nama_lengkap} 
                        className="w-32 h-32 rounded-full border-4 border-white/20 object-cover shadow-lg"
                    />
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{talentData.nama_lengkap}</h1>
                            {isVerified && verifiedIcon && (
                                <img src={verifiedIcon} alt="Verified" className="w-6 h-6 object-contain" title="Terverifikasi Resmi" />
                            )}
                        </div>
                        <p className="text-xl text-blue-300 font-medium mb-4">{talentData.headline}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-300">
                            {talentData.email_kontak && <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {talentData.email_kontak}</div>}
                            {talentData.telepon_kontak && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {talentData.telepon_kontak}</div>}
                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {talentData.kota}, {talentData.provinsi}</div>
                            {talentData.sosial_media.website_url && <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Portfolio</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 print:p-8 print:gap-8">
                
                {/* Left Column (Main Content) */}
                <div className="md:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wider">Tentang Saya</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{talentData.tentang_saya}</p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wider">Pengalaman Kerja</h3>
                        <div className="space-y-6">
                            {talentData.pengalaman_kerja.map((exp, idx) => (
                                <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-600"></div>
                                    <h4 className="font-bold text-slate-900 text-lg">{exp.posisi}</h4>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-blue-600 font-semibold">{exp.nama_perusahaan}</span>
                                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exp.tanggal_mulai} - {exp.tanggal_selesai}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{exp.deskripsi}</p>
                                    {exp.tanggung_jawab && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.tanggung_jawab.map((t, i) => (
                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full shrink-0"></span> {t}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wider">Pendidikan</h3>
                        <div className="space-y-4">
                            {talentData.riwayat_pendidikan?.map((edu, idx) => (
                                <div key={idx}>
                                    <h4 className="font-bold text-slate-900">{edu.nama_institusi}</h4>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 font-medium">{edu.gelar} - {edu.bidang_studi}</span>
                                        <span className="text-slate-500">{edu.tanggal_mulai} - {edu.tanggal_selesai}</span>
                                    </div>
                                    {edu.deskripsi && <p className="text-sm text-slate-600">{edu.deskripsi}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-8">
                    {/* Skills */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">Keahlian</h3>
                        
                        {/* Hard Skills */}
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Hard Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {talentData.keahlian_detail?.filter(s => s.category === 'hard_skill').map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">{skill.name}</span>
                                )) || talentData.keahlian.map((s, i) => <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">{s}</span>)}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        {talentData.keahlian_detail?.some(s => s.category === 'soft_skill') && (
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Soft Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {talentData.keahlian_detail.filter(s => s.category === 'soft_skill').map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">{skill.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Languages */}
                    {talentData.keahlian_detail?.some(s => s.category === 'language') && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">Bahasa</h3>
                            <ul className="space-y-2">
                                {talentData.keahlian_detail.filter(s => s.category === 'language').map((lang, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-slate-700">{lang.name}</span>
                                        <span className="text-slate-500 text-xs">{lang.level > 80 ? 'Native' : lang.level > 60 ? 'Advanced' : 'Intermediate'}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certifications */}
                    {talentData.sertifikasi && talentData.sertifikasi.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-wider">Sertifikasi</h3>
                            <ul className="space-y-3">
                                {talentData.sertifikasi.map((cert, i) => (
                                    <li key={i} className="text-sm">
                                        <p className="font-bold text-slate-800 leading-tight">{cert.judul}</p>
                                        <p className="text-blue-600 text-xs mt-0.5">{cert.penerbit}</p>
                                        <p className="text-slate-400 text-xs">{cert.tanggal}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 p-6 text-center text-xs text-slate-400 border-t border-slate-200 print:hidden">
                &copy; {new Date().getFullYear()} {identity.nama}. Generated by KarirKita CV Builder.
            </div>
        </div>
    </div>
  );
};
